import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { iconNames } from '../Icon'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Button, { type ButtonProps } from './Button.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import IconSizeDemo from './fixtures/IconSize.svelte'
import MealdropCheckoutActionsDemo from './fixtures/MealdropCheckoutActions.svelte'
import VariantsDemo from './fixtures/Variants.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ButtonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Actions/Button',
  component: Button,
  args: { children: 'Order now', onclick: fn() },
  argTypes: {
    children: { control: 'text', description: 'The label. Omit it for an icon-only button.' },
    clear: { control: 'boolean', description: 'Strips the fill, leaving just the label.' },
    large: { control: 'boolean', description: 'Taller padding, for primary calls to action.' },
    round: {
      control: 'boolean',
      description: 'Fully rounded, for icon-only affordances like a close button.',
    },
    icon: {
      control: 'select',
      options: [undefined, ...iconNames],
      description: 'Renders an icon before the label.',
    },
    iconSize: { control: 'number', description: 'Overrides the icon’s rendered size.' },
    disabled: { control: 'boolean', description: 'Blocks the click and dims the control.' },
    onclick: { description: 'Fired on click. Never fires while `disabled`.' },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Button` class.',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The primary call to action. Every variant prop is set below, so the controls
 * start populated — flip `clear`, `large`, or `round`, or pick an icon.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: {
    children: 'Order now',
    clear: false,
    large: false,
    round: false,
    icon: undefined,
    disabled: false,
  },
  argTypes: hide('iconSize', 'class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` is the label. Omitted, the button is icon-only and needs an `aria-label`. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'iconSize', 'class'),
  args: { children: 'Add to basket' },
}

/** `clear` strips the fill, for the secondary action beside a primary one. */
export const Clear: Story = {
  tags: ['api-ref'],
  argTypes: hide('large', 'round', 'icon', 'iconSize', 'class'),
  args: { clear: true, children: 'Not now' },
}

/** `large` adds height, for the one action a screen is really about. */
export const Large: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'round', 'icon', 'iconSize', 'class'),
  args: { large: true },
}

/** `round` fully rounds the control — pair it with an icon and no label. */
export const Round: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'iconSize', 'class'),
  args: { round: true, clear: true, icon: 'cross', children: undefined, 'aria-label': 'close' },
}

/** `icon` renders a glyph before the label, spaced with `gap` rather than a spacer node. */
export const IconProp: Story = {
  name: 'Icon',
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'iconSize', 'class'),
  args: { icon: 'cart' },
}

/** `iconSize` overrides the glyph size without touching the button's padding. */
export const IconSize: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'class'),
  render: (args) => ({ Component: IconSizeDemo, props: args }),
}

/** `disabled` dims the control and stops it firing `onClick`. */
export const Disabled: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'icon', 'iconSize', 'class'),
  args: { disabled: true },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('clear', 'large', 'round', 'icon', 'iconSize'),
  args: {
    class: 'button-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * An icon-only button has no text to read, so its accessible name has to come
 * from `aria-label`. Drop the label without one and the control is unnamed.
 */
export const IconOnlyNeedsALabel: Story = {
  tags: ['highlight'],
  argTypes: hide('iconSize', 'class'),
  args: { icon: 'cross', round: true, clear: true, children: undefined, 'aria-label': 'close' },
}

/** The variants side by side — the vocabulary a screen picks from. */
export const Variants: Story = {
  tags: ['highlight'],
  argTypes: hide('clear', 'large', 'round', 'icon', 'iconSize', 'class'),
  render: (args) => ({ Component: VariantsDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The control and its optional leading glyph. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'clear', 'large', 'round', 'icon', 'iconSize', 'class'),
  args: { icon: 'cart', children: 'Order now' },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<button>`: fill, radius, focus ring, and the disabled state.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The optional leading glyph, spaced from the label with `gap`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** The action stack in Mealdrop's cart panel. */
export const MealdropCheckoutActions: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'clear', 'round', 'large', 'icon', 'iconSize', 'disabled', 'onclick'),
  render: () => ({ Component: MealdropCheckoutActionsDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestClickHandling: Story = {
  tags: ['tests'],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Order now' }))

    await expect(args.onclick).toHaveBeenCalledOnce()
  },
}

export const TestDisabledSwallowsClicks: Story = {
  tags: ['tests'],
  args: { disabled: true },
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Order now' }), {
      pointerEventsCheck: 0,
    })

    await expect(args.onclick).not.toHaveBeenCalled()
  },
}

export const TestIconOnlyIsNamedByAriaLabel: Story = {
  tags: ['tests'],
  args: { icon: 'cross', round: true, clear: true, children: undefined, 'aria-label': 'close' },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'close' })

    await expect(button).toHaveTextContent('')
  },
}

export const TestDefaultsToTypeButton: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    // Without this a button inside a form would submit it by default.
    await expect(canvas.getByRole('button', { name: 'Order now' })).toHaveAttribute(
      'type',
      'button'
    )
  },
}

export const Empty: Story = { tags: ['empty'] }
