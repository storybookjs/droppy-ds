<!--
  FooterCard's text color assumes a dark footer surface — this decorator
  renders every story against the canonical token for that surface rather than
  a guessed color, so the contrast claim is demonstrable.
-->
<script lang="ts">
  import type { Snippet } from 'svelte'

  let { children }: { children: Snippet } = $props()
</script>

<div style="background: var(--ds-color-surface-inverse); padding: 1.5rem; border-radius: 0.5rem">
  {@render children()}
</div>
