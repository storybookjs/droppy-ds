<script lang="ts">
  import { Body } from '../../Body'
  import { Button } from '../../Button'
  import { Heading } from '../../Heading'
  import Select from '../Select.svelte'

  const euros = (amount: number) =>
    amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

  const BASE_PRICE = 8.5

  /** Mealdrop lets a diner add at most two extras to a customisable dish. */
  const EXTRAS: Record<string, number> = {
    'No extra': 0,
    'Onions +€0.50': 0.5,
    'Jalapeños +€0.75': 0.75,
    'Extra cheese +€1.00': 1,
    'Mature cheddar +€1.25': 1.25,
    'Bacon +€1.50': 1.5,
    'Beef patty +€3.00': 3,
  }

  const EXTRA_OPTIONS = Object.keys(EXTRAS)

  let first = $state('Bacon +€1.50')
  let second = $state('Extra cheese +€1.00')

  const total = $derived(BASE_PRICE + (EXTRAS[first] ?? 0) + (EXTRAS[second] ?? 0))

  // Story args are accepted (and ignored) so the fixture fits `render`'s type.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: grid; gap: 1.25rem; max-width: 22rem">
  <div style="display: grid; gap: 0.25rem">
    <Heading level={3} size={4}>Cheeseburger</Heading>
    <Body size="S">Nice grilled burger with cheese · {euros(BASE_PRICE)}</Body>
  </div>

  <Select
    label="first extra"
    options={EXTRA_OPTIONS}
    value={first}
    onChange={(next) => (first = next as string)}
  />

  <Select
    label="second extra"
    options={EXTRA_OPTIONS}
    value={second}
    onChange={(next) => (second = next as string)}
  />

  <Button large icon="cart">Add to cart · {euros(total)}</Button>
</div>
