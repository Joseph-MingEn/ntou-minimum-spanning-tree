#!/usr/bin/env python3
import pathlib, subprocess, tempfile, unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]

class AssignmentTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tmp = tempfile.TemporaryDirectory()
        cls.binary = pathlib.Path(cls.tmp.name) / 'mst'
        subprocess.run(['c++', '-std=c++17', '-Wall', '-Wextra', '-pedantic', str(ROOT/'src/mst.cpp'), '-o', str(cls.binary)], check=True)
        cls.output = subprocess.check_output([str(cls.binary)], text=True)

    @classmethod
    def tearDownClass(cls): cls.tmp.cleanup()

    def test_connected_kruskal(self):
        k = self.output.split('=== Prim')[0]
        self.assertIn('收邊順序: B-C(1) A-C(2) D-E(2) E-F(3) B-D(5)', k)
        self.assertIn('A-B(4) 跳過（成環） p[] = [0, 0, 1, 3, 3, 3]', k)
        self.assertIn('總重: 13', k)
        self.assertEqual(k.count('p[] ='), 9)

    def test_prim(self):
        p = self.output.split('=== Prim')[1].split('=== 非連通')[0]
        self.assertIn('收邊順序: A-C(2) C-B(1) B-D(5) D-E(2) E-F(3)', p)
        self.assertIn('總重: 13', p)
        self.assertIn('舊票', p)

    def test_forest(self):
        f = self.output.split('=== 非連通')[1]
        self.assertIn('收邊順序: B-C(1) A-C(2) D-E(2)', f)
        self.assertIn('總重: 5', f)
        self.assertIn('連通分量: 3', f)
        self.assertIn('最小生成森林', f)

    def test_browser_algorithms(self):
        subprocess.run(['node', str(ROOT/'tests/test-web.js')], check=True)
        subprocess.run(['node', str(ROOT/'tests/test-graph-ui.js')], check=True)

if __name__ == '__main__': unittest.main()
