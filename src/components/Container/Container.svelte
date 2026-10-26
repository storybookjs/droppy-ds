<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TextOrSnippet } from '../../utils/text'

  export type ContainerProps = {
    /** Applies the max-width and side padding starting at the desktop breakpoint
     *  (1024px) instead of immediately. Below that width the wrapper adds no
     *  constraint of its own, so a caller supplies its own mobile layout and lets
     *  `Container` take over once the page is wide enough to want the bound. */
    desktopOnly?: boolean
    /** The page content the wrapper bounds. */
    children?: TextOrSnippet
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  let { children, desktopOnly = false, class: className, ...rest }: ContainerProps = $props()
</script>

<div
  data-part="root"
  class={cx(
    'droppy-Container',
    desktopOnly && 'droppy-Container--desktopOnly',
    className as string
  )}
  {...rest}
>
  {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
</div>
