<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import type { TextOrSnippet } from '../../utils/text'

  /** Props `Link` hands to a `render` snippet — spread them onto your element. */
  export type LinkRenderProps = Record<string, unknown> & {
    'data-part': 'root'
    class: string
    children?: TextOrSnippet
  }

  export type LinkProps = {
    /** Destination for the default `<a>`. Ignored when `render` is set — the
     *  rendered element owns its own destination (e.g. a router `to` prop). */
    href?: string
    /** Escape hatch for a router-aware link: a snippet receiving this link's
     *  class and the rest of its props, to spread onto your own element. */
    render?: Snippet<[LinkRenderProps]>
    /** The link text. */
    children?: TextOrSnippet
  } & Omit<HTMLAnchorAttributes, 'children' | 'href'>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  /**
   * Inline text link — a plain sentence link, not a button or a nav item.
   *
   * Renders a plain `<a href>` by default. Pass `render` to swap in a
   * router-aware link instead — the design system itself has no router
   * dependency.
   */
  let { children, href, render, class: className, ...rest }: LinkProps = $props()

  // `href` is deliberately not forwarded to `render` — the rendered element
  // computes its own destination.
  const renderProps = $derived({
    'data-part': 'root',
    class: cx('droppy-Link', className as string),
    children,
    ...rest,
  } as LinkRenderProps)
</script>

{#if render}
  {@render render(renderProps)}
{:else}
  <a data-part="root" class={cx('droppy-Link', className as string)} {href} {...rest}>
    {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
  </a>
{/if}
