const assert = require('node:assert/strict');
const {kruskal, prim, edges, forestEdges} = require('../algorithms.js');
const k = kruskal(6, edges), p = prim(6, edges, 0), f = kruskal(6, forestEdges);
const names = steps => steps.filter(s => s.accepted && s.from !== -1).map(s => `${s.from}-${s.to}:${s.w}`);
assert.deepEqual(names(k.steps), ['1-2:1','0-2:2','3-4:2','4-5:3','1-3:5']);
assert.deepEqual(names(p.steps), ['0-2:2','2-1:1','1-3:5','3-4:2','4-5:3']);
assert.equal(k.total, 13); assert.equal(p.total, 13);
assert.equal(k.steps.length, 9); assert.equal(k.steps.filter(s => !s.accepted).length, 4);
assert.deepEqual(k.steps[4].parents, [0,0,1,3,3,3]);
assert.ok(p.steps.some(s => !s.accepted));
assert.equal(f.total, 5); assert.equal(f.components, 3);
assert.deepEqual(names(f.steps), ['1-2:1','0-2:2','3-4:2']);
console.log('網頁演算法測試通過');
// 題目圖資料與參考數值一致；以枚舉所有五條邊組合獨立驗算最小總重。
assert.deepEqual(edges, [[4,0,1],[2,0,2],[1,1,2],[5,1,3],[8,2,3],[10,2,4],[2,3,4],[6,3,5],[3,4,5]]);
let best = Infinity, connectedTrees = 0;
for (let mask = 0; mask < (1 << edges.length); mask++) {
  const selected = edges.filter((_,i) => (mask >> i) & 1);
  if (selected.length !== 5) continue;
  const seen = new Set([0]); let previousSize;
  do { previousSize=seen.size; for (const [,u,v] of selected) { if (seen.has(u)) seen.add(v); if (seen.has(v)) seen.add(u); } } while (seen.size !== previousSize);
  if (seen.size === 6) { connectedTrees++; best = Math.min(best, selected.reduce((sum,[w])=>sum+w,0)); }
}
assert.ok(connectedTrees > 0);
assert.equal(best, 13);
