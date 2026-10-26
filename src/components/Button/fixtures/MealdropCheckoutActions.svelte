<!-- The action stack in Mealdrop's cart panel. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Card } from '../../Card'
  import { Heading } from '../../Heading'
  import { Separator } from '../../Separator'
  import Button from '../Button.svelte'

  let {}: Record<string, unknown> = $props()
</script>

<Card padded style="max-width: 24rem">
  <div style="display: flex; align-items: center; justify-content: space-between">
    <Heading level={3} size={4}>Your order</Heading>
    <Button round clear icon="cross" aria-label="Close cart" />
  </div>

  <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
    <Body size="S">Cheeseburger ×2 — €17.00</Body>
    <Body size="S">Fries ×1 — €2.50</Body>
  </div>

  <Separator />

  <div style="display: flex; justify-content: space-between; margin: 1rem 0">
    <Body fontWeight="bold">Total</Body>
    <Body fontWeight="bold">€19.50</Body>
  </div>

  <div style="display: grid; gap: 0.5rem">
    <Button large icon="cart">Go to checkout</Button>
    <Button clear>Continue shopping</Button>
  </div>
</Card>
