<script module lang="ts">
  import type { TextOrSnippet } from '../../utils/text'

  export type ScrollAreaProps = {
    children?: TextOrSnippet
    /** Which axes get a scrollbar. `'vertical'` and `'horizontal'` render one
     *  scrollbar; `'both'` renders one of each plus the corner where they meet. */
    orientation?: 'vertical' | 'horizontal' | 'both'
    class?: string
  }
</script>

<script lang="ts">
  import { ScrollArea } from 'bits-ui'
  import theme from '../../theme'
  import { cx } from '../../utils/cx'

  /**
   * A scrollable panel with a themed, hover-revealed scrollbar in place of the
   * platform's own.
   *
   * Bits UI's `ScrollArea` supplies the scroll mechanics — overflow detection,
   * thumb drag, hover/scroll visibility state — so this only adds the shape and
   * which axes get a scrollbar. Scrollbars are force-mounted and faded in via
   * `data-state="visible"`, so they exist in the DOM like Base UI's did.
   */
  let { children, orientation = 'vertical', class: className }: ScrollAreaProps = $props()
</script>

<ScrollArea.Root
  data-part="root"
  type="hover"
  class={cx(theme.ScrollAreaRoot, 'droppy-ScrollArea', className)}
>
  <ScrollArea.Viewport data-part="viewport" class={theme.ScrollAreaViewport} tabindex={0}>
    <div data-part="content" class={theme.ScrollAreaContent}>
      {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
    </div>
  </ScrollArea.Viewport>
  {#if orientation !== 'horizontal'}
    <ScrollArea.Scrollbar
      data-part="scrollbar"
      class={theme.ScrollAreaScrollbar}
      orientation="vertical"
      forceMount
    >
      <ScrollArea.Thumb data-part="thumb" class={theme.ScrollAreaThumb} />
    </ScrollArea.Scrollbar>
  {/if}
  {#if orientation !== 'vertical'}
    <ScrollArea.Scrollbar
      data-part="scrollbar"
      class={theme.ScrollAreaScrollbar}
      orientation="horizontal"
      forceMount
    >
      <ScrollArea.Thumb data-part="thumb" class={theme.ScrollAreaThumb} />
    </ScrollArea.Scrollbar>
  {/if}
  {#if orientation === 'both'}
    <ScrollArea.Corner data-part="corner" class={theme.ScrollAreaCorner} />
  {/if}
</ScrollArea.Root>
