// Ishga tushirish: node test/disc-score.test.mjs   (bog'liqliksiz)
import assert from 'node:assert/strict';
import { discScore, discValidate, discTypesFor } from '../src/index.js';

const mk = (f) => { const a = {}; for (let q = 1; q <= 15; q++) a[q] = f(q); return a; };
const cnt = (r) => [r.d, r.i, r.s, r.c];
const check = (r) => { assert.equal(r.d + r.i + r.s + r.c, 17); assert.equal(r.pct.D + r.pct.I + r.pct.S + r.pct.C, 100); };

// qo'lda hisoblangan kutilma: hamma A -> D: q4,q9,q10,q15=4; I: q1,q6,q12,q13=4; S: q2,q5,q7,q8=4; C: q3,q7,q10,q11,q14=5
let r = discScore(mk(() => 'A')); check(r);
assert.deepEqual(cnt(r), [4, 4, 4, 5]); assert.equal(r.primary, 'C');
assert.deepEqual(r.pct, { D: 24, I: 24, S: 23, C: 29 });

// hamma B -> D: q1,q7,q8,q11,q13,q14=6; I: q2,q3,q5,q7,q10,q15=6; S: q9,q10,q12=3; C: q4,q6=2 (teng: D/I)
r = discScore(mk(() => 'B')); check(r);
assert.deepEqual(cnt(r), [6, 6, 3, 2]); assert.equal(r.primary, 'D/I');
assert.deepEqual(r.pct, { D: 35, I: 35, S: 18, C: 12 });

// hamma C (7- va 10-savolda C yo'q -> A ishlatiladi): faqat 13 savol C
r = discScore(mk((q) => (q === 7 || q === 10 ? 'A' : 'C'))); check(r);
// hamma D (7,10 -> B)
r = discScore(mk((q) => (q === 7 || q === 10 ? 'B' : 'D'))); check(r);

// sof D: har savolda D ga ball beradigan variant
const pure = (T) => mk((q) => { const L = q === 7 || q === 10 ? ['A', 'B'] : ['A', 'B', 'C', 'D']; return L.find((x) => discTypesFor(q, x).includes(T)); });
['D', 'I', 'S', 'C'].forEach((T) => {
  r = discScore(pure(T)); check(r);
  const idx = 'DISC'.indexOf(T);
  assert.equal(cnt(r)[idx], 15); assert.equal(r.primary, T);
  assert.equal(r.pct[T], 88); // 15/17 = 88.2
});

// Barcha 4^13 * 2^2 emas, lekin tasodifiy 20000 ta kombinatsiya: har doim 17 ball va pct = 100, hech biri manfiy emas
let seed = 12345; const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
for (let k = 0; k < 20000; k++) {
  const a = mk((q) => { const L = q === 7 || q === 10 ? 'AB' : 'ABCD'; return L[Math.floor(rnd() * L.length)]; });
  const x = discScore(a); check(x);
  ['D', 'I', 'S', 'C'].forEach((T) => { assert.ok(x.pct[T] >= 0); assert.ok(Math.abs(x.pct[T] - (x[T.toLowerCase()] / 17) * 100) < 1); });
}

// har bir savol: har bir tip uchun aynan bitta variant (7,10 da — ikki tip bir variantda)
for (let q = 1; q <= 15; q++) {
  const L = q === 7 || q === 10 ? ['A', 'B'] : ['A', 'B', 'C', 'D'];
  const tot = L.reduce((n, x) => n + discTypesFor(q, x).length, 0);
  assert.equal(tot, 4, 'savol ' + q);
}

// tekshiruv
const ok = mk(() => 'A');
assert.ok(discValidate(ok).answers);
assert.ok(discValidate(mk(() => 'a')).answers[1] === 'A');
assert.ok(discValidate(mk((q) => (q === 7 ? 'C' : 'A'))).error);   // 7-savolda C yo'q
assert.ok(discValidate(mk((q) => (q === 10 ? 'D' : 'A'))).error);
assert.ok(discValidate(mk((q) => (q === 15 ? '' : 'A'))).error);
const miss = mk(() => 'A'); delete miss[3]; assert.ok(discValidate(miss).error);
assert.ok(discValidate(null).error); assert.ok(discValidate([]).error); assert.ok(discValidate('x').error);
assert.ok(discValidate(mk(() => 'E')).error);
console.log('DISC scoring: hammasi OK');
