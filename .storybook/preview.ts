import type { Decorator, Preview } from '@storybook/svelte-vite'

import PortalHost from './PortalHost.svelte'
import { withSwatchbookAxes } from './swatchbook-axes'

import '../src/styles/index.css'

/**
 * Renders an overlay story inside its own portal host. The overlay's
 * `container` prop receives the host's id selector, which Bits UI's Portal
 * resolves when the overlay opens — by then the host is in the document.
 *
 * Stories that need a particular frame height set `parameters.portalHostHeight`.
 */
export const inPortalHost: Decorator = (Story, context) => {
  const id = `portal-host-${context.id}`
  const isDocs = context.viewMode === 'docs'
  const height =
    (context.parameters.portalHostHeight as string | undefined) ?? (isDocs ? '26rem' : '100vh')

  Story({ args: { ...context.args, container: context.args.container ?? `#${id}` } })

  return { Component: PortalHost, props: { id, height, isDocs } }
}

// A plain preview object: the Svelte renderer has no `definePreview`, so addon
// preview annotations (docs, a11y, vitest, swatchbook, anatomy) load from main.ts.
const preview: Preview = {
  decorators: [withSwatchbookAxes],
  initialGlobals: { swatchbookAxes: {} },
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
    a11y: { test: 'error' },
    docs: { codePanel: true, toc: { headingSelector: 'h2, h3, h4' } },
    options: {
      storySort: {
        order: [
          'Getting started',
          'Technical guidelines',
          'Accessibility guidelines',
          'Brand guidelines',
          'Choosing components',
          'Component browser',
          'Design tokens',
          'Actions',
          'Forms & input',
          'Navigation',
          'Layout & structure',
          'Feedback & status',
          'Overlays',
          'Typography',
          'Media & content',
        ],
      },
    },
  },
}

export default preview
