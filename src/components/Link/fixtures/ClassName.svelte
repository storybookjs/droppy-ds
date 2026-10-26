<script lang="ts">
  import Link, { type LinkProps } from '../Link.svelte'

  let args: LinkProps = $props()
</script>

<Link {...args} />

<style>
  :global(.link-demo-inset) {
    margin: 1rem;
  }
</style>
