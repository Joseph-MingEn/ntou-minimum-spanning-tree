#include <algorithm>
#include <functional>
#include <iostream>
#include <numeric>
#include <queue>
#include <tuple>
#include <vector>
using namespace std;
using Edge = tuple<int, int, int>; // (權重, 起點, 終點)

struct DSU {
    vector<int> p;
    explicit DSU(int n) : p(n) { iota(p.begin(), p.end(), 0); }
    int find(int x) { return p[x] == x ? x : p[x] = find(p[x]); }
    bool unite(int a, int b) {
        a = find(a); b = find(b);
        if (a == b) return false;
        if (a > b) swap(a, b);
        p[b] = a; // 編號較小的根當老大
        return true;
    }
};
char label(int v) { return char('A' + v); }
void edgeText(int u, int v, int w) { cout << label(u) << '-' << label(v) << '(' << w << ')'; }
void showParents(const vector<int>& p) {
    cout << " p[] = [";
    for (size_t i = 0; i < p.size(); ++i) { if (i) cout << ", "; cout << p[i]; }
    cout << "]\n";
}
void kruskal(int n, vector<Edge> edges) {
    sort(edges.begin(), edges.end());
    DSU dsu(n); vector<Edge> chosen; int total = 0;
    for (auto [w, u, v] : edges) {
        bool take = dsu.unite(u, v);
        edgeText(u, v, w);
        if (take) { cout << " 收邊"; chosen.emplace_back(w, u, v); total += w; }
        else cout << " 跳過（成環）";
        showParents(dsu.p);
    }
    cout << "收邊順序:";
    for (auto [w, u, v] : chosen) { cout << ' '; edgeText(u, v, w); }
    int components = n - int(chosen.size());
    cout << "\n總重: " << total << "\n連通分量: " << components << '\n';
    if (components > 1) cout << "圖不連通，結果是最小生成森林（含孤立頂點）。\n";
}
void prim(int n, const vector<Edge>& edges, int start) {
    vector<vector<pair<int,int>>> graph(n);
    for (auto [w,u,v] : edges) { graph[u].emplace_back(w,v); graph[v].emplace_back(w,u); }
    // 票券是 (權重, 頂點, 來源)，greater 使最小的先出列。
    priority_queue<Edge, vector<Edge>, greater<Edge>> pq;
    vector<bool> inTree(n, false); vector<Edge> chosen; int total = 0;
    pq.emplace(0, start, -1);
    while (!pq.empty()) {
        auto [w, v, from] = pq.top(); pq.pop();
        if (inTree[v]) { cout << "丟棄舊票: "; edgeText(from,v,w); cout << "（頂點已在樹中）\n"; continue; }
        inTree[v] = true;
        if (from != -1) { chosen.emplace_back(w,from,v); total += w; }
        for (auto [weight, next] : graph[v]) if (!inTree[next]) pq.emplace(weight,next,v);
    }
    cout << "收邊順序:";
    for (auto [w,u,v] : chosen) { cout << ' '; edgeText(u,v,w); }
    cout << "\n總重: " << total << '\n';
}
int main() {
    vector<Edge> graph = {{4,0,1},{2,0,2},{1,1,2},{5,1,3},{8,2,3},{10,2,4},{2,3,4},{6,3,5},{3,4,5}};
    vector<Edge> disconnected = {{4,0,1},{2,0,2},{1,1,2},{2,3,4}};
    cout << "=== Kruskal ===\n"; kruskal(6, graph);
    cout << "\n=== Prim（起點 A）===\n"; prim(6, graph, 0);
    cout << "\n=== 非連通圖 Kruskal ===\n"; kruskal(6, disconnected);
}
