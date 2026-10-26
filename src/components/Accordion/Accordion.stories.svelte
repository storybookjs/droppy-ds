<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent, waitFor } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Badge } from '../Badge'
  import { Body } from '../Body'

  import Accordion, { type AccordionItem, type AccordionProps } from './Accordion.svelte'
  import ControlledAccordion from './fixtures/ControlledAccordion.svelte'

  type Faq = AccordionItem & { value: string; title: string; content: string }

  type OrderStatus = 'In the kitchen' | 'Out for delivery' | 'Delivered'

  type Order = {
    id: string
    placedAt: string
    customer: string
    status: OrderStatus
    lines: Array<{ item: string; quantity: number; price: number }>
  }

  /**
   * Hides props from a story's controls and args table. Every story hides the
   * half of the controlled/uncontrolled pair it doesn't use — `value` and
   * `defaultValue` together would silently fight — plus anything that isn't the
   * point of that story, so its controls stay actionable. The full table is
   * still rendered from the meta by `<ArgTypes>` on the docs page.
   */
  const hide = (...props: Array<keyof AccordionProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  /** Everything but `items`, for stories where only the content matters. */
  const ALL_BUT_ITEMS: Array<keyof AccordionProps> = [
    'value',
    'defaultValue',
    'openMultiple',
    'onValueChange',
    'class',
  ]

  // A fixed-length tuple, not a plain array, so indexed access below doesn't
  // need non-null assertions under `noUncheckedIndexedAccess`.
  const DELIVERY_FAQ: readonly [Faq, Faq, Faq] = [
    {
      value: 'delivery-time',
      title: 'How long will my order take?',
      content:
        'Most orders arrive within 25–40 minutes. You’ll see a live estimate on the order page once the restaurant accepts it.',
    },
    {
      value: 'delivery-area',
      title: 'Do you deliver to my address?',
      content:
        'Enter your postcode on the home page and we’ll show only the restaurants that deliver to you.',
    },
    {
      value: 'order-changes',
      title: 'Can I change my order after paying?',
      content:
        'Until the restaurant accepts it, yes. Open the order and tap Edit. After that, we can no longer modify orders, as restaurants are too busy to handle last-second changes.',
    },
  ]

  const euros = (amount: number) =>
    amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

  /** Anything not yet handed over is still the kitchen's problem. */
  const isOpenOrder = (status: OrderStatus) => status !== 'Delivered'

  const ORDERS: Order[] = [
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
  const ORDERED_BY_TIME = [...ORDERS].sort((a, b) => b.placedAt.localeCompare(a.placedAt))

  const DEFAULT_OPEN = ORDERED_BY_TIME.filter((order) => isOpenOrder(order.status)).map((o) => o.id)

  const { Story } = defineMeta({
    title: 'Layout & structure/Accordion',
    component: Accordion,
    args: {
      items: [...DELIVERY_FAQ],
      onValueChange: fn(),
    },
    argTypes: {
      items: {
        control: 'object',
        description:
          'The sections to render, as `{ value?, title, content, disabled? }`. `value` falls back to the item’s index when omitted.',
      },
      openMultiple: {
        control: 'boolean',
        description: 'Allows more than one item to stay open at once. Single-open when omitted.',
      },
      defaultValue: {
        control: 'object',
        description: 'The item values open on first render, for an uncontrolled accordion.',
      },
      value: {
        // Setting `value` from the controls panel would make the accordion
        // controlled without an `onValueChange` wired to state, freezing it
        // half-open. The ControlledValue story shows the working pairing.
        control: false,
        description:
          'The open item values, for a controlled accordion. Pair with `onValueChange` — see the ControlledValue story.',
      },
      onValueChange: {
        description: 'Called with the full array of open item values whenever it changes.',
      },
      class: {
        // Kept in the meta so the API reference table lists it, then hidden per
        // story — every story except ClassName passes it to `hide()`.
        control: 'text',
        description: 'Merged onto the root alongside the theme’s own classes.',
      },
    },
  })
</script>

<!--
  A customer-facing delivery FAQ: three independent questions, one open at a
  time. Every prop worth playing with is set explicitly below, so the controls
  start populated — toggle `openMultiple`, seed a different `defaultValue`, or
  edit the items directly.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{
    items: [...DELIVERY_FAQ],
    openMultiple: false,
    onValueChange: fn(),
    defaultValue: ['delivery-time'],
  }}
  argTypes={hide('value', 'onValueChange', 'class')}
/>

<!-- api-ref — one story per prop -->

<!--
  `items` is the only required prop. With `value` omitted, each item is keyed
  by its index — so `defaultValue={['1']}` opens the second one.
-->
<Story
  name="Items"
  tags={['api-ref']}
  argTypes={hide('value', 'openMultiple', 'onValueChange', 'class')}
  args={{
    items: [
      { title: 'Payment methods', content: 'iDEAL, credit card, and Apple Pay.' },
      { title: 'Refunds', content: 'Refunds land back on your card within 3–5 working days.' },
    ],
    defaultValue: ['1'],
  }}
/>

<!-- Giving each item an explicit `value` decouples the open state from list order. -->
<Story
  exportName="ItemValues"
  name="Item Values"
  tags={['api-ref']}
  argTypes={hide('value', 'openMultiple', 'onValueChange', 'class')}
  args={{ defaultValue: ['order-changes'] }}
/>

<!--
  `title` and `content` take a snippet as well as a string — a title can carry a
  badge, and content can be any markup.
-->
<Story
  exportName="RichContent"
  name="Rich Content"
  tags={['api-ref', 'highlight']}
  argTypes={hide('items', 'value', 'openMultiple', 'onValueChange', 'class')}
  args={{ defaultValue: ['loyalty'] }}
>
  {#snippet template(args)}
    {#snippet loyaltyTitle()}
      <span style="display: inline-flex; align-items: center; gap: 0.5rem">
        Droppy Rewards
        <Badge text="new" variant="positive" />
      </span>
    {/snippet}
    {#snippet loyaltyContent()}
      <ul style="margin: 0; padding-left: 1rem">
        <li>€1 spent = 1 point</li>
        <li>100 points = free delivery</li>
        <li>Points never expire</li>
      </ul>
    {/snippet}
    {#snippet allergensContent()}
      <Body size="XS">
        Every menu item lists its allergens. Ask the restaurant directly about cross-contamination.
      </Body>
    {/snippet}
    <Accordion
      {...args}
      items={[
        { value: 'loyalty', title: loyaltyTitle, content: loyaltyContent },
        { value: 'allergens', title: 'Allergen information', content: allergensContent },
      ]}
    />
  {/snippet}
</Story>

<!-- A disabled item's trigger stays focusable, but never toggles its panel. -->
<Story
  exportName="DisabledItem"
  name="Disabled Item"
  tags={['api-ref']}
  argTypes={hide('value', 'defaultValue', 'openMultiple', 'onValueChange', 'class')}
  args={{
    items: [DELIVERY_FAQ[0], { ...DELIVERY_FAQ[1], disabled: true }, DELIVERY_FAQ[2]],
  }}
/>

<!-- `openMultiple` lets several panels stay open at once. -->
<Story
  exportName="OpenMultiple"
  name="Open Multiple"
  tags={['api-ref']}
  argTypes={hide('value', 'onValueChange', 'class')}
  args={{ openMultiple: true, defaultValue: ['delivery-time', 'delivery-area'] }}
/>

<!-- `defaultValue` seeds the open items without making the accordion controlled. -->
<Story
  exportName="DefaultValue"
  name="Default Value"
  tags={['api-ref']}
  argTypes={hide('value', 'openMultiple', 'onValueChange', 'class')}
  args={{ defaultValue: ['delivery-area'] }}
/>

<!--
  `value` and `onValueChange` together drive the open state from outside the
  component — the pair is what makes it controlled, and one without the other
  leaves the accordion stuck. `openMultiple` stays visible: it composes with
  a controlled value.
-->
<Story
  exportName="ControlledValue"
  name="Controlled Value"
  tags={['api-ref', 'highlight']}
  argTypes={hide('defaultValue', 'class')}
>
  {#snippet template(args)}
    <ControlledAccordion {...args} />
  {/snippet}
</Story>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('value', 'defaultValue', 'openMultiple', 'onValueChange')}
  args={{ class: 'accordion-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- anatomy — the rendered part tree -->

<!--
  The seven parts an Accordion renders. Hover an entry in the Anatomy panel to
  highlight it in the canvas, or hover the canvas to activate the entry. One
  item starts open, since the panel and content parts only mount while open.
-->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide(...ALL_BUT_ITEMS)}
  args={{ defaultValue: ['delivery-time'] }}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the shared open state, the border, and the column layout.',
        },
        {
          id: 'item',
          name: 'Item',
          description: 'One collapsible section. Carries `[data-panel-open]` while open.',
        },
        {
          id: 'header',
          name: 'Header',
          description: 'The `<h3>` wrapper that puts each trigger in the page outline.',
        },
        {
          id: 'trigger',
          name: 'Trigger',
          description: 'The `<button>` that toggles its panel, carrying `aria-expanded`.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The plus glyph, rotated 45° into a cross while the item is open.',
        },
        {
          id: 'panel',
          name: 'Panel',
          description:
            'The animated region, mounted only while open; its height comes from `--accordion-panel-height`.',
        },
        {
          id: 'content',
          name: 'Content',
          description: 'The padded inner wrapper that the panel clips as it animates.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  Single-open is the default: opening a second item closes the first, so the
  list never grows past one panel's worth of height.
-->
<Story
  exportName="SingleOpenReplaces"
  name="Single Open Replaces"
  tags={['highlight']}
  argTypes={hide('value', 'defaultValue', 'onValueChange', 'class')}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: DELIVERY_FAQ[0].title }))
    await userEvent.click(canvas.getByRole('button', { name: DELIVERY_FAQ[1].title }))
  }}
/>

<!-- animation — the open/close transition contract -->

<!--
  Bits UI measures the panel; the component writes its height to
  `--accordion-panel-height`; the theme transitions `height` on top of that,
  and rotates the trigger's plus icon 45° into a cross via `[data-panel-open]`.
  This asserts the mechanism — the variable actually resolves to a measured
  height — rather than trusting the visible sweep.
-->
<Story
  exportName="PanelHeightTransition"
  name="Panel Height Transition"
  tags={['animation']}
  argTypes={hide(...ALL_BUT_ITEMS)}
  play={async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: DELIVERY_FAQ[0].title })
    const icon = trigger.querySelector('.AccordionIcon') as HTMLElement

    await expect(getComputedStyle(icon).transitionProperty).toContain('transform')

    // The panel only mounts once its item opens, so it can't be queried before.
    await userEvent.click(trigger)
    const panel = await waitFor(() => {
      const node = canvasElement.querySelector('.AccordionPanel')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })

    await expect(getComputedStyle(panel).transitionProperty).toContain('height')

    // The measured height is written to the variable the theme animates;
    // 'auto' is the pre-measurement value, so wait for real pixels.
    await waitFor(() =>
      expect(panel.style.getPropertyValue('--accordion-panel-height')).toMatch(/^[1-9][\d.]*px$/)
    )
    await waitFor(() => expect(getComputedStyle(icon).transform).not.toBe('none'))
  }}
