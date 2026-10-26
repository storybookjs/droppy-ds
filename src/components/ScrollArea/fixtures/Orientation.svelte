<script lang="ts">
  import ScrollArea, { type ScrollAreaProps } from '../ScrollArea.svelte'
  import { cardRow, wideGrid } from './content'

  let args: ScrollAreaProps = $props()
</script>

<div style="display: grid; gap: 1rem">
  <ScrollArea {...args} orientation="vertical" />
  <ScrollArea {...args} orientation="horizontal" children={cardRow()} />
  <ScrollArea {...args} orientation="both" children={wideGrid()} />
</div>
