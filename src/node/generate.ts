import * as crypto from 'crypto';
import * as fs from 'fs';
import {performance, PerformanceObserver} from 'perf_hooks';
import * as zlib from 'zlib';
import {Metadata, FileMetadata} from '../models/metadata.model';

import * as config from './config.json';

if (!fs.existsSync('./files')) {
  fs.mkdirSync('./files');
}

const obs = new PerformanceObserver((items) => {
  const entry = items.getEntries()[0];
  console.log(entry.name + ': ' + Math.round(entry.duration / 100) / 10 + 's');
  performance.clearMarks();
});
obs.observe({entryTypes: ['measure']});

interface Gzip {
  original: Buffer;
  compressed: Buffer;
  rate: number;
  pool: number;
}

class Compress {
  private _byteLength(value) {
    let size = 1;
    while (value > Math.pow(2, 8 * size)) {
      size++;
    }
    return size;
  }

  private _randomUInt(bytes) {
    return parseInt(crypto.randomBytes(bytes).toString('hex'), 16);
  }

  private _uIntToBuffer(uint, byteLength) {
    const buf = Buffer.alloc(byteLength);
    buf.writeUIntBE(uint, 0, byteLength);
    return buf;
  }

  private _randomBuffer(byteLength, poolLength) {
    let uint = this._randomUInt(byteLength);
    const maxLength = Math.pow(2, 8 * byteLength);
    uint = Math.round(uint / maxLength * poolLength);
    return this._uIntToBuffer(uint, byteLength);
  }

  private _random(size: number, poolLength): Buffer {
    const byteLength = this._byteLength(poolLength);
    let rdm = this._randomBuffer(byteLength, poolLength);
    while (rdm.length < size) {
      rdm = Buffer.concat([rdm, this._randomBuffer(byteLength, poolLength)]);
    }

    return rdm.slice(0, size);
  }

  public gzip(size: number, poolLength: number): Gzip {
    performance.mark('start');
    const original = this._random(size, poolLength);
    performance.mark('random');
    performance.measure('randomise', 'start', 'random');
    performance.mark('random');
    const gzipped = zlib.gzipSync(original);
    performance.mark('compress');
    performance.measure('compress', 'random', 'compress');

    const current = {
      original: original,
      compressed: gzipped,
      rate: Math.round((size - gzipped.length) / size * 1000) / 10,
      pool: poolLength
    };

    console.log(`${current.original.length}\t-->\t${current.compressed.length}\t: ${
        current.rate}%\t\t${Math.round(current.pool)}`);

    return current;
  }
}

const compress = new Compress();

function findBestCompressionStart(targetSize: number, targetRate: number): Gzip {
  const full = compress.gzip(targetSize, Math.pow(2, 24));
  const zero = compress.gzip(targetSize, 0);

  if (targetRate > zero.rate) {
    return zero;
  }

  if (targetRate < full.rate) {
    return full;
  }

  return findBestCompression(targetSize, targetRate, zero, full);
}


function findBestCompression(
    targetSize: number, targetRate: number, start?: Gzip, end?: Gzip): Gzip {
  if (!start && !end) {
    return findBestCompressionStart(targetSize, targetRate);
  }

  if (Math.abs(start.pool - end.pool) <= 1) {
    const startRateDiff = Math.abs(start.rate - targetRate);
    const endRateDiff = Math.abs(end.rate - targetRate);
    if (startRateDiff < endRateDiff) {
      return start;
    } else {
      return end;
    }
  }

  const diff = Math.abs(end.pool - start.pool) / 2;
  const new_pool = start.pool + diff;
  const current = compress.gzip(targetSize, new_pool);

  console.log(`${Math.round(start.pool)}\t\t${Math.round(end.pool)}`);

  if (current.rate === targetRate) {
    return current;
  }

  if (targetRate > current.rate) {
    return findBestCompression(targetSize, targetRate, start, current);
  } else {
    return findBestCompression(targetSize, targetRate, current, end);
  }
}


function generateFile(size: number, rate: number): FileMetadata {
  const best = findBestCompression(size, rate);

  console.log(`--- ${best.compressed.length} ${best.rate}% ---`);

  const fileName = `./files/${size / 1000}_${rate}`;
  fs.writeFileSync(fileName, best.compressed);
  return {
    fileName: fileName,
    originalSize: size,
    compressedSize: best.compressed.length,
    requestedRate: rate,
    rate: best.rate
  };
}

function generateFiles() {
  const metadata = {files: [], size: 0};
  for (const size of config.sizes) {
    for (const rate of config.rates) {
      const file_metadata = generateFile(size, rate);
      metadata.files.push(file_metadata);
      metadata.size += file_metadata.compressedSize;
    }
  }

  fs.writeFileSync('./files/metadata.json', JSON.stringify(metadata));
}

generateFiles();