/>

<!-- examples — DropBoard, the restaurant-partner back office -->

<!--
  DropBoard's order feed for the day. The open orders are open by default; the template builds the items and
  seeds `openMultiple`/`defaultValue`, which args still override.
-->
<Story
  exportName="DropBoardOrders"
  name="Drop Board Orders"
  tags={['examples']}
  argTypes={hide('items', 'value', 'class')}
  args={{ items: undefined, defaultValue: undefined, openMultiple: undefined }}
>
  {#snippet template(args)}
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
    {#snippet title0()}{@render title(ORDERED_BY_TIME[0]!)}{/snippet}
    {#snippet content0()}{@render content(ORDERED_BY_TIME[0]!)}{/snippet}
    {#snippet title1()}{@render title(ORDERED_BY_TIME[1]!)}{/snippet}
    {#snippet content1()}{@render content(ORDERED_BY_TIME[1]!)}{/snippet}
    {#snippet title2()}{@render title(ORDERED_BY_TIME[2]!)}{/snippet}
    {#snippet content2()}{@render content(ORDERED_BY_TIME[2]!)}{/snippet}
    {#snippet title3()}{@render title(ORDERED_BY_TIME[3]!)}{/snippet}
    {#snippet content3()}{@render content(ORDERED_BY_TIME[3]!)}{/snippet}
    <Accordion
      {...args}
      openMultiple={args.openMultiple ?? true}
      defaultValue={args.defaultValue ?? DEFAULT_OPEN}
      items={ORDERED_BY_TIME.map((order, i) => ({
        value: order.id,
        title: [title0, title1, title2, title3][i]!,
        content: [content0, content1, content2, content3][i]!,
      }))}
    />
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestSingleOpen"
  name="Test Single Open"
  tags={['tests']}
  argTypes={hide(...ALL_BUT_ITEMS)}
  play={async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: DELIVERY_FAQ[0].title })
    const trigger2 = canvas.getByRole('button', { name: DELIVERY_FAQ[1].title })

    await expect(trigger1).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger1)
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(canvas.getByText(DELIVERY_FAQ[0].content)).toBeVisible())

    await userEvent.click(trigger2)
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    // Opening item 2 replaced item 1 — only one item is open at a time.
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'))
  }}
/>

<Story
  exportName="TestOpenMultiple"
  name="Test Open Multiple"
  tags={['tests']}
  argTypes={hide(...ALL_BUT_ITEMS)}
  args={{ openMultiple: true }}
  play={async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: DELIVERY_FAQ[0].title })
    const trigger2 = canvas.getByRole('button', { name: DELIVERY_FAQ[1].title })

    await userEvent.click(trigger1)
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))

    await userEvent.click(trigger2)
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    // Both stay open at once under `openMultiple`.
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true')
  }}
