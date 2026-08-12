# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 概要

パチスロ実機を模したブラウザプレイ可能なスロットシミュレーターを作るプロジェクト。現状は企画・技術選定段階で、まだコードは存在しない(空フォルダから開始)。

単なる出目の静止画表示ではなく、実際に「回転→ストップボタンで停止→内部抽選結果に応じた滑りコマ数で止まる」という一連のゲームプレイをブラウザ上で再現することを目指す。

## 姉妹プロジェクトとの関係

[../slot_demeedit/](../slot_demeedit/)(別ディレクトリ、Electron製ローカルアプリ)は、雑誌等の画像から切り出した実機の絵柄素材を編集・出目表示するツール。本プロジェクトとは以下の関係を想定している。

- 絵柄画像素材(`data/machines/<machine-id>/symbols/*.png`)や機種データ構造(`machine.json`)は、本プロジェクトでも再利用・拡張できる可能性が高い
- ただしslot_demeeditは「出目を手動で組んで表示・キャプチャーする」ツールであり、内部抽選やリール回転の実装は持たない。本プロジェクトはそこに「実際に回転して抽選結果で止まる」というゲームロジックを追加するもの
- 機種データのスキーマを共通化する場合は、変更がslot_demeedit側の仕様(`data/machines/schema.json`)にも影響することに注意する

## 技術スタック(決定事項)

検討の結果、以下の構成で進めることに決めた。

| 項目 | 決定 | 理由 |
|---|---|---|
| 言語 | TypeScript | 機種データ・確率テーブルなどの型安全性を確保するため |
| ビルドツール | Vite | 高速・設定が軽量・静的出力がそのままどこにでもデプロイできる |
| 描画ライブラリ | Phaser | シーン管理・入力・サウンドまで揃ったゲームフレームワーク。リール回転・停止演出やボタン入力の実装がしやすい |
| バックエンド | なし(静的サイト完結) | 単体プレイ想定でアカウント管理等は不要。設定値や履歴が必要な場合は `localStorage` で対応する |
| ホスティング | GitHub Pages | 無料・GitHubリポジトリのみで完結・静的サイト完結の方針と相性が良いため |

### 検討したが採用しなかった選択肢

- **PixiJS**: WebGLで軽量・高速だが、シーン管理や入力ハンドリングを自前実装する必要があり、今回は見送り
- **素のCanvas API**: 依存ゼロで学習向きだが、アニメーションループを全部自前実装する手間が大きく見送り
- **軽量バックエンド付き構成**: 現時点ではアカウント管理や複数端末間のデータ共有の要件がないため、静的サイト完結を選択。将来ランキング機能等が必要になった場合に再検討する

### GitHub Pages公開に伴う留意点

- リポジトリ名は `slot-games` を想定。公開URLは `https://<user>.github.io/slot-games/` となる
- [vite.config.ts](vite.config.ts) で `base: '/slot-games/'` を設定済み。リポジトリ名を変える場合はここも合わせて変更する
- デプロイは [.github/workflows/deploy.yml](.github/workflows/deploy.yml) のGitHub Actionsで自動化済み。`main` ブランチへのpushをトリガーに `npm run build` → `dist/` をGitHub Pagesへデプロイする
- GitHubリポジトリ側で Settings → Pages → Source を「GitHub Actions」に設定する必要がある(初回のみ)

## 実装時の方針(今後コードを書く際の指針)

- 実機の内部抽選(確率テーブル・設定差)を再現する場合、当たり判定ロジックと描画(Phaserのシーン)はできるだけ分離する。抽選ロジックは単体テストしやすい純粋なTypeScriptモジュールとして書く
- 機種ごとのデータ(絵柄・配列・確率)は `machine.json` 的なデータファイルに外出しし、コードにハードコードしない。slot_demeeditのデータ構造との親和性を意識する
- 絵柄画像などの素材は、実機の絵柄デザインを大幅に改変しないこと(slot_demeeditと同じ制約)

## プロジェクト構成

- [src/main.ts](src/main.ts) — エントリーポイント。`Phaser.Game` を生成し `MainScene` を登録する
- [src/scenes/MainScene.ts](src/scenes/MainScene.ts) — 最初のシーン。現状は3×3のリール窓の枠(プレースホルダー)を描画するのみで、回転・停止・抽選ロジックは未実装
- [vite.config.ts](vite.config.ts) — GitHub Pages公開用に `base` を設定
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) — `main` push時にビルドしGitHub Pagesへ自動デプロイ

## 現状のステータス

- Vite(vanilla-ts) + Phaser のスキャフォールド完了、ビルド確認済み
- GitHubリポジトリ作成・push・GitHub Pages公開まで完了。公開URL: https://makestro776.github.io/slot-games/ (リポジトリ: https://github.com/Makestro776/slot-games 、`main` へのpushで自動デプロイ)
- 実装済みは空のリール窓の描画のみ。回転アニメーション・ストップ入力・内部抽選ロジックはこれから
- 対象機種・移植元データ(slot_demeeditの `data/machines/` を使うか、新規に用意するか)は未確定

## Commands

```
npm install   # 初回のみ
npm run dev   # 開発サーバー起動
npm run build # 型チェック + 本番ビルド(dist/に出力)
npm run preview # ビルド結果をローカルで確認
```
