import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Separator, { type SeparatorProps } from './Separator.svelte'
import AnatomyDemo from './fixtures/Anatomy.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import DefaultDemo from './fixtures/Default.svelte'
import MealdropOrderSummaryDividersDemo from './fixtures/MealdropOrderSummaryDividers.svelte'
import OrientationDemo from './fixtures/Orientation.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SeparatorProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Layout & structure/Separator',
  component: Separator,
  argTypes: {
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Sets `aria-orientation` and `data-orientation` together.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Separator` class.',
    },
  },
} satisfies Meta<typeof Separator>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A divider between two stacked blocks. `orientation` is set below, so the
 * controls start populated — flip it to vertical and the demo lays out
 * horizontally to match.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { orientation: 'horizontal' },
  argTypes: hide('class'),
  render: (args) => ({ Component: DefaultDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `orientation` drives the ARIA attribute and the data attribute together. */
export const Orientation: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation', 'class'),
  render: (args) => ({ Component: OrientationDemo, props: args }),
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation'),
  args: {
    class: 'separator-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` with `role="separator"` and no children. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('orientation', 'class'),
  render: (args) => ({ Component: AnatomyDemo, props: args }),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `role="separator"` line, carrying `aria-orientation` and `data-orientation`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Dividers in Mealdrop's order summary. */
export const MealdropOrderSummaryDividers: Story = {
  tags: ['examples'],
  argTypes: hide('orientation', 'style', 'class'),
  render: () => ({ Component: MealdropOrderSummaryDividersDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestHorizontalAttributes: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  },
}

export const TestVerticalAttributes: Story = {
  tags: ['tests'],
  args: { orientation: 'vertical' },
  play: async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    await expect(separator).toHaveAttribute('data-orientation', 'vertical')
  },
}

export const TestIsNotFocusable: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    // Structural, not the interactive "range" variant the ARIA spec also
    // permits — so it carries no tabindex.
    await expect(canvas.getByRole('separator')).not.toHaveAttribute('tabindex')
  },
}

export const Empty: Story = {
  tags: ['empty'],
}
