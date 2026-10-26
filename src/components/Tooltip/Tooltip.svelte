<script module lang="ts">
  import type { Snippet } from 'svelte'
  import type { TextOrSnippet } from '../../utils/text'

  export type TooltipProps = {
    /** The tip's content. */
    label: TextOrSnippet
    /** The element the tip describes — a snippet that spreads the given
     *  `props` onto its own element, which becomes the trigger itself rather
     *  than being wrapped: `{#snippet children({ props })}<Button {...props} />{/snippet}` */
    children: Snippet<[{ props: Record<string, unknown> }]>
    /** Gap between the trigger and the tip. */
    sideOffset?: number
    class?: string
  }
</script>

<script lang="ts">
  import { Tooltip } from 'bits-ui'
  import theme from '../../theme'
  import { cx } from '../../utils/cx'
  import { hasTooltipProvider } from './context'

  /**
   * A hover and focus hint for a control whose purpose is not obvious from its
   * face — typically an icon-only button.
   *
   * A tooltip is a supplement, never the only place the information lives: give
   * the trigger its own accessible name as well.
   */
  let { label, children, sideOffset = 8, class: className }: TooltipProps = $props()

  const standalone = !hasTooltipProvider()
</script>

{#snippet tooltip()}
  <Tooltip.Root>
    <Tooltip.Trigger data-part="trigger">
      {#snippet child({ props })}
        {@render children({ props })}
      {/snippet}
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        {sideOffset}
        data-part="popup"
        class={cx(theme.TooltipPopup, 'droppy-Tooltip', className)}
      >
        {#if typeof label === 'string'}{label}{:else}{@render label()}{/if}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
{/snippet}

{#if standalone}
  <Tooltip.Provider delayDuration={600}>{@render tooltip()}</Tooltip.Provider>
{:else}
  {@render tooltip()}
{/if}
