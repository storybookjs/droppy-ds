<script lang="ts">
  import IconButton, { type IconButtonProps } from '../IconButton.svelte'

  let args: IconButtonProps = $props()
</script>

<div style="display: flex; gap: 1rem; align-items: center">
  <IconButton {...args} name="arrow-left" aria-label="previous" />
  <IconButton {...args} name="arrow-left" small aria-label="previous, small" />
</div>
