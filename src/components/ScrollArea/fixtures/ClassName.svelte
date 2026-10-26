<script lang="ts">
  import ScrollArea, { type ScrollAreaProps } from '../ScrollArea.svelte'

  let args: ScrollAreaProps = $props()
</script>

<ScrollArea {...args} />

<style>
  :global(.scrollarea-demo-inset) {
    margin: 1rem;
  }
</style>
