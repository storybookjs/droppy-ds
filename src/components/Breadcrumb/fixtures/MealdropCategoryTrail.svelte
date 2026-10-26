<!-- The trail under a category page banner. -->
<script lang="ts">
  import { TopBanner } from '../../TopBanner'
  import Breadcrumb from '../Breadcrumb.svelte'
  import RouterLink from './RouterLink.svelte'

  let {}: Record<string, unknown> = $props()
</script>

{#snippet home(props: Record<string, unknown>)}<RouterLink to="/" {...props} />{/snippet}
{#snippet categories(props: Record<string, unknown>)}<RouterLink
    to="/categories"
    {...props}
  />{/snippet}
{#snippet sushi(props: Record<string, unknown>)}<RouterLink
    to="/categories/sushi"
    {...props}
  />{/snippet}

<div>
  <TopBanner
    title="Sushi"
    photoUrl="https://images.pexels.com/photos/9210/food-japanese-food-photography-sushi.jpg?auto=compress&cs=tinysrgb&dpr=2&h=550"
  />
  <div style="padding: 1rem 1.5rem">
    <Breadcrumb
      items={[
        { label: 'home', render: home },
        { label: 'categories', render: categories },
        { label: 'sushi', render: sushi },
      ]}
    />
  </div>
</div>
