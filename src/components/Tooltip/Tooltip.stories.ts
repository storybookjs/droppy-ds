import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import isChromatic from 'chromatic/isChromatic'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import ButtonTooltip from './fixtures/ButtonTooltip.svelte'
import Centered from './fixtures/Centered.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import MealdropHeaderTipsDemo from './fixtures/MealdropHeaderTips.svelte'
import Tooltip, { type TooltipProps } from './Tooltip.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof TooltipProps | 'trigger'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Overlays/Tooltip',
  component: Tooltip as unknown as typeof ButtonTooltip,
  args: {
    label: 'turn on dark mode',
    trigger: { icon: 'moon', 'aria-label': 'turn on dark mode' },
  },
  argTypes: {
    label: { control: 'text', description: 'The tip’s content.' },
    children: {
      control: false,
      description:
        'The element the tip describes: a snippet that spreads `props` onto its own element, which becomes the trigger itself rather than being wrapped.',
    },
    trigger: {
      control: 'object',
      description:
        'Story-only: the Button props the stories’ `children` snippet renders as the trigger.',
    },
    sideOffset: { control: 'number', description: 'Gap between the trigger and the tip.' },
    class: {
      control: 'text',
      description: 'Merged onto the popup alongside the component’s own `droppy-Tooltip` class.',
    },
  },
  decorators: [() => ({ Component: Centered })],
  render: (args) => ({ Component: ButtonTooltip, props: args }),
} satisfies Meta<typeof ButtonTooltip>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A hint for an icon-only control. Label and offset are set below, so the
 * controls start populated — hover or focus the button to see the tip.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'turn on dark mode', sideOffset: 8 },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` is the tip's content — it repeats the name, never replaces it. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { label: 'add to your order' },
}

/** `children` becomes the trigger itself rather than being wrapped in one. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: {
    label: 'remove from cart',
    trigger: { icon: 'cross', 'aria-label': 'remove from cart' },
  },
}

/** `sideOffset` is the gap between trigger and tip. */
export const SideOffset: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { sideOffset: 24 },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: { class: 'tooltip-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The tip repeats the trigger's accessible name rather than supplying it. A
 * tooltip is a supplement — it never appears for touch or for a screen reader
 * that doesn't hover, so anything only said here is said to nobody. Give the
 * trigger its own `aria-label` as well, as the demo does.
 */
export const NeverTheOnlyLabel: Story = {
  tags: ['highlight'],
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * The tip fades and scales in off `[data-starting-style]` and
 * `[data-ending-style]`, staying mounted through the exit so the close runs
 * before it leaves the DOM.
 */
export const OpenCloseTransition: Story = {
  tags: ['animation'],
  argTypes: hide('class'),
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.tab()
    const popup = await waitFor(() => {
      const node = canvasElement.ownerDocument.querySelector('.droppy-Tooltip')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })

    await expect(getComputedStyle(popup).transitionProperty).not.toBe('none')
    await waitFor(() => expect(doc.getByText('turn on dark mode')).toBeVisible())
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/**
 * Two parts. Only the trigger is reachable by the Anatomy panel: the popup is
 * portalled to the document body, outside the story canvas the panel scans,
 * and `Tooltip` exposes no `container` prop the way `Modal` and `Sidebar` do.
 * The popup's `data-part` is still on the element for anyone inspecting the
 * DOM.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'sideOffset', 'class'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'trigger',
          name: 'Trigger',
          description: 'The child element itself — `Tooltip` does not wrap it in anything.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Tips on Mealdrop's two icon-only header controls. */
export const MealdropHeaderTips: Story = {
  tags: ['examples'],
  argTypes: hide('label', 'children', 'trigger', 'sideOffset', 'class'),
  render: () => ({ Component: MealdropHeaderTipsDemo }),
  play: async ({ canvasElement }) => {
    // Focus rather than hover: a hovered tip waits out the provider's opening
    // delay, which a synthetic pointer event does not reliably clear on CI,
    // while focus opens it immediately. Tab lands on the first trigger.
    await userEvent.tab()

    // Matched by class rather than by text and tag: the trigger's accessible
    // name repeats the tip's text, and the popup's markup is Bits UI's to
    // change.
    await waitFor(() => {
      const popup = canvasElement.ownerDocument.querySelector('.droppy-Tooltip')

      expect(popup).not.toBeNull()
      expect(popup).toHaveTextContent('Your order')
    })
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestShowsOnHover: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    // Chromatic's capture sends synthetic pointer events, which the hover
    // logic ignores — the vitest run drives a real browser and covers this.
    if (isChromatic()) return

    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.hover(canvas.getByRole('button', { name: 'turn on dark mode' }))

    await waitFor(() => expect(doc.getByText('turn on dark mode')).toBeVisible())
  },
}

export const TestShowsOnFocus: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.tab()

    await waitFor(() => expect(doc.getByText('turn on dark mode')).toBeVisible())
  },
}

export const TestTriggerKeepsItsOwnName: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    // The trigger is the child itself, not a wrapper, and it carries its own
    // accessible name whether or not the tip is showing.
    const trigger = canvas.getByRole('button', { name: 'turn on dark mode' })

    await expect(trigger).toHaveAttribute('data-part', 'trigger')
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: {
    label: 'turn on dark mode',
    trigger: { icon: 'moon', 'aria-label': 'turn on dark mode' },
  },
}