/>

<Story
  exportName="TestDisabledItem"
  name="Test Disabled Item"
  tags={['tests']}
  argTypes={hide(...ALL_BUT_ITEMS)}
  args={{
    items: [DELIVERY_FAQ[0], { ...DELIVERY_FAQ[1], disabled: true }, DELIVERY_FAQ[2]],
  }}
  play={async ({ canvas }) => {
    const disabledTrigger = canvas.getByRole('button', { name: DELIVERY_FAQ[1].title })

    disabledTrigger.focus()
    await expect(disabledTrigger).toHaveFocus()

    await userEvent.click(disabledTrigger)
    await expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(DELIVERY_FAQ[1].content)).not.toBeInTheDocument()
  }}
/>

<Story
  exportName="TestControlledValue"
  name="Test Controlled Value"
  tags={['tests']}
  argTypes={hide(...ALL_BUT_ITEMS)}
  play={async ({ args, canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: DELIVERY_FAQ[0].title })
    const trigger2 = canvas.getByRole('button', { name: DELIVERY_FAQ[1].title })

    // Seeded open by the wrapper's state, not by `defaultValue`.
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))

    await userEvent.click(trigger2)

    await expect(args.onValueChange).toHaveBeenCalledWith(['delivery-area'])
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'))
  }}
