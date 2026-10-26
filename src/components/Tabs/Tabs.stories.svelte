<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent, waitFor } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import OrderList, { type Order } from './fixtures/OrderList.svelte'
  import Tabs, { type TabItem, type TabsProps } from './Tabs.svelte'

  type Tab = TabItem & { label: string; content: string }

  // A fixed-length tuple, not a plain array, so indexed access below doesn't
  // need non-null assertions under `noUncheckedIndexedAccess`.
  const TABS: readonly [Tab, Tab, Tab] = [
    { value: 'overview', label: 'Overview', content: 'Order stats and recent activity.' },
    { value: 'items', label: 'Items', content: 'Menu items and pricing.' },
    { value: 'settings', label: 'Settings', content: 'Store hours and preferences.' },
  ]

  const ORDERS_BY_STATUS: Record<string, Order[]> = {
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

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof TabsProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Navigation/Tabs',
    component: Tabs,
    args: { tabs: [...TABS], defaultValue: 'overview' },
    argTypes: {
      tabs: {
        control: 'object',
        description: 'The set, as `{ value, label, content, disabled? }`. Order is render order.',
      },
      defaultValue: {
        control: 'text',
        description: 'The tab active on first render, for an uncontrolled Tabs.',
      },
      value: {
        // Setting `value` from the panel would make Tabs controlled with nothing
        // driving it, freezing the active tab. ControlledValue shows the pairing.
        control: false,
        description: 'The active tab value, for a controlled Tabs. Pair with `onValueChange`.',
      },
      onValueChange: { description: 'Called with the newly active tab’s value.' },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Tabs` class.',
      },
    },
  })
</script>

<!--
  A store's sub-views. The set and the starting tab are both set below, so the
  controls start populated — edit the tabs or change which one opens first.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ tabs: [...TABS], defaultValue: 'overview', onValueChange: fn() }}
  argTypes={hide('value', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `tabs` is the whole set — no `Tabs.Tab`/`Tabs.Panel` to compose by hand. -->
<Story
  name="tabs"
  exportName="TabsProp"
  tags={['api-ref']}
  argTypes={hide('value', 'onValueChange', 'class')}
  args={{
    tabs: [
      { value: 'food', label: 'Food', content: 'Burgers, sides, and mains.' },
      { value: 'drinks', label: 'Drinks', content: 'Soft drinks and juices.' },
    ],
    defaultValue: 'food',
  }}
/>

<!-- Item `disabled` keeps a tab focusable but never lets it activate. -->
<Story
  name="DisabledTab"
  tags={['api-ref']}
  argTypes={hide('value', 'onValueChange', 'class')}
  args={{ tabs: [TABS[0], { ...TABS[1], disabled: true }, TABS[2]] }}
/>

<!-- `defaultValue` picks the starting tab without making Tabs controlled. -->
<Story
  name="DefaultValue"
  tags={['api-ref']}
  argTypes={hide('value', 'onValueChange', 'class')}
  args={{ defaultValue: 'settings' }}
/>

<!-- `value` and `onValueChange` hand the active tab to the caller's state. -->
<Story
  name="ControlledValue"
  tags={['api-ref', 'highlight']}
  argTypes={hide('defaultValue', 'class')}
  args={{ defaultValue: undefined, value: 'items', onValueChange: fn() }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  name="ClassName"
  tags={['api-ref']}
  argTypes={hide('value', 'onValueChange')}
  args={{ class: 'tabs-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  Tabs activate on click, not on focus: arrowing along the row moves focus
  without swapping the panel, so a keyboard user can read the labels before
  committing. Only Enter, Space, or a click activates.
-->
<Story
  name="FocusDoesNotActivate"
  tags={['highlight']}
  argTypes={hide('value', 'onValueChange', 'class')}
  play={async ({ canvas }) => {
    const tab1 = canvas.getByRole('tab', { name: 'Overview' })

    tab1.focus()
    await userEvent.keyboard('{ArrowRight}')
  }}
/>

<!-- animation — the motion contract -->

<!--
  The indicator writes the active tab's measured position and size to CSS
  custom properties, which the theme transitions on top of — the sliding
  underline. This asserts the mechanism, not the recipe: the variables really
  do change when the active tab changes.
-->
<Story
  name="AnimatedIndicator"
  tags={['animation']}
  argTypes={hide('value', 'onValueChange', 'class')}
  play={async ({ canvas, canvasElement }) => {
    const indicator = canvasElement.querySelector('.TabsIndicator') as HTMLElement

    await waitFor(() => expect(indicator.style.getPropertyValue('--active-tab-width')).not.toBe(''))
    const initialLeft = indicator.style.getPropertyValue('--active-tab-left')

    const tab3 = canvas.getByRole('tab', { name: 'Settings' })
    await userEvent.click(tab3)

    await waitFor(() => expect(tab3).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() =>
      expect(indicator.style.getPropertyValue('--active-tab-left')).not.toBe(initialLeft)
    )
  }}
/>

<!-- anatomy — the rendered part tree -->

<!-- The tab row, its indicator, and one panel per tab. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('tabs', 'defaultValue', 'value', 'onValueChange', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the active value and links tabs to panels.',
        },
        { id: 'list', name: 'List', description: 'The `role="tablist"` row.' },
        { id: 'tab', name: 'Tab', description: 'One button per entry, carrying `aria-selected`.' },
        {
          id: 'indicator',
          name: 'Indicator',
          description: 'The sliding underline; writes the active tab’s position as CSS variables.',
        },
        { id: 'viewport', name: 'Viewport', description: 'Wraps the panels.' },
        {
          id: 'panel',
          name: 'Panel',
          description: 'One per tab; only the active one is shown.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- DropBoard's order queue, split by where each order has got to. -->
<Story
  name="DropBoardOrderQueue"
  tags={['examples']}
  argTypes={hide('tabs', 'value', 'defaultValue', 'onValueChange', 'class')}
>
  {#snippet template()}
    {#snippet kitchen()}<OrderList orders={ORDERS_BY_STATUS.kitchen ?? []} />{/snippet}
    {#snippet courier()}<OrderList orders={ORDERS_BY_STATUS.courier ?? []} />{/snippet}
    {#snippet delivered()}<OrderList orders={ORDERS_BY_STATUS.delivered ?? []} />{/snippet}

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
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestClickActivates"
  tags={['tests']}
  play={async ({ canvas }) => {
    const tab1 = canvas.getByRole('tab', { name: 'Overview' })
    const tab2 = canvas.getByRole('tab', { name: 'Items' })

    await userEvent.click(tab2)

    await waitFor(() => expect(tab2).toHaveAttribute('aria-selected', 'true'))
    await waitFor(() => expect(tab1).toHaveAttribute('aria-selected', 'false'))
    await waitFor(() => expect(canvas.getByText(TABS[1].content)).toBeVisible())
  }}
/>

<Story
  name="TestKeyboardFocusDoesNotActivate"
  tags={['tests']}
  play={async ({ canvas }) => {
    const tab1 = canvas.getByRole('tab', { name: 'Overview' })
    const tab2 = canvas.getByRole('tab', { name: 'Items' })

    tab1.focus()
    await userEvent.keyboard('{ArrowRight}')

    await waitFor(() => expect(tab2).toHaveFocus())
    await expect(tab2).toHaveAttribute('aria-selected', 'false')
    await expect(tab1).toHaveAttribute('aria-selected', 'true')
  }}
/>

<Story
  name="TestDisabledTabNeverActivates"
  tags={['tests']}
  args={{ tabs: [TABS[0], { ...TABS[1], disabled: true }, TABS[2]] }}
  play={async ({ canvas }) => {
    const disabled = canvas.getByRole('tab', { name: 'Items' })

    disabled.focus()
    await expect(disabled).toHaveFocus()

    await userEvent.click(disabled)
    await expect(disabled).toHaveAttribute('aria-selected', 'false')
  }}
/>

<Story
  name="TestControlledValueHoldsItsTab"
  tags={['tests']}
  args={{ defaultValue: undefined, value: 'items', onValueChange: fn() }}
  play={async ({ args, canvas }) => {
    const tab2 = canvas.getByRole('tab', { name: 'Items' })
    const tab3 = canvas.getByRole('tab', { name: 'Settings' })

    await waitFor(() => expect(tab2).toHaveAttribute('aria-selected', 'true'))

    await userEvent.click(tab3)

    // Controlled with no state behind it: the callback fires, the tab doesn't move.
    await expect(args.onValueChange).toHaveBeenCalledWith('settings', expect.anything())
    await expect(tab2).toHaveAttribute('aria-selected', 'true')
  }}
/>

<Story
  name="Empty"
  tags={['empty']}
  args={{
    tabs: [
      { value: 'one', label: 'One', content: 'Content for tab one' },
      { value: 'two', label: 'Two', content: 'Content for tab two' },
    ],
  }}
/>

<style>
  :global(.tabs-demo-inset) {
    margin: 1rem;
  }
</style>
