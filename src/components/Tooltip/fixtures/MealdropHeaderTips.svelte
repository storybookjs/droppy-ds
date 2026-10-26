<!-- Tips on Mealdrop's two icon-only header controls. -->
<script lang="ts">
  import { IconButton } from '../../IconButton'
  import Tooltip from '../Tooltip.svelte'
  import TooltipProvider from '../TooltipProvider.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<TooltipProvider>
  <div style="display: flex; gap: 1rem">
    <Tooltip label="Your order">
      {#snippet children({ props })}
        <IconButton name="cart" aria-label="Your order" {...props} />
      {/snippet}
    </Tooltip>
    <Tooltip label="Turn on dark mode">
      {#snippet children({ props })}
        <IconButton name="moon" aria-label="Turn on dark mode" {...props} />
      {/snippet}
    </Tooltip>
  </div>
</TooltipProvider>
