// svelte-package copies all of `src`; strip what only Storybook needs so the
// published package holds components, utils, theme and styles only.
import { readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

const drop = (name) =>
  name === 'fixtures' ||
  name === 'docs' ||
  name === 'animations' ||
  /\.stories\.(ts|js|d\.ts)$/.test(name) ||
  name.endsWith('.mdx') ||
  name.startsWith('BorderedBox.svelte') ||
  name.startsWith('componentSnippet')

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (drop(name)) rmSync(path, { recursive: true, force: true })
    else if (statSync(path).isDirectory()) walk(path)
  }
}

walk(new URL('../dist', import.meta.url).pathname)
