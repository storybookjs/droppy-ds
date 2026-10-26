<script lang="ts">
  import { Body } from '../../Body'
  import { Heading } from '../../Heading'
  import { Separator } from '../../Separator'
  import QuantityStepper from '../QuantityStepper.svelte'

  const cartEuros = (amount: number) =>
    amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

  let lines = $state([
    { id: 'cheeseburger', name: 'Cheeseburger', price: 8.5, quantity: 2 },
    { id: 'fries', name: 'Fries', price: 2.5, quantity: 1 },
    { id: 'coca-cola', name: 'Coca-Cola', price: 1.75, quantity: 3 },
  ])

  const total = $derived(lines.reduce((sum, line) => sum + line.price * line.quantity, 0))

  // Story args are accepted (and ignored) so the fixture fits `render`'s type.
  let {}: Record<string, unknown> = $props()
</script>

<div style="display: grid; gap: 1rem; max-width: 26rem">
  <Heading level={3} size={4}>Your order</Heading>

  {#each lines as line (line.id)}
    <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem">
      <Body size="S">{line.name}</Body>
      <div style="display: flex; align-items: center; gap: 1rem">
        <QuantityStepper
          value={line.quantity}
          onChange={(next) => (line.quantity = next)}
          aria-label={`${line.name} quantity`}
        />
        <Body size="S" fontWeight="bold" style="min-width: 4rem; text-align: right">
          {cartEuros(line.price * line.quantity)}
        </Body>
      </div>
    </div>
  {/each}

  <Separator />

  <div style="display: flex; justify-content: space-between">
    <Body fontWeight="bold">Total</Body>
    <Body fontWeight="bold">{cartEuros(total)}</Body>
  </div>
</div>
