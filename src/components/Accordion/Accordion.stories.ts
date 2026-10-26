import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Accordion, { type AccordionItem, type AccordionProps } from './Accordion.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import ControlledAccordion from './fixtures/ControlledAccordion.svelte'
import DropBoardOrdersDemo from './fixtures/DropBoardOrders.svelte'
import RichContentDemo from './fixtures/RichContent.svelte'

type Faq = AccordionItem & { value: string; title: string; content: string }

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
const deliveryFaq: readonly [Faq, Faq, Faq] = [
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

const meta = {
  title: 'Layout & structure/Accordion',
  component: Accordion,
  args: {
    items: [...deliveryFaq],
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
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A customer-facing delivery FAQ: three independent questions, one open at a
 * time. Every prop worth playing with is set explicitly below, so the controls
 * start populated — toggle `openMultiple`, seed a different `defaultValue`, or
 * edit the items directly.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: {
    items: [...deliveryFaq],
    openMultiple: false,
    onValueChange: fn(),
    defaultValue: ['delivery-time'],
  },
  argTypes: hide('value', 'onValueChange', 'class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/**
 * `items` is the only required prop. With `value` omitted, each item is keyed
 * by its index — so `defaultValue={['1']}` opens the second one.
 */
export const Items: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'openMultiple', 'onValueChange', 'class'),
  args: {
    items: [
      { title: 'Payment methods', content: 'iDEAL, credit card, and Apple Pay.' },
      { title: 'Refunds', content: 'Refunds land back on your card within 3–5 working days.' },
    ],
    defaultValue: ['1'],
  },
}

/** Giving each item an explicit `value` decouples the open state from list order. */
export const ItemValues: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'openMultiple', 'onValueChange', 'class'),
  args: {
    defaultValue: ['order-changes'],
  },
}

/**
 * `title` and `content` take a snippet as well as a string — a title can carry a
 * badge, and content can be any markup.
 */
export const RichContent: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('items', 'value', 'openMultiple', 'onValueChange', 'class'),
  args: { defaultValue: ['loyalty'] },
  // Snippet titles and content can't live in CSF args, so the items are built
  // in the fixture.
  render: (args) => ({ Component: RichContentDemo, props: args }),
}

/** A disabled item's trigger stays focusable, but never toggles its panel. */
export const DisabledItem: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'defaultValue', 'openMultiple', 'onValueChange', 'class'),
  args: {
    items: [deliveryFaq[0], { ...deliveryFaq[1], disabled: true }, deliveryFaq[2]],
  },
}

/** `openMultiple` lets several panels stay open at once. */
export const OpenMultiple: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'onValueChange', 'class'),
  args: {
    openMultiple: true,
    defaultValue: ['delivery-time', 'delivery-area'],
  },
}

/** `defaultValue` seeds the open items without making the accordion controlled. */
export const DefaultValue: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'openMultiple', 'onValueChange', 'class'),
  args: {
    defaultValue: ['delivery-area'],
  },
}

/**
 * `value` and `onValueChange` together drive the open state from outside the
 * component — the pair is what makes it controlled, and one without the other
 * leaves the accordion stuck.
 */
export const ControlledValue: Story = {
  tags: ['api-ref', 'highlight'],
  // `openMultiple` stays visible: it composes with a controlled value.
  argTypes: hide('defaultValue', 'class'),
  render: (args) => ({ Component: ControlledAccordion, props: args }),
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('value', 'defaultValue', 'openMultiple', 'onValueChange'),
  args: {
    class: 'accordion-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/**
 * The seven parts an Accordion renders. Hover an entry in the Anatomy panel to
 * highlight it in the canvas, or hover the canvas to activate the entry. One
 * item starts open, since the panel and content parts only mount while open.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide(...ALL_BUT_ITEMS),
  args: { defaultValue: ['delivery-time'] },
  parameters: {
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
  },
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Single-open is the default: opening a second item closes the first, so the
 * list never grows past one panel's worth of height.
 */
export const SingleOpenReplaces: Story = {
  tags: ['highlight'],
  argTypes: hide('value', 'defaultValue', 'onValueChange', 'class'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: deliveryFaq[0].title }))
    await userEvent.click(canvas.getByRole('button', { name: deliveryFaq[1].title }))
  },
}

/* ------------------------------------------------------------------ */
/* animation — the open/close transition contract                      */
/* ------------------------------------------------------------------ */

