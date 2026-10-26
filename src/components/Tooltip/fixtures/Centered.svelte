<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<div style="padding: 4rem; display: flex; justify-content: center">{@render children()}</div>
