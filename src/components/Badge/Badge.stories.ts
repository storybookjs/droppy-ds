import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Badge, { type BadgeProps } from './Badge.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import MealdropRestaurantTagsDemo from './fixtures/MealdropRestaurantTags.svelte'
import VariantDemo from './fixtures/Variant.svelte'
import VariantSwapDemo from './fixtures/VariantSwap.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BadgeProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Feedback & status/Badge',
  component: Badge,
  args: { text: 'vegan' },
  argTypes: {
    text: {
      control: 'text',
      description: 'The label. Rendered capitalized regardless of the casing passed in.',
    },
    variant: {
      control: 'radio',
      options: ['neutral', 'positive'],
      description: '`positive` matches the look of an affirmative flag, e.g. "new".',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Badge` class.',
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A dietary tag on a menu item. Both props are set below, so the controls
 * start populated — edit the text or flip the variant to see the two looks.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { text: 'vegan', variant: 'neutral' },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `text` is the only required prop, and the only content the badge renders. */
export const Text: Story = {
  tags: ['api-ref'],
  argTypes: hide('variant', 'class'),
  args: { text: 'gluten free' },
}

/** `variant` swaps the background, text color, and weight — not the size. */
export const Variant: Story = {
  tags: ['api-ref'],
  argTypes: hide('text', 'class'),
  render: (args) => ({ Component: VariantDemo, props: args }),
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('variant'),
  args: {
    class: 'badge-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** The pill grows with its content — there's no truncation or fixed width. */
export const LongerText: Story = {
  tags: ['highlight'],
  argTypes: hide('class'),
  args: { text: 'contains nuts and dairy' },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: `Badge` renders one `<span>` and nothing inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('text', 'variant', 'class'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<span>` carrying the pill background, radius, and capitalization.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Category tags and a new flag on a restaurant tile. */
export const MealdropRestaurantTags: Story = {
  tags: ['examples'],
  argTypes: hide('text', 'variant', 'class'),
  render: () => ({ Component: MealdropRestaurantTagsDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestCapitalizesText: Story = {
  tags: ['tests'],
  args: { text: 'vegan' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('vegan')).textTransform).toBe('capitalize')
  },
}

export const TestVariantSwapsTokens: Story = {
  tags: ['tests'],
  render: () => ({ Component: VariantSwapDemo }),
  play: async ({ canvas }) => {
    const neutral = canvas.getByText('vegan')
    const positive = canvas.getByText('new')

    await expect(getComputedStyle(neutral).backgroundColor).not.toBe(
      getComputedStyle(positive).backgroundColor
    )
    await expect(getComputedStyle(neutral).fontWeight).not.toBe(
      getComputedStyle(positive).fontWeight
    )
  },
}

export const TestMergesClassName: Story = {
  tags: ['tests'],
  args: { class: 'badge-demo-custom' },
  play: async ({ canvas }) => {
    const badge = canvas.getByText('vegan')

    await expect(badge).toHaveClass('droppy-Badge')
    await expect(badge).toHaveClass('badge-demo-custom')
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { text: 'Content' },
}
