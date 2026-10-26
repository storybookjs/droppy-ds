import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Card, { type CardProps } from './Card.svelte'
import ChildrenDemo from './fixtures/Children.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import ClipsOverflowDemo from './fixtures/ClipsOverflow.svelte'
import MealdropCategoryTileDemo from './fixtures/MealdropCategoryTile.svelte'
import MealdropRestaurantTileDemo from './fixtures/MealdropRestaurantTile.svelte'
import WithImageDemo from './fixtures/WithImage.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof CardProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Media & content/Card',
  component: Card,
  args: { children: 'Card content' },
  argTypes: {
    children: { control: 'text', description: 'Whatever the card groups — no slots.' },
    interactive: {
      control: 'boolean',
      description: 'Hover dim + pointer cursor. Appearance only — wire your own click handling.',
    },
    padded: {
      control: 'boolean',
      description: 'Adds `--ds-space-sm` padding on all sides. Bare by default.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Card` class.',
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A rounded, clipped surface for grouping content. Both variant props are set
 * below, so the controls start populated — flip `padded` or `interactive`.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Card content', padded: true, interactive: false },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` compose freely — `Card` provides the surface and nothing else. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'padded', 'class'),
  args: {
    padded: true,
  },
  render: (args) => ({ Component: ChildrenDemo, props: args }),
}

/** `padded` adds uniform padding, for children that don't own their own. */
export const Padded: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'class'),
  args: { padded: true },
}

/** `interactive` is appearance only: hover dim and a pointer cursor. */
export const Interactive: Story = {
  tags: ['api-ref'],
  argTypes: hide('padded', 'class'),
  args: { interactive: true, padded: true, children: 'Hover me' },
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('interactive', 'padded'),
  args: {
    class: 'card-demo-inset',
    children: 'Card content',
    padded: true,
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** An edge-to-edge image clips to the card's own corner radius instead of squaring off past it. */
export const WithImage: Story = {
  tags: ['highlight'],
  argTypes: hide('children', 'interactive', 'padded', 'class'),
  render: (args) => ({ Component: WithImageDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` providing the surface, with children in normal flow. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'interactive', 'padded', 'class'),
  args: { padded: true },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The surface: background, radius, and the clipping that keeps images in.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** A restaurant listing tile: photo, name, rating, specialty, categories. */
export const MealdropRestaurantTile: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'interactive', 'padded', 'class'),
  render: () => ({ Component: MealdropRestaurantTileDemo }),
}

/** A category tile: round photo and a single label, on the same shell. */
export const MealdropCategoryTile: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'interactive', 'padded', 'class'),
  render: () => ({ Component: MealdropCategoryTileDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRoundedAndRaised: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const card = canvas.getByText('Card content')

    await expect(getComputedStyle(card).borderRadius).toBe('8px')
    // Flat at rest by design — elevation is the consumer's choice to add.
    await expect(getComputedStyle(card).boxShadow).toBe('none')
  },
}

export const TestClipsOverflow: Story = {
  tags: ['tests'],
  render: () => ({ Component: ClipsOverflowDemo }),
  play: async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.droppy-Card') as HTMLElement

    await expect(getComputedStyle(card).overflow).toBe('hidden')
  },
}

export const TestInteractiveIsAppearanceOnly: Story = {
  tags: ['tests'],
  args: { interactive: true },
  play: async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('.droppy-Card') as HTMLElement

    await expect(card).toHaveClass('droppy-Card--interactive')
    // No role, no tabindex — the caller owns the interactive semantics.
    await expect(card).not.toHaveAttribute('tabindex')
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}

export const Empty: Story = { tags: ['empty'] }
