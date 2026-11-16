import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Resolves a writable dependency cache directory for Vite.
 * Prefers the standard `node_modules/.vite` folder, but automatically falls
 * back to the OS temporary directory if `node_modules` is write-protected
 * (preventing `EPERM: operation not permitted, mkdir` errors on Windows).
 */
function resolveCacheDir(): string {
  const defaultCacheDir = path.resolve(import.meta.dirname, 'node_modules/.vite')
  try {
    fs.mkdirSync(defaultCacheDir, { recursive: true })
    const probe = path.join(defaultCacheDir, `.write-probe-${process.pid}`)
    fs.writeFileSync(probe, '')
    fs.unlinkSync(probe)
    return defaultCacheDir
  } catch {
    return path.join(os.tmpdir(), 'customize137-vite-cache')
  }
}

// https://vite.dev/config/
export default defineConfig({
  // Use relative base paths so production builds in `dist/` work under any subpath
  base: './',
  cacheDir: resolveCacheDir(),
  plugins: [react(), tailwindcss()],
  server: {
    // Bind to all interfaces (localhost, 127.0.0.1, and LAN IP) for easy local testing
    host: true,
    port: 5173,
    strictPort: false,
  },
  preview: {
    host: true,
    port: 4173,
    strictPort: false,
  },
})
