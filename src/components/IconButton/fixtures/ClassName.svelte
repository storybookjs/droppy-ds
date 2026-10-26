<script lang="ts">
  import IconButton, { type IconButtonProps } from '../IconButton.svelte'

  let args: IconButtonProps = $props()
</script>

<IconButton {...args} />

<style>
  :global(.iconbutton-demo-inset) {
    margin: 1rem;
  }
</style>
