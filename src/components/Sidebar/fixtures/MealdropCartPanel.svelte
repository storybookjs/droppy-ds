<!-- Mealdrop's cart panel, opened from the header's cart button. -->
<script lang="ts">
  import { Body } from '../../Body'
  import { Button } from '../../Button'
  import { Select } from '../../Select'
  import type { PortalContainer } from '../../../utils/container'
  import Sidebar from '../Sidebar.svelte'

  let props: { container?: PortalContainer } & Record<string, unknown> = $props()

  const cartEuros = (amount: number) =>
    amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

  const QUANTITY_OPTIONS = Array.from({ length: 11 }, (_, index) => index)

  let isOpen = $state(false)
  let cartItems = $state([
    {
      id: 'cheeseburger',
      name: 'Cheeseburger',
      description: 'Nice grilled burger with cheese',
      price: 8.5,
      quantity: 2,
    },
    { id: 'fries', name: 'Fries', description: 'Fried french fries', price: 2.5, quantity: 1 },
    {
      id: 'coca-cola',
      name: 'Coca-Cola',
      description: 'Chilled can, 330ml',
      price: 1.75,
      quantity: 3,
    },
  ])

  const totalPrice = $derived(cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const count = $derived(cartItems.reduce((sum, item) => sum + item.quantity, 0))
</script>

<div>
  <div style="padding: 1rem">
    <Button icon="cart" onclick={() => (isOpen = true)}>{String(count)}</Button>
  </div>
  <Sidebar title="Your order" {isOpen} onClose={() => (isOpen = false)} container={props.container}>
    <div style="display: grid; gap: 1.5rem">
      {#each cartItems as item (item.id)}
        <div style="display: flex; align-items: flex-start; gap: 1rem">
          <div style="flex: 0.75">
            <Body type="span" fontWeight="medium">{item.name}</Body>
            <Body>{item.description}</Body>
            <Body>{cartEuros(item.price * item.quantity)}</Body>
          </div>
          <div style="flex: 0.25">
            <Select
              value={item.quantity}
              onChange={(next) => (item.quantity = next as number)}
              aria-label={`${item.name}, ${item.quantity} times`}
              options={QUANTITY_OPTIONS}
            />
          </div>
        </div>
      {/each}
    </div>
    {#snippet footer()}
      <div style="display: flex; flex-direction: column; width: 100%">
        <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem">
          <Body type="span">Total</Body>
          <Body type="span">{cartEuros(totalPrice)}</Body>
        </div>
        <Button disabled={totalPrice === 0} large onclick={() => (isOpen = false)}>Checkout</Button>
      </div>
    {/snippet}
  </Sidebar>
</div>
