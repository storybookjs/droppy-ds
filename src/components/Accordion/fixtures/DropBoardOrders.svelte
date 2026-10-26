<script lang="ts">
  import { Badge } from '../../Badge'
  import { Body } from '../../Body'
  import Accordion, { type AccordionProps } from '../Accordion.svelte'

  let args: Omit<AccordionProps, 'items'> & { items?: AccordionProps['items'] } = $props()

  const euros = (amount: number) =>
    amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

  type OrderStatus = 'In the kitchen' | 'Out for delivery' | 'Delivered'

  type Order = {
    id: string
    placedAt: string
    customer: string
    status: OrderStatus
    lines: Array<{ item: string; quantity: number; price: number }>
  }

  /** Anything not yet handed over is still the kitchen's problem. */
  const isOpenOrder = (status: OrderStatus) => status !== 'Delivered'

  const orders: Order[] = [
    {
      id: 'DB-2291',
      placedAt: '13:02',
      customer: 'Ada Lovelace',
      status: 'In the kitchen',
      lines: [
        { item: 'Cheeseburger', quantity: 2, price: 8.5 },
        { item: 'Fries', quantity: 1, price: 2.5 },
      ],
    },
    {
      id: 'DB-2290',
      placedAt: '12:47',
      customer: 'Grace Hopper',
      status: 'Out for delivery',
      lines: [
        { item: 'Cheeseburger', quantity: 1, price: 8.5 },
        { item: 'Coca-Cola', quantity: 2, price: 1.75 },
      ],
    },
    {
      id: 'DB-2289',
      placedAt: '12:31',
      customer: 'Alan Turing',
      status: 'Delivered',
      lines: [
        { item: 'Fries', quantity: 2, price: 2.5 },
        { item: 'Vanilla ice cream', quantity: 1, price: 2 },
      ],
    },
    {
      id: 'DB-2288',
      placedAt: '12:04',
      customer: 'Katherine Johnson',
      status: 'Delivered',
      lines: [{ item: 'Cheeseburger', quantity: 1, price: 8.5 }],
    },
  ]

  const orderTotal = (order: Order) =>
    order.lines.reduce((sum, line) => sum + line.quantity * line.price, 0)

  // Newest first: the orders still in play are the most recent ones, so
  // reverse-chronological puts everything actionable at the top.
  const orderedByTime = [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt))

  const defaultOpen = orderedByTime.filter((order) => isOpenOrder(order.status)).map((o) => o.id)
</script>

{#snippet title(order: Order)}
  <span style="display: inline-flex; align-items: center; gap: 0.5rem">
    <span>{order.placedAt} · {order.customer}</span>
    {#if isOpenOrder(order.status)}<Badge text={order.status} variant="positive" />{/if}
  </span>
{/snippet}

{#snippet content(order: Order)}
  <div style="display: grid; gap: 0.25rem">
    {#each order.lines as line (line.item)}
      <Body size="XS">
        <span style="display: flex; justify-content: space-between; gap: 1rem">
          <span>{line.quantity} × {line.item}</span>
          <span>{euros(line.quantity * line.price)}</span>
        </span>
      </Body>
    {/each}
    <Body size="XS" fontWeight="bold">
      <span style="display: flex; justify-content: space-between; gap: 1rem">
        <span>Total</span>
        <span>{euros(orderTotal(order))}</span>
      </span>
    </Body>
    <Body size="XXS">Order {order.id} · {order.status}</Body>
  </div>
{/snippet}

<!-- Snippets passed as item props take no arguments, so each order gets a pair. -->
{#snippet title0()}{@render title(orderedByTime[0]!)}{/snippet}
{#snippet content0()}{@render content(orderedByTime[0]!)}{/snippet}
{#snippet title1()}{@render title(orderedByTime[1]!)}{/snippet}
{#snippet content1()}{@render content(orderedByTime[1]!)}{/snippet}
{#snippet title2()}{@render title(orderedByTime[2]!)}{/snippet}
{#snippet content2()}{@render content(orderedByTime[2]!)}{/snippet}
{#snippet title3()}{@render title(orderedByTime[3]!)}{/snippet}
{#snippet content3()}{@render content(orderedByTime[3]!)}{/snippet}

<Accordion
  {...args}
  openMultiple={args.openMultiple ?? true}
  defaultValue={args.defaultValue ?? defaultOpen}
  items={orderedByTime.map((order, i) => ({
    value: order.id,
    title: [title0, title1, title2, title3][i]!,
    content: [content0, content1, content2, content3][i]!,
  }))}
/>