>
  {#snippet template(args)}
    <ControlledAccordion {...args} />
  {/snippet}
</Story>

<!--
  No arrow-key navigation between headers by design (the component cancels
  Bits UI's roving focus, to match the current W3C APG pattern) — only Tab
  order moves focus between triggers, and Space toggles the focused one.
-->
<Story
  exportName="TestKeyboardTabFlow"
  name="Test Keyboard Tab Flow"
  tags={['tests']}
  argTypes={hide(...ALL_BUT_ITEMS)}
  play={async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: DELIVERY_FAQ[0].title })
    const trigger2 = canvas.getByRole('button', { name: DELIVERY_FAQ[1].title })

    trigger1.focus()
    await expect(trigger1).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    await expect(trigger1).toHaveFocus()
    await expect(trigger2).not.toHaveFocus()

    await userEvent.tab()
    await waitFor(() => expect(trigger2).toHaveFocus())

    await userEvent.keyboard(' ')
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
  }}
/>

<Story
  name="Empty"
  tags={['empty']}
  args={{
    items: [
      { value: 'one', title: 'Item one', content: 'Content for item one' },
      { value: 'two', title: 'Item two', content: 'Content for item two' },
    ],
  }}
/>

<style>
  :global(.accordion-demo-inset) {
    margin: 1rem;
  }
</style>
