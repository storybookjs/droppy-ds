<script lang="ts">
  import Badge, { type BadgeProps } from '../Badge.svelte'

  let args: BadgeProps = $props()
</script>

<div style="display: flex; gap: 0.5rem">
  <Badge {...args} text="vegan" variant="neutral" />
  <Badge {...args} text="new" variant="positive" />
</div>
