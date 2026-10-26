<script lang="ts">
  import Link, { type LinkProps } from '../Link.svelte'

  let args: LinkProps = $props()
</script>

<div style="background: #1a1a1a; color: #fff; padding: 1.5rem; border-radius: 0.5rem">
  <Link {...args} style="color: inherit" />
</div>
