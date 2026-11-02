import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages では https://<ユーザー名>.github.io/sky-closet/ に置かれるため、
  // 本番ビルドのときだけ画像などのパスの先頭を /sky-closet/ にする
  base: process.env.GITHUB_PAGES ? '/sky-closet/' : '/',
  plugins: [react(), tailwindcss()],
})
