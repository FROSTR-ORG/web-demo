import fs           from 'fs'
import * as esbuild from 'esbuild'
import path         from 'path'

type Loader = 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'json' | 'text' | 'base64' | 'dataurl' | 'file' | 'binary'

interface BuildOptions {
  bundle       : boolean
  minify       : boolean
  sourcemap    : boolean
  target       : string[]
  entryPoints? : string[]
  outfile?     : string
  format?      : 'esm' | 'iife'
  loader?      : { [ext: string]: Loader }
  alias?       : { [pkg: string]: string }
  resolveExtensions?: string[]
}

const PUBLIC_DIR = 'public'
const DIST_DIR   = 'docs'

async function build(): Promise<void> {
  const watch = process.argv.includes('--watch')

  // Clean dist directory.
  fs.rmSync(`./${DIST_DIR}`, { recursive: true, force: true })

  // Copy public files.
  fs.cpSync(`./${PUBLIC_DIR}`, `./${DIST_DIR}`, { recursive: true })

  // Copy index.html.
  fs.cpSync(`./index.html`, `./${DIST_DIR}/index.html`)

  // Build options
  const commonOptions: BuildOptions = {
    bundle    : true,
    minify    : !watch,
    sourcemap : watch,
    target    : ['chrome58', 'firefox57', 'safari11', 'edge18'],
    alias     : {
      '@': path.resolve('src')
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.json']
  }

  // Build app
  const appBuildOptions: BuildOptions = {
    ...commonOptions,
    entryPoints : ['src/index.tsx'],
    outfile     : `${DIST_DIR}/app.js`,
    format      : 'esm',
    loader      : {
      '.tsx' : 'tsx',
      '.ts'  : 'ts',
      '.css' : 'css',
      '.png' : 'file',
      '.jpg' : 'file',
      '.svg' : 'file',
      '.gif' : 'file',
    },
  }

  // Additional plugins for CSS processing
  const cssPlugin = {
    name: 'css',
    setup(build) {
      build.onResolve({ filter: /\.css$/ }, args => {
        // Handle CSS imports
        const filePath = path.resolve(args.resolveDir, args.path)
        return { path: filePath, namespace: 'css-ns' }
      })

      build.onLoad({ filter: /.*/, namespace: 'css-ns' }, async (args) => {
        // Load and inject CSS
        const css = await fs.promises.readFile(args.path, 'utf8')
        const escaped = css.replace(/`/g, '\\`').replace(/\$/g, '\\$')
        const contents = `
          const style = document.createElement('style')
          style.type = 'text/css'
          style.appendChild(document.createTextNode(\`${escaped}\`))
          document.head.appendChild(style)
        `
        return { contents, loader: 'js' }
      })
    }
  }

  if (watch) {
    // Use context API for watch mode
    const appContext = await esbuild.context({
      ...appBuildOptions,
      plugins: [cssPlugin]
    })
    
    await Promise.all([
      appContext.watch()
    ])
    
    console.log('[ build ] watching for changes...')
  } else {
    // One-time build
    await Promise.all([
      esbuild.build({
        ...appBuildOptions,
        plugins: [cssPlugin]
      })
    ])
    
    console.log('[ build ] build complete')
  }
}

// Run the build function and handle errors
build().catch(err => {
  console.error('[ build ] build failed:', err)
  process.exit(1)
})
