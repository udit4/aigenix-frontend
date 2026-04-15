import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const envVar = process.env.ENV;
  const targetMode = (!envVar || envVar === 'staging') ? 'production' : (envVar === 'development' ? 'development' : mode);
  
  const env = loadEnv(targetMode, process.cwd(), 'VITE_');
  
  const defineEnv = {};
  for (const key in env) {
    defineEnv[`import.meta.env.${key}`] = JSON.stringify(env[key]);
  }

  return {
    plugins: [react()],
    define: defineEnv,
  }
})
