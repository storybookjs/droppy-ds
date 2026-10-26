import { createRawSnippet, mount, unmount, type Component, type Snippet } from 'svelte'

/**
 * Wraps a component as a snippet, so a plain CSF story can pass composed
 * content (what was JSX in the React stories) through a `Snippet` arg.
 */
export const componentSnippet = <P extends Record<string, unknown>>(
  component: Component<P>,
  props: P = {} as P
): Snippet =>
  createRawSnippet(() => ({
    render: () => '<div style="display: contents"></div>',
    setup: (target) => {
      const instance = mount(component, { target, props })
      return () => unmount(instance)
    },
  }))
