<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { TextOrSnippet } from '../../utils/text'

  export type PageTemplateProps = {
    /** Rendered above the content area, outside the `<main>` landmark. */
    header?: Snippet | string
    /** Rendered below the content area, outside the `<main>` landmark. */
    footer?: Snippet | string
    /** The page content, inside the `<main>` landmark. */
    children?: TextOrSnippet
    class?: string
  }
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  /**
   * The page shell: header, a `<main>` content area, and footer — the top-level
   * layout every routed page sits inside.
   *
   * The content area carries a minimum height so a short page's footer still
   * lands at the bottom of the viewport instead of riding up under the fold.
   */
  let { header, footer, children, class: className }: PageTemplateProps = $props()
</script>

<div data-part="root" class={cx('droppy-PageTemplate', className)}>
  {#if typeof header === 'string'}{header}{:else}{@render header?.()}{/if}
  <main data-part="content" class="droppy-PageTemplate-content">
    {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
  </main>
  {#if typeof footer === 'string'}{footer}{:else}{@render footer?.()}{/if}
</div>
