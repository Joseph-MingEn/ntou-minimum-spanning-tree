# 最小生成樹：Kruskal 與 Prim

以校園六個地點的無向加權圖，展示兩種最小生成樹演算法，以及不連通圖的最小生成森林。

- `index.html`：互動式繁體中文說明，可直接在瀏覽器開啟，亦可放在 GitHub Pages。
- `src/mst.cpp`：符合題目資料結構要求的 C++17 程式。
- `docs/`：範圍、規格、計畫與計畫審查。
- `tests/`：C++ 輸出與網頁演算法的自動化測試。

## 執行

```sh
c++ -std=c++17 -Wall -Wextra -pedantic src/mst.cpp -o /tmp/mst
/tmp/mst
python3 tests/test_mst.py
```

Kruskal 依序收下 B–C(1)、A–C(2)、D–E(2)、E–F(3)、B–D(5)，總重 13；Prim 從 A 起點依序收下 A–C(2)、C–B(1)、B–D(5)、D–E(2)、E–F(3)，總重 13。非連通範例有 {A,B,C}、{D,E}、{F} 三個分量，森林總重 5。

Kruskal 印出每條邊處理後的 p[]。路徑壓縮只發生在呼叫 find 的路徑，因此 p[] 中的值可能是中間父節點，而非每格都直接指向根。
