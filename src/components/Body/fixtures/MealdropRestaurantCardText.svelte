<!-- The text column of a restaurant tile. -->
<script lang="ts">
  import { Badge } from '../../Badge'
  import { Heading } from '../../Heading'
  import Body from '../Body.svelte'

  // Takes no args; typed so it fits the story's `render` signature.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: grid; gap: 0.5rem; max-width: 18rem">
  <Heading level={2} size={4}>Burger Kingdom</Heading>
  <Body size="S">Nicest place for burgers</Body>
  <div style="display: flex; align-items: center; gap: 0.5rem">
    <Body size="XS" fontWeight="medium">Serves</Body>
    <Badge text="burgers" />
    <Badge text="comfort food" />
  </div>
  <Body size="XXS">Delivers in 25–35 min · €2.50 delivery · Staalstraat 12, Amsterdam</Body>
</div>
