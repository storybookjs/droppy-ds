<script lang="ts">
  import IconButton, { type IconButtonProps } from '../IconButton.svelte'

  let args: IconButtonProps = $props()
</script>

<div
  style="display: flex; gap: 1rem; padding: 1.5rem; background: linear-gradient(135deg, #1a1a1a, #4cc8c0); border-radius: 0.5rem"
>
  <IconButton {...args} name="arrow-left" aria-label="previous" />
  <IconButton {...args} name="arrow-right" aria-label="next" />
</div>
