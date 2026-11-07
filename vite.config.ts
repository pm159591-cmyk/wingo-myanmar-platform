import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // ဒီနေရာမှာ base path ကို `./` လို့ ထည့်ပေးဖို့ လိုပါတယ်
})
