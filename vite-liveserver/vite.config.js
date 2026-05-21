import basicSsl from '@vitejs/plugin-basic-ssl'
import { defineConfig } from 'vite'
import pug from 'pug'
import * as sass from 'sass'
import ts from 'typescript'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))

// ───────────── 可調整設定 ─────────────
const config = {
  pug: {
    srcDir: 'src/pug',   // Pug 來源目錄
    outDir: 'dist',      // HTML 輸出目錄
  },
  sass: {
    srcDir: 'src/sass',  // Sass 來源目錄
    outDir: 'dist/css',  // CSS 輸出目錄
  },
  ts: {
    srcDir: 'src/ts',    // TypeScript 來源目錄
    outDir: 'dist/js',   // JavaScript 輸出目錄
  },
  server: {
    root: 'dist',        // Vite dev server 根目錄
    host: '0.0.0.0',
    https: true,
    port: 7777,
    proxy: {
      "/PointCollection": {
        target: "https://linebcqa.lrp.com.tw",
        changeOrigin: true,
        secure: false,
      },
      "/cdn-cgi": {
        target: "https://linebcqa.lrp.com.tw",
        changeOrigin: true,
        secure: false,
      },
      "/lrp": {
        target: "https://linebcqa.lrp.com.tw",
        changeOrigin: true,
        secure: false,
      },
    }
  },
}
// ──────────────────────────────────────

const resolve = (p) => path.join(ROOT, p)

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function compilePug(file) {
  if (path.basename(file).startsWith('_')) return
  const outDir = resolve(config.pug.outDir)
  ensureDir(outDir)
  try {
    const html = pug.renderFile(file, { pretty: true })
    const outFile = path.join(outDir, path.basename(file).replace(/\.pug$/, '.html'))
    fs.writeFileSync(outFile, html)
    console.log(`[pug] ${path.relative(ROOT, file)} → ${path.relative(ROOT, outFile)}`)
  } catch (e) {
    console.error(`[pug] ERROR in ${path.relative(ROOT, file)}:`, e.message)
  }
}

function compileSass(file) {
  if (path.basename(file).startsWith('_')) return
  const outDir = resolve(config.sass.outDir)
  ensureDir(outDir)
  try {
    const result = sass.compile(file, { style: 'expanded' })
    const outFile = path.join(outDir, path.basename(file).replace(/\.sass$/, '.css'))
    fs.writeFileSync(outFile, result.css)
    console.log(`[sass] ${path.relative(ROOT, file)} → ${path.relative(ROOT, outFile)}`)
  } catch (e) {
    console.error(`[sass] ERROR in ${path.relative(ROOT, file)}:`, e.message)
  }
}

function compileTs(file) {
  if (path.basename(file).startsWith('_')) return
  const outDir = resolve(config.ts.outDir)
  ensureDir(outDir)
  try {
    const source = fs.readFileSync(file, 'utf8')
    const result = ts.transpileModule(source, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
      },
      fileName: file,
    })
    const outFile = path.join(outDir, path.basename(file).replace(/\.ts$/, '.js'))
    fs.writeFileSync(outFile, result.outputText)
    console.log(`[ts] ${path.relative(ROOT, file)} → ${path.relative(ROOT, outFile)}`)
  } catch (e) {
    console.error(`[ts] ERROR in ${path.relative(ROOT, file)}:`, e.message)
  }
}

function compileAllPug() {
  const srcDir = resolve(config.pug.srcDir)
  if (!fs.existsSync(srcDir)) return
  fs.readdirSync(srcDir)
    .filter(f => f.endsWith('.pug') && !f.startsWith('_'))
    .forEach(f => compilePug(path.join(srcDir, f)))
}

function compileAllSass() {
  const srcDir = resolve(config.sass.srcDir)
  if (!fs.existsSync(srcDir)) return
  fs.readdirSync(srcDir)
    .filter(f => f.endsWith('.sass') && !f.startsWith('_'))
    .forEach(f => compileSass(path.join(srcDir, f)))
}

function compileAllTs() {
  const srcDir = resolve(config.ts.srcDir)
  if (!fs.existsSync(srcDir)) return
  fs.readdirSync(srcDir)
    .filter(f => f.endsWith('.ts') && !f.startsWith('_'))
    .forEach(f => compileTs(path.join(srcDir, f)))
}

function pugSassTsWatcher() {
  return {
    name: 'pug-sass-ts-watcher',
    configureServer(server) {
      compileAllPug()
      compileAllSass()
      compileAllTs()

      server.watcher.add([
        resolve(config.pug.srcDir),
        resolve(config.sass.srcDir),
        resolve(config.ts.srcDir),
      ])

      server.watcher.on('all', (event, file) => {
        if (file.endsWith('.pug')) {
          if (path.basename(file).startsWith('_')) compileAllPug()
          else compilePug(file)
        } else if (file.endsWith('.sass')) {
          if (path.basename(file).startsWith('_')) compileAllSass()
          else compileSass(file)
        } else if (file.endsWith('.ts')) {
          if (path.basename(file).startsWith('_')) compileAllTs()
          else compileTs(file)
        }
      })

      console.log(`Watching ${config.pug.srcDir}, ${config.sass.srcDir} and ${config.ts.srcDir}...`)
    },
  }
}

export default defineConfig({
  plugins: [basicSsl(), pugSassTsWatcher()],
  root: config.server.root,
  server: {
    host: config.server.host,
    https: config.server.https,
    port: config.server.port,
    proxy: config.server.proxy,
  },
})
