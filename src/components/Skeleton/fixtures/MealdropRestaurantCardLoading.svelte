<!-- A restaurant tile loading, beside the tile it becomes. -->
<script lang="ts">
  import { Badge } from '../../Badge'
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import { Review } from '../../Review'
  import Skeleton from '../Skeleton.svelte'

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
  <div role="status" aria-label="Loading restaurants">
    <Card aria-hidden="true" style="width: 18rem">
      <Skeleton height={160} />
      <div style="display: grid; gap: 0.5rem; padding: 1.5rem">
        <Heading level={2} size={4}><Skeleton width="60%" /></Heading>
        <Body size="S"><Skeleton width="45%" /></Body>
        <Body size="S"><Skeleton width="80%" /></Body>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem">
          <Skeleton width={72} height={24} />
          <Skeleton width={104} height={24} />
        </div>
      </div>
    </Card>
  </div>

  <Card style="width: 18rem">
    <img
      src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20"
      alt=""
      style="display: block; height: 160px; width: 100%; object-fit: cover"
    />
    <div style="display: grid; gap: 0.5rem; padding: 1.5rem">
      <Heading level={2} size={4}>Burger Kingdom</Heading>
      <Review rating={4.2} />
      <Body size="S">Nicest place for burgers</Body>
      <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem">
        <Badge text="burgers" />
        <Badge text="comfort food" />
      </div>
    </div>
  </Card>
</div>
