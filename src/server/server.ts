import {Chance} from 'chance';
import * as crypto from 'crypto';
import * as zlib from 'zlib';

interface Gzip {
  gzip: string;
  rate: number;
  pool: number;
}

// const chance = new Chance();

const requested_rate = 75;
const requested_size = 10000;

// const pool_full =
// '
// !\"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜø£Ø×ƒáíóúñÑªº¿®¬½¼¡«»░▒▓│┤ÁÂÀ©╣║╗╝¢¥┐└┴┬├─┼ãÃ╚╔╩╦╠═╬¤ðÐÊËÈıÍÎÏ┘┌█▄¦Ì▀ÓßÔÒõÕµþÞÚÛÙýÝ¯´≡±‗¾¶§÷¸°¨·¹³²■';

// let s = '';
// for (let i = 0; i < 65535; i++) {
//   s += String.fromCharCode(i);
// }

// const pool_full = s;

// const pool_full_length = pool_full.length;


const pool_full_length = requested_size;
// const buf = Buffer.alloc(pool_full_length);
const buf = crypto.randomBytes(pool_full_length);
const pool_full = buf.toString();


console.log(`POOL FULL: ${pool_full_length}`);

function pool(length = pool_full_length): string {
  if (length < 1) {
    length = 1;
  }
  if (length > pool_full_length) {
    length = pool_full_length;
  }
  return pool_full.substring(0, length);
}

// function random(length = 10, pool_length = pool_full_length): string {
//   return chance.string({length, pool: pool(pool_length)});
// }
// function random(length = 10, pool_length = pool_full_length): string {
//   let rdm = '';
//   while (rdm.length < length) {
//     rdm += pool(pool_length);
//   }

//   return rdm.substring(0, length);
// }
function random(length = 10, pool_length = pool_full_length): string {
  let rdm = '';
  while (rdm.length < length) {
    rdm += pool(pool_length);
  }

  return rdm.substring(0, length);
}

function compress(pool_length = pool_full_length): Gzip {
  const original = random(requested_size, pool_length);
  const gzipped = zlib.gzipSync(original);

  return {
    gzip: gzipped.toString(),
    rate: Math.round(requested_size / gzipped.length * 10000) / 100,
    pool: pool_length
  };
}

function findBestCompression(): Gzip {
  const full = compress(pool_full_length);
  const zero = compress(0);

  let start = full;
  let end = zero;
  if (full.rate > zero.rate) {
    start = zero;
    end = full;
  }

  console.log(`start: ${start.gzip.length}\t\t${start.rate}\t\t${Math.round(start.pool)}`);
  console.log(`end  : ${end.gzip.length}\t\t${end.rate}\t\t${Math.round(end.pool)}`);

  if (requested_rate < start.rate) {
    return start;
  }

  if (requested_rate > end.rate) {
    return end;
  }

  return findBestCompression2(start, end);
}


function findBestCompression2(start: Gzip, end: Gzip): Gzip {
  if (Math.abs(start.pool - end.pool) <= 1) {
    const startRateDiff = Math.abs(start.rate - requested_rate);
    const endRateDiff = Math.abs(end.rate - requested_rate);
    if (startRateDiff < endRateDiff) {
      return start;
    } else {
      return end;
    }
  }

  const diff = Math.abs(end.pool - start.pool) / 2;
  let new_pool = start.pool + diff;
  if (start.pool > end.pool) {
    new_pool = end.pool + diff;
  }
  const current = compress(new_pool);

  console.log(
      current.gzip.length + '\t\t' + current.rate + '\t\t' + Math.round(start.pool) +
      '\t\t' + Math.round(end.pool) + '\t\t' + Math.round(current.pool));

  if (requested_rate < current.rate) {
    return findBestCompression2(start, current);
  } else {
    return findBestCompression2(current, end);
  }
}


// function findBestCompression2(pool_length = pool_full_length / 2, prev?: Gzip): Gzip {
//   const current = compress(pool_length);
//   console.log(current.gzip.length + '\t\t' + current.rate + '\t\t' + current.pool);
//   if (!prev) {
//     return findBestCompression2(0, current);
//   }

//   if (prev.pool < current.pool) {

//   }

//   if (compressed.rate < requested_rate) {
//     if (compressed.pool > 1 && compressed.pool < prev_pool) {
//       return findBestCompression2(compressed.pool - 1, compressed.pool);
//     } else {
//       return compressed;
//     }
//   } else {
//     if (compressed.pool < pool_full_length && compressed.pool > prev_pool) {
//       return findBestCompression2(compressed.pool + 1, compressed.pool);
//     } else {
//       return compressed;
//     }
//   }
// }

const best_compression = findBestCompression();
// console.log(best_compression.gzip);
console.log(best_compression.rate);
console.log(best_compression.pool);
