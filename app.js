const names=['A','B','C','D','E','F'];
const places=['校門','圖書館','餐廳','系館','宿舍','體育館'];
const points=[[65,220],[280,60],[280,380],[540,60],[540,380],[755,220]];
const data={kruskal:kruskal(6,edges),prim:prim(6,edges,0),forest:kruskal(6,forestEdges)};
let mode='kruskal', index=0;
const $=id=>document.getElementById(id);
const edgeName=s=>`${names[s.from]}–${names[s.to]}`;
function renderGraph() {
  const graphEdges=mode==='forest'?forestEdges:edges;
  const taken=data[mode].steps.slice(0,index).filter(s=>s.accepted);
  const last=index?data[mode].steps[index-1]:null;
  const matches=(s,u,v)=>s && ((s.from===u&&s.to===v)||(s.from===v&&s.to===u));
  let html='';
  for (const [w,u,v] of graphEdges) {
    const [x1,y1]=points[u], [x2,y2]=points[v];
    const state=last&&!last.accepted&&matches(last,u,v)?'skipped':taken.some(s=>matches(s,u,v))?'selected':'';
    const x=(x1+x2)/2,y=(y1+y2)/2;
    html+=`<line class="edge ${state}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle class="weight-bg" cx="${x}" cy="${y}" r="15"/><text class="weight" x="${x}" y="${y}">${w}</text>`;
  }
  points.forEach(([x,y],i)=>{const labelY=i===2||i===4?y+56:y-52; html+=`<text class="node-label" x="${x}" y="${labelY}">${places[i]}</text><g class="node"><circle cx="${x}" cy="${y}" r="29"/><text x="${x}" y="${y}">${names[i]}</text></g>`});
  $('graph').innerHTML=html;
}
function render() {
  const result=data[mode], step=index?result.steps[index-1]:null, forest=mode==='forest', isPrim=mode==='prim';
  document.querySelectorAll('.tab').forEach(b=>{const active=b.dataset.mode===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  $('graph-title').textContent=forest?'非連通圖':'校園連通圖'; $('graph-pill').textContent=forest?'6 頂點 · 4 邊':'6 頂點 · 9 邊';
  $('mode-caption').textContent=forest?'KRUSKAL · 最小生成森林':isPrim?'PRIM · 從 A 出發':'KRUSKAL · 由小到大檢查邊';
  $('step-count').textContent=`${index} / ${result.steps.length}`; $('progress-bar').style.width=`${index/result.steps.length*100}%`;
  $('total').textContent=step?step.total:0; $('prev').disabled=index===0; $('next').disabled=index===result.steps.length;
  $('parents').style.display=isPrim?'none':'flex';
  if (!isPrim) $('parents').querySelector('code').textContent=step?`[${step.parents.join(', ')}]`:'[0, 1, 2, 3, 4, 5]';
  if (!step) { $('step-label').textContent='準備開始'; $('step-title').textContent=isPrim?'從 A 開始向外擴展':'從最小的邊開始'; $('step-description').textContent=isPrim?'選擇連接目前樹與新頂點的最小候選邊。':'依權重排序，依序判斷每條邊是否形成環。'; }
  else {
    $('step-label').textContent=`第 ${index} 步 · 權重 ${step.w}`;
    $('step-title').textContent=`${step.accepted?'收下':'跳過'} ${edgeName(step)}`;
    $('step-description').textContent=step.accepted?'這條邊連接了尚未連通的部分，加入結果。':isPrim?'這張候選票的頂點已在樹中，丟棄舊票。':'兩端已連通，再加入會形成環。';
    if (forest && index===result.steps.length) $('step-description').textContent='完成：3 個連通分量（含孤立的 F），形成總重 5 的最小生成森林。';
  }
  renderGraph();
}
document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.mode;index=0;render()}));
$('prev').addEventListener('click',()=>{if(index>0){index--;render()}});
$('next').addEventListener('click',()=>{if(index<data[mode].steps.length){index++;render()}});
$('reset').addEventListener('click',()=>{index=0;render()});
render();
