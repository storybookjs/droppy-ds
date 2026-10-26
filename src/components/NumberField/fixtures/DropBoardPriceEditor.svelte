<script lang="ts">
  import { Heading } from '../../Heading'
  import NumberField from '../NumberField.svelte'

  let price = $state(8.5)
  let prepTime = $state(12)

  // Story args are accepted (and ignored) so the fixture fits `render`'s type.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: grid; gap: 1rem; max-width: 24rem">
  <Heading level={3} size={4}>Cheeseburger</Heading>
  <NumberField
    label="Price"
    value={price}
    onValueChange={(next) => (price = next ?? 0)}
    min={0}
    step={0.25}
    format={{ style: 'currency', currency: 'EUR' }}
  />
  <NumberField
    label="Prep time (minutes)"
    value={prepTime}
    onValueChange={(next) => (prepTime = next ?? 0)}
    min={1}
    max={90}
    step={1}
  />
</div>
