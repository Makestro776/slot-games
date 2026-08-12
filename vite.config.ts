import { defineConfig } from 'vite'

// GitHub Pages(プロジェクトページ)で公開するため、リポジトリ名をbaseに設定する
// 公開URL: https://<user>.github.io/slot-games/
export default defineConfig({
  base: '/slot-games/',
})
