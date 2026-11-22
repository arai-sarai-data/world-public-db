# World Public Databases / 世界の公共データベース

公開されているのに、散らばっていて誰も比べていないデータを集め、比べられる形にした8つのサイトです。日本語・English・中文・Español に対応しています。

Eight sites that bring scattered public data into one comparable place, in Japanese, English, Chinese and Spanish.

| # | サイト / Site | データ / Data |
|---|---|---|
| 01 | [撤回論文の波及マップ / Retraction Ripple Map](retractions/) | OpenAlex, Crossref + Retraction Watch |
| 02 | [消えた臨床試験トラッカー / Missing Trials Tracker](trials/) | ClinicalTrials.gov API v2 |
| 03 | [気候公約と実排出のズレ計 / Climate Pledge Gap Meter](climate/) | Our World in Data (CO₂ & GHG), national long-term strategies |
| 04 | [同じ物、いくらで買った？ / Same Item, What Price?](procurement/) | Colombia Compra Eficiente (datos.gov.co) |
| 05 | [約束された支援の行方 / Where Did the Aid Go?](aid/) | UN OCHA Financial Tracking Service |
| 06 | [制度の世界地図 / Atlas of Rights and Rules](rights/) | World Bank, Women, Business and the Law |
| 07 | [森を消した商品 / Products That Cleared the Forest](forests/) | Our World in Data (Pendrill et al.; FAO FRA) |
| 08 | [本当の持ち主 / Who Really Owns It](owners/) | Slovakia, Register of Public Sector Partners (RPVS) |

## 仕組み / How it works

- `lib/*.mjs` が各データ源から取得・集計し、`data/*.json` を作ります（Node 20 以上）。
- GitHub Actions（`.github/workflows/update.yml`）が毎週月曜と main の更新時に全データを更新し、`scripts/check.mjs` で異常値を確認してから GitHub Pages に公開します。取得に失敗したデータ源は前回のファイルをそのまま使います。
- 各サイトは静的なHTMLとJavaScriptだけで動きます。

```bash
node scripts/build.mjs all      # すべて更新 / rebuild everything
node scripts/build.mjs climate  # 1つだけ / one site
node scripts/check.mjs          # 検査 / sanity checks
npx serve .                     # ローカル表示 / local preview
```

## 方針 / Principles

1. すべての数字から原本の公開資料へ戻れるようにする。 / Every number links back to its public source.
2. 計算方法を各ページとコードで公開する。 / Methods are published on each page and in code.
3. 個人を晒さない。個人名・生年月日・住所は表示しない。 / No private individual is exposed: no personal names, birth dates or addresses.
4. 無料で誰でも使える。 / Free for everyone.

## ライセンス / Licence

コードは MIT License。集計結果は CC BY 4.0。元データはそれぞれの提供元の利用条件に従います。

Code: MIT. Aggregated results: CC BY 4.0. Source data keep their providers' terms.
