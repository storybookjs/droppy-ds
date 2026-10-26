<script module lang="ts">
  export type Order = {
    id: string
    placedAt: string
    customer: string
    items: string
    total: number
  }
</script>

<script lang="ts">
  import { Body } from '../../Body'
  import { Separator } from '../../Separator'

  let { orders }: { orders: Order[] } = $props()

  const euros = (amount: number) =>
    amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })
</script>

<div style="display: grid; gap: 0.75rem; padding-top: 1rem">
  {#each orders as order, index (order.id)}
    <div style="display: grid; gap: 0.75rem">
      <div style="display: flex; justify-content: space-between; gap: 1rem">
        <div style="display: grid; gap: 0.125rem">
          <Body size="S" fontWeight="bold">{order.id} · {order.customer}</Body>
          <Body size="XS">{order.items}</Body>
        </div>
        <div style="display: grid; gap: 0.125rem; text-align: right">
          <Body size="S" fontWeight="bold">{euros(order.total)}</Body>
          <Body size="XS">{order.placedAt}</Body>
        </div>
      </div>
      {#if index < orders.length - 1}<Separator />{/if}
    </div>
  {/each}
</div>
