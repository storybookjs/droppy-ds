import { fileURLToPath } from 'node:url'

import type { StorybookConfig } from '@storybook/svelte-vite'
import type { Manifests } from 'storybook/internal/types'
import remarkGfm from 'remark-gfm'

import { purgeDocgenFromManifests, readPurgeAllDocgen } from './docgen-purge'

// On freeze-generated experiment branches, experiment.json records whether this build must
// strip all generated docgen (see experiments.config.ts). On a regular checkout the file does
// not exist and the config below is unchanged.
const purgeAllDocgen = readPurgeAllDocgen(
  fileURLToPath(new URL('../experiment.json', import.meta.url))
)

const config: StorybookConfig & {
  managerEntries?: (entries?: string[]) => string[]
  experimental_manifests?: (existing: Manifests | undefined) => Manifests | undefined
} = {
  // Native Svelte CSF: `.stories.svelte` files with `defineMeta` and `<Story>`.
  stories: ['../src/**/*.mdx', '../src/**/*.stories.svelte'],
  addons: [
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: { mdxCompileOptions: { remarkPlugins: [remarkGfm] } },
      },
    },
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-mcp',
    '@component-anatomy/storybook',
    // Preset only (token virtual module + toolbar data): the addon's own
    // preview decorator renders React and can't wrap a Svelte story, so
    // `.storybook/swatchbook-axes.ts` stands in for it, and the manager
    // toolbar is registered in `managerEntries` below.
    {
      name: '@unpunnyfuns/swatchbook-addon/preset',
      options: { configPath: '../swatchbook.config.ts' },
    },
    'storybook-addon-tag-badges',
  ],
  managerEntries: (entries: string[] = []) => [
    ...entries,
    fileURLToPath(import.meta.resolve('@unpunnyfuns/swatchbook-addon/manager')),
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: { docgen: !purgeAllDocgen },
  },
  features: {
    experimentalSearchDocsHeadings: true,
  },
  tags: {
    anatomy: { defaultFilterSelection: 'exclude' },
  },
  ...(purgeAllDocgen
    ? {
        experimental_manifests: (existing: Manifests | undefined) =>
          existing ? purgeDocgenFromManifests(existing) : existing,
      }
    : {}),
}

export default config
