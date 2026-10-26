<script lang="ts">
  import Icon, { type IconProps } from '../Icon.svelte'

  let args: IconProps = $props()
</script>

<button type="button" aria-label="Add to cart" style="padding: 0.5rem">
  <Icon {...args} />
</button>
