<!-- `render` hands Link's class and props to a router-aware element. -->
<script lang="ts">
  import Link, { type LinkProps } from '../Link.svelte'
  import RouterLink from './RouterLink.svelte'

  let { render: _render, href: _href, ...args }: LinkProps = $props()
</script>

<Link {...args}>
  {#snippet render(props)}
    <RouterLink to="/orders" {...props} />
  {/snippet}
</Link>
