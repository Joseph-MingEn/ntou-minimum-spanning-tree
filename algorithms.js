// 三元組依序比較；資料格式為 [權重, 起點, 終點]。
const edges = [[4,0,1],[2,0,2],[1,1,2],[5,1,3],[8,2,3],[10,2,4],[2,3,4],[6,3,5],[3,4,5]];
const forestEdges = [[4,0,1],[2,0,2],[1,1,2],[2,3,4]];
const compare = (a,b) => a[0]-b[0] || a[1]-b[1] || a[2]-b[2];
function kruskal(n, input) {
  const p = Array.from({length:n}, (_,i)=>i), steps=[]; let total=0, count=0;
  function find(x) { return p[x] === x ? x : (p[x]=find(p[x])); }
  for (const [w,from,to] of [...input].sort(compare)) {
    let a=find(from), b=find(to); const accepted=a!==b;
    if (accepted) { if (a>b) [a,b]=[b,a]; p[b]=a; total+=w; count++; }
    steps.push({w,from,to,accepted,parents:[...p],total});
  }
  return {steps,total,components:n-count};
}
function prim(n, input, start) {
  const visited=Array(n).fill(false), queue=[[0,start,-1]], steps=[]; let total=0;
  while (queue.length) {
    queue.sort(compare); const [w,to,from]=queue.shift();
    if (visited[to]) { steps.push({w,to,from,accepted:false,total}); continue; }
    visited[to]=true;
    if (from!==-1) { total+=w; steps.push({w,to,from,accepted:true,total}); }
    for (const [weight,u,v] of input) {
      if (u===to && !visited[v]) queue.push([weight,v,u]);
      if (v===to && !visited[u]) queue.push([weight,u,v]);
    }
  }
  return {steps,total};
}
if (typeof module !== 'undefined') module.exports={edges,forestEdges,kruskal,prim};
