const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {id, style:{}, textContent:'', innerHTML:'', disabled:false,
    addEventListener(type, fn) { this[type] = fn; }, setAttribute(name,value) {this[name]=value;}, querySelector() { return element('parent-code'); }});
  return elements.get(id);
}
const tabs = ['kruskal','prim','forest'].map(mode => ({dataset:{mode}, classList:{toggle(){}}, setAttribute(){}, addEventListener(type, fn) {this[type]=fn;}}));
const context = {document:{getElementById:element, querySelectorAll(){return tabs;}}, console};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root,'algorithms.js'),'utf8'),context);
vm.runInContext(fs.readFileSync(path.join(root,'app.js'),'utf8'),context);
assert.equal((element('graph').innerHTML.match(/class="edge disconnected"/g)||[]).length, 0);
tabs[2].click();
let graph = element('graph').innerHTML;
assert.equal((graph.match(/class="edge disconnected"/g)||[]).length, 5, '5 條移除道路以虛線顯示');
assert.equal((graph.match(/class="weight-cross"/g)||[]).length, 5, '5 個權重各顯示叉號');
assert.equal(element('graph-pill').textContent,'6 頂點 · 4 邊');
tabs[0].click();
graph = element('graph').innerHTML;
assert.equal((graph.match(/class="edge disconnected"/g)||[]).length, 0, '連通模式不得顯示中斷道路');
console.log('圖形模式測試通過');
