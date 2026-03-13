#!/usr/bin/env bun
import tailwind from 'bun-plugin-tailwind'
import reactCompiler from 'bun-plugin-react-compiler'
import { existsSync, rmSync } from 'fs'
import { $ } from 'bun'

const outdir = 'dist'
if (existsSync(outdir)) {
  console.log(`🗑️ Cleaning previous build at ${outdir}`)
  rmSync(outdir, { recursive: true, force: true })
}

await $`bunx tsr generate`

Bun.build({
  entrypoints: ['src/server/index.ts'],
  splitting: true,
  minify: true,
  naming: {
    asset: '[name]-[hash].[ext]',
    entry: 'index.[ext]',
    chunk: '[name]-[hash].[ext]',
  },
  plugins: [tailwind, reactCompiler],
  outdir,
  target: 'bun',
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
