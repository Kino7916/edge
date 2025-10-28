import { Glob } from "bun";
import { rmSync } from "fs";

const sourceDirectory = 'src/**/*.ts'
const glob = new Glob(sourceDirectory)
var entrypoints = [...glob.scanSync()]
entrypoints = entrypoints.map((x) => `${x}`)

const BuildOptions: Bun.BuildConfig = {
    entrypoints: entrypoints,
    splitting: true,
    target: 'node',
    tsconfig: 'tsconfig.json',
    external: ['@tryforge/forgescript'],
    naming: '[dir]/[name].js'
}

// Clear existing dist
rmSync('dist', { recursive: true, force: true })

// Running for ES Modules
Bun.build({...BuildOptions, format: 'esm', outdir: 'dist/esm'})

// Transpiling for CommonJS
// # Use tsc since its cleaner
// BuildOptions.splitting = false
// Bun.build({...BuildOptions, format: 'cjs', outdir: 'dist/cjs'})