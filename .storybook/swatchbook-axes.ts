import type { Decorator } from '@storybook/svelte-vite'
// Provided by the swatchbook addon's preset (`viteFinal`).
// @ts-expect-error -- virtual module, typed by the addon only for its own preview.
import { axes, cssVarPrefix, defaultTuple } from 'virtual:swatchbook/tokens'

type Axis = { name: string }

/**
 * Framework-agnostic stand-in for swatchbook-addon's preview decorator, which
 * is React-only (it renders a React provider around the story). This keeps
 * the part the canvas needs: the toolbar's axis selection (light/dark…)
 * becomes `data-ds-<axis>` attributes on the root element, which is what the
 * token CSS keys off. The MDX swatch blocks render through React docs and
 * don't need the decorator.
 */
export const withSwatchbookAxes: Decorator = (Story, context) => {
  const selected = (context.globals.swatchbookAxes ?? {}) as Record<string, string>
  const paramAxes = (context.parameters.swatchbook as { axes?: Record<string, string> } | undefined)
    ?.axes
  const tuple: Record<string, string> = { ...defaultTuple, ...selected, ...paramAxes }

  if (typeof document !== 'undefined') {
    for (const axis of axes as Axis[]) {
      const attribute = `data-${cssVarPrefix}-${axis.name}`
      const value = tuple[axis.name]
      if (value === undefined) document.documentElement.removeAttribute(attribute)
      else document.documentElement.setAttribute(attribute, value)
    }
  }

  return Story()
}
