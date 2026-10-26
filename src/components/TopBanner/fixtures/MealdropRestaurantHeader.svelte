<script lang="ts">
  import { Badge } from '../../Badge'
  import { Review } from '../../Review'
  import TopBanner from '../TopBanner.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<div>
  <TopBanner
    title="Burger Kingdom"
    photoUrl="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20"
  />
  <div style="display: grid; gap: 0.75rem; padding: 1.5rem">
    <Review rating={4.2} />
    <div style="display: flex; gap: 0.5rem">
      <Badge text="burgers" />
      <Badge text="comfort food" />
    </div>
  </div>
</div>
