<!-- Item `render` swaps the default `<a>` for a router-aware link, per item. -->
<script lang="ts">
  import FooterCard, { type FooterCardProps } from '../FooterCard.svelte'
  import RouterLink from './RouterLink.svelte'

  let { links: _links, only, ...args }: FooterCardProps & { only?: 'categories' } = $props()
</script>

{#snippet home(props: Record<string, unknown>)}<RouterLink to="/" {...props} />{/snippet}
{#snippet categories(props: Record<string, unknown>)}<RouterLink
    to="/categories"
    {...props}
  />{/snippet}

<FooterCard
  {...args}
  links={only === 'categories'
    ? [{ name: 'Categories', render: categories }]
    : [
        { name: 'Home', render: home },
        { name: 'Categories', render: categories },
      ]}
/>
