<!--
  Shares open/close timing across the tooltips beneath it, so moving between
  neighbouring controls does not replay the opening delay each time. Optional:
  a `Tooltip` outside one gets its own.
-->
<script lang="ts">
  import { Tooltip } from 'bits-ui'
  import type { ComponentProps } from 'svelte'
  import { markTooltipProvider } from './context'

  let { children, ...rest }: ComponentProps<typeof Tooltip.Provider> = $props()

  markTooltipProvider()
</script>

<Tooltip.Provider {...rest}>
  {@render children?.()}
</Tooltip.Provider>