/**
 * Bits UI measures the panel; the component writes its height to
 * `--accordion-panel-height`; the theme transitions `height` on top of that,
 * and rotates the trigger's plus icon 45° into a cross via `[data-panel-open]`.
 * This asserts the mechanism — the variable actually resolves to a measured
 * height — rather than trusting the visible sweep.
 */
export const PanelHeightTransition: Story = {
  tags: ['animation'],
  argTypes: hide(...ALL_BUT_ITEMS),
  play: async ({ canvas, canvasElement }) => {
    const trigger = canvas.getByRole('button', { name: deliveryFaq[0].title })
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
  },
}

/* ------------------------------------------------------------------ */
/* examples — DropBoard, the restaurant-partner back office            */
/* ------------------------------------------------------------------ */

/** DropBoard's order feed for the day. */
export const DropBoardOrders: Story = {
  tags: ['examples'],
  argTypes: hide('items', 'value', 'class'),
  // The open orders are open by default; the fixture builds the items and
  // seeds `openMultiple`/`defaultValue`, which args still override.
  args: { items: undefined, defaultValue: undefined, openMultiple: undefined },
  render: (args) => ({ Component: DropBoardOrdersDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestSingleOpen: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  play: async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const trigger2 = canvas.getByRole('button', { name: deliveryFaq[1].title })

    await expect(trigger1).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(trigger1)
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(canvas.getByText(deliveryFaq[0].content)).toBeVisible())

    await userEvent.click(trigger2)
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    // Opening item 2 replaced item 1 — only one item is open at a time.
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'))
  },
}

export const TestOpenMultiple: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  args: { openMultiple: true },
  play: async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const trigger2 = canvas.getByRole('button', { name: deliveryFaq[1].title })

    await userEvent.click(trigger1)
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))

    await userEvent.click(trigger2)
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    // Both stay open at once under `openMultiple`.
    await expect(trigger1).toHaveAttribute('aria-expanded', 'true')
  },
}

export const TestDisabledItem: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  args: {
    items: [deliveryFaq[0], { ...deliveryFaq[1], disabled: true }, deliveryFaq[2]],
  },
  play: async ({ canvas }) => {
    const disabledTrigger = canvas.getByRole('button', { name: deliveryFaq[1].title })

    disabledTrigger.focus()
    await expect(disabledTrigger).toHaveFocus()

    await userEvent.click(disabledTrigger)
    await expect(disabledTrigger).toHaveAttribute('aria-expanded', 'false')
    await expect(canvas.queryByText(deliveryFaq[1].content)).not.toBeInTheDocument()
  },
}

export const TestControlledValue: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  render: (args) => ({ Component: ControlledAccordion, props: args }),
  play: async ({ args, canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const trigger2 = canvas.getByRole('button', { name: deliveryFaq[1].title })

    // Seeded open by the wrapper's state, not by `defaultValue`.
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'true'))

    await userEvent.click(trigger2)

    await expect(args.onValueChange).toHaveBeenCalledWith(['delivery-area'])
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
    await waitFor(() => expect(trigger1).toHaveAttribute('aria-expanded', 'false'))
  },
}

/**
 * No arrow-key navigation between headers by design (the component cancels
 * Bits UI's roving focus, to match the current W3C APG pattern) — only Tab
 * order moves focus between triggers, and Space toggles the focused one.
 */
export const TestKeyboardTabFlow: Story = {
  tags: ['tests'],
  argTypes: hide(...ALL_BUT_ITEMS),
  play: async ({ canvas }) => {
    const trigger1 = canvas.getByRole('button', { name: deliveryFaq[0].title })
    const trigger2 = canvas.getByRole('button', { name: deliveryFaq[1].title })

    trigger1.focus()
    await expect(trigger1).toHaveFocus()

    await userEvent.keyboard('{ArrowDown}')
    await expect(trigger1).toHaveFocus()
    await expect(trigger2).not.toHaveFocus()

    await userEvent.tab()
    await waitFor(() => expect(trigger2).toHaveFocus())

    await userEvent.keyboard(' ')
    await waitFor(() => expect(trigger2).toHaveAttribute('aria-expanded', 'true'))
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: {
    items: [
      {
        value: 'one',
        title: 'Item one',
        content: 'Content for item one',
      },
      {
        value: 'two',
        title: 'Item two',
        content: 'Content for item two',
      },
    ],
  },
}
