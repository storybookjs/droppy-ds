<!-- A restaurant listing tile: photo, name, rating, specialty, categories. -->
<script lang="ts">
  import { Badge } from '../../Badge'
  import { Body } from '../../Body'
  import { Heading } from '../../Heading'
  import { Review } from '../../Review'
  import Card from '../Card.svelte'

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<Card interactive style="width: 18rem" onclick={() => {}}>
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
