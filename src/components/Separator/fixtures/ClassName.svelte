<script lang="ts">
  import Separator, { type SeparatorProps } from '../Separator.svelte'

  let args: SeparatorProps = $props()
</script>

<Separator {...args} />

<style>
  :global(.separator-demo-inset) {
    margin: 1rem;
  }
</style>
