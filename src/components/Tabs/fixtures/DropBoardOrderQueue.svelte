<script lang="ts">
  import Tabs from '../Tabs.svelte'
  import OrderList, { type Order } from './OrderList.svelte'

  const ordersByStatus: Record<string, Order[]> = {
    kitchen: [
      {
        id: 'DB-2291',
        placedAt: '13:02',
        customer: 'Ada Lovelace',
        items: '2× Cheeseburger, 1× Fries',
        total: 19.5,
      },
      {
        id: 'DB-2292',
        placedAt: '13:08',
        customer: 'Katherine Johnson',
        items: '1× Cheeseburger, 2× Sprite',
        total: 11.5,
      },
    ],
    courier: [
      {
        id: 'DB-2290',
        placedAt: '12:47',
        customer: 'Grace Hopper',
        items: '1× Cheeseburger, 2× Coca-Cola',
        total: 12,
      },
    ],
    delivered: [
      {
        id: 'DB-2289',
        placedAt: '12:31',
        customer: 'Alan Turing',
        items: '2× Fries, 1× Vanilla ice cream',
        total: 7,
      },
      {
        id: 'DB-2288',
        placedAt: '12:04',
        customer: 'Barbara Liskov',
        items: '3× Cheeseburger',
        total: 25.5,
      },
    ],
  }

  // Story args are accepted (and ignored) so the fixture fits `render`'s type.
  let {}: Record<string, unknown> = $props()
</script>

{#snippet kitchen()}<OrderList orders={ordersByStatus.kitchen ?? []} />{/snippet}
{#snippet courier()}<OrderList orders={ordersByStatus.courier ?? []} />{/snippet}
{#snippet delivered()}<OrderList orders={ordersByStatus.delivered ?? []} />{/snippet}

<div style="max-width: 32rem">
  <Tabs
    defaultValue="kitchen"
    tabs={[
      { value: 'kitchen', label: 'In the kitchen', content: kitchen },
      { value: 'courier', label: 'Out for delivery', content: courier },
      { value: 'delivered', label: 'Delivered', content: delivered },
    ]}
  />
</div>
