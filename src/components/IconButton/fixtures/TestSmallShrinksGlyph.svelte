<script lang="ts">
  import IconButton, { type IconButtonProps } from '../IconButton.svelte'

  let args: IconButtonProps = $props()
</script>

<IconButton {...args} aria-label="regular" />
<IconButton {...args} small aria-label="small" />
