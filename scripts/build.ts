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
  publicPath?: string
  assetNames?: string
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

  // Modified CSS plugin to extract CSS into separate files
  const cssPlugin = {
    name: 'css',
    setup(build) {
      build.onResolve({ filter: /\.css$/ }, args => {
        // Handle both direct imports and aliased imports
        let fullPath: string
        if (args.path.startsWith('@/')) {
          // Handle @ alias
          fullPath = path.resolve('src', args.path.slice(2))
        } else if (args.path.startsWith('styles/')) {
          // Handle styles alias
          fullPath = path.resolve('src', args.path)
        } else if (args.path.startsWith('./styles/')) {
          // Handle relative styles imports
          fullPath = path.resolve('src', args.path.slice(2))
        } else if (args.path.startsWith('/styles/')) {
          // Handle absolute styles imports
          fullPath = path.resolve('src', args.path.slice(1))
        } else {
          // Handle other relative imports
          fullPath = path.resolve(args.resolveDir, args.path)
        }
        return { path: fullPath, namespace: 'css-ns' }
      })

      build.onLoad({ filter: /.*/, namespace: 'css-ns' }, async (args) => {
        try {
          // Read the CSS file from its source location
          const css = await fs.promises.readFile(args.path, 'utf8')
          const filename = path.basename(args.path)
          const stylesDir = path.join(DIST_DIR, 'styles')
          
          // Ensure styles directory exists
          await fs.promises.mkdir(stylesDir, { recursive: true })
          
          // Write CSS to styles directory
          const outPath = path.join(stylesDir, filename)
          await fs.promises.writeFile(outPath, css)
          
          // Return a module that imports the CSS file from the styles directory
          // Use absolute path for GitHub Pages compatibility
          return {
            contents: `import '/styles/${filename}'`,
            loader: 'js'
          }
        } catch (error) {
          console.error(`Error processing CSS file ${args.path}:`, error)
          throw error
        }
      })
    }
  }

  // Build options
  const commonOptions: BuildOptions = {
    bundle    : true,
    minify    : !watch,
    sourcemap : true,
    target    : ['chrome58', 'firefox57', 'safari11', 'edge18'],
    alias     : {
      '@': path.resolve('src'),
      'styles': path.resolve('src/styles')
    },
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.css', '.json'],
    loader: {
      '.tsx' : 'tsx',
      '.ts'  : 'ts',
      '.css' : 'css',
      '.png' : 'file',
      '.jpg' : 'file',
      '.svg' : 'file',
      '.gif' : 'file',
    },
    // Add public path for GitHub Pages
    publicPath: '/',
    assetNames: '[name]-[hash]'
  }

  // Build app
  const appBuildOptions: BuildOptions = {
    ...commonOptions,
    entryPoints : ['src/index.tsx'],
    outfile     : `${DIST_DIR}/app.js`,
    format      : 'esm',
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
