<!-- Story decorator: constrains the field to a realistic form width. -->
<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<div style="max-width: 360px">
  {@render children()}
</div>
