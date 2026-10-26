import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Heading, { type HeadingProps } from './Heading.svelte'
import ChildrenDemo from './fixtures/Children.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import LevelsDemo from './fixtures/Levels.svelte'
import MealdropHeadingLadderDemo from './fixtures/MealdropHeadingLadder.svelte'
import SizesDemo from './fixtures/Sizes.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof HeadingProps | 'children'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  args: { children: 'Best food in town' },
  argTypes: {
    children: { control: 'text', description: 'The heading text.' },
    level: {
      control: 'radio',
      options: [1, 2, 3, 4, 5],
      description: 'The rendered tag (`h1`–`h5`). Also the size step when `size` is unset.',
    },
    size: {
      control: 'radio',
      options: [undefined, 1, 2, 3, 4, 5],
      description: 'Visual size step, independent of `level`. Defaults to `level`.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Heading` class.',
    },
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A page title. `level` and `size` are both set below, so the controls start
 * populated — move them apart to see the tag and the visual size decouple.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Best food in town', level: 1, size: undefined },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` is the heading text; nodes work as well as strings. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'size', 'class'),
  render: (args) => ({ Component: ChildrenDemo, props: args }),
}

/** `level` picks the tag and, on its own, the size step to match. */
export const Levels: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'size', 'class'),
  render: (args) => ({ Component: LevelsDemo, props: args }),
}

/** `size` picks the visual step on its own; the tag still follows `level`. */
export const Sizes: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'size', 'class'),
  render: (args) => ({ Component: SizesDemo, props: args }),
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('level', 'size'),
  args: {
    class: 'heading-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * `size` decouples the visual size from the outline, so a card title can stay
 * an `h2` for screen readers while looking like a level-4 heading. Without it
 * you'd reach for a wrong `level` and break the document outline.
 */
export const SizeDecoupledFromLevel: Story = {
  tags: ['highlight'],
  argTypes: hide('class'),
  args: { level: 2, size: 4 },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part, whose tag follows `level`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'level', 'size', 'class'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The rendered `<h1>`–`<h5>`, picked by `level` and sized by `size`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** The heading ladder on a restaurant detail page. */
export const MealdropHeadingLadder: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'level', 'size', 'class'),
  render: () => ({ Component: MealdropHeadingLadderDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersMatchingTag: Story = {
  tags: ['tests'],
  args: { level: 3 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3 })).toBeInTheDocument()
  },
}

export const TestSizeDoesNotChangeTag: Story = {
  tags: ['tests'],
  args: { level: 2, size: 4 },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2 })

    await expect(heading).toHaveClass('droppy-Heading--4')
    await expect(heading).not.toHaveClass('droppy-Heading--2')
  },
}

export const TestForwardsRefAndProps: Story = {
  tags: ['tests'],
  args: { id: 'heading-demo-id', level: 2 },
  play: async ({ canvas }) => {
    // The ref/prop passthrough is what lets Bits UI's Dialog.Title point `aria-labelledby` at the real heading element.
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'heading-demo-id')
  },
}

export const Empty: Story = { tags: ['empty'] }
