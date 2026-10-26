<script lang="ts">
  import Link, { type LinkProps } from '../Link.svelte'

  let { children: _children, ...args }: LinkProps = $props()
</script>

<p>Your order is on its way. <Link {...args}>Track it</Link> or view the receipt.</p>
