<script lang="ts">
  import Badge from '../Badge.svelte'

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: flex; gap: 0.5rem">
  <Badge text="vegan" />
  <Badge text="new" variant="positive" />
</div>
