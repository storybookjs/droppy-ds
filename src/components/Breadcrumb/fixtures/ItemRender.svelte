<!-- Item `render` swaps each crumb's `<a>` for a router-aware link. -->
<script lang="ts">
  import Breadcrumb, { type BreadcrumbProps } from '../Breadcrumb.svelte'
  import RouterLink from './RouterLink.svelte'

  let { items: _items, ...args }: Partial<BreadcrumbProps> = $props()
</script>

{#snippet categories(props: Record<string, unknown>)}<RouterLink
    to="/categories"
    {...props}
  />{/snippet}
{#snippet sushi(props: Record<string, unknown>)}<RouterLink
    to="/categories/sushi"
    {...props}
  />{/snippet}

<Breadcrumb
  {...args}
  items={[
    { label: 'categories', render: categories },
    { label: 'sushi', render: sushi },
  ]}
/>
