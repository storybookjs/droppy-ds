<script lang="ts">
  import { Badge } from '../../Badge'
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import Review from '../Review.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
  <Card padded style="width: 16rem">
    <Heading level={2} size={4}>Burger Kingdom</Heading>
    <Review rating={4.2} />
    <Body size="S">Nicest place for burgers</Body>
    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem">
      <Badge text="burgers" />
      <Badge text="comfort food" />
    </div>
  </Card>

  <Card padded style="width: 16rem">
    <Heading level={2} size={4}>'t Kuyltje</Heading>
    <Review color="var(--ds-color-text-primary)" />
    <Body size="S">Pastrami sandwiches</Body>
    <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem">
      <Badge text="new" variant="positive" />
      <Badge text="comfort food" />
    </div>
  </Card>
</div>
