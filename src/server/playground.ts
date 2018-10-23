import * as crypto from 'crypto';
import * as zlib from 'zlib';

interface Gzip {
  original: Buffer;
  gzip: Buffer;
  rate: number;
  pool: number;
}


const requested_size = 10000;

const pool_full_length = requested_size;
// const buf = Buffer.alloc(pool_full_length);
const pool_full = crypto.randomBytes(pool_full_length);



console.log(`POOL FULL: ${pool_full_length}`);

function pool(length = pool_full_length): Buffer {
  if (length < 1) {
    length = 1;
  }
  if (length > pool_full_length) {
    length = pool_full_length;
  }
  return pool_full.slice(0, length);
}

function random(length = 10, pool_length = pool_full_length): Buffer {
  let rdm = Buffer.alloc(pool_full_length);
  while (rdm.length < length) {
    rdm = Buffer.concat([rdm, pool(pool_length)]);
  }

  return rdm.slice(0, length);
}

function compress(pool_length = pool_full_length): Gzip {
  const original = random(requested_size, pool_length);
  const gzipped = zlib.gzipSync(original);

  return {
    original: original,
    gzip: gzipped,
    rate: Math.round(requested_size / gzipped.length * 10000) / 100,
    pool: pool_length
  };
}

const test = compress(pool_full_length);
console.log(`${test.original.length}\t\t${test.gzip.length}\t\t${test.rate}\t\t${Math.round(test.pool)}`);

console.log(test.original.toString());
