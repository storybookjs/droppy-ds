<!-- Story decorator: a bordered parent, so a margin added via `class` is visible. -->
<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<div style="border: 1px dashed var(--ds-color-border-subtle)">
  {@render children()}
</div>
