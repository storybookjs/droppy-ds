<!-- A long Mealdrop order scrolling above a pinned total. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Button } from '../../Button'
  import { Separator } from '../../Separator'
  import ScrollArea from '../ScrollArea.svelte'

  let {}: Record<string, unknown> = $props()

  const cartEuros = (amount: number) =>
    amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

  const longOrder = [
    { name: 'Cheeseburger', quantity: 2, price: 8.5 },
    { name: 'Fries', quantity: 2, price: 2.5 },
    { name: 'Coca-Cola', quantity: 3, price: 1.75 },
    { name: 'Sprite', quantity: 1, price: 1.5 },
    { name: 'Vanilla ice cream', quantity: 2, price: 2 },
    { name: 'Garlic bread', quantity: 1, price: 4 },
    { name: 'Sparkling water', quantity: 2, price: 2.5 },
    { name: 'Tiramisu', quantity: 1, price: 5.5 },
  ]

  const orderTotal = longOrder.reduce((sum, line) => sum + line.price * line.quantity, 0)
</script>

<div
  style="display: flex; flex-direction: column; width: 22rem; border: 1px solid var(--ds-color-border-subtle); border-radius: 8px; overflow: hidden"
>
  <div style="padding: 1rem">
    <Body fontWeight="bold">Your order</Body>
  </div>
  <Separator />

  <ScrollArea class="mealdrop-cart-scroll">
    <div style="display: grid; gap: 0.75rem">
      {#each longOrder as line (line.name)}
        <div style="display: flex; justify-content: space-between; gap: 1rem">
          <Body size="S">{line.quantity}× {line.name}</Body>
          <Body size="S" fontWeight="bold">{cartEuros(line.price * line.quantity)}</Body>
        </div>
      {/each}
    </div>
  </ScrollArea>

  <Separator />
  <div style="display: grid; gap: 0.75rem; padding: 1rem">
    <div style="display: flex; justify-content: space-between">
      <Body fontWeight="bold">Total</Body>
      <Body fontWeight="bold">{cartEuros(orderTotal)}</Body>
    </div>
    <Button large>Checkout</Button>
  </div>
</div>

<style>
  /* The theme layer hard-codes the root at 24rem x 8.5rem, so the panel sizes
     it rather than being clipped by it. */
  :global(.mealdrop-cart-scroll) {
    width: 100%;
    height: 14rem;
    background: transparent;
  }
</style>
