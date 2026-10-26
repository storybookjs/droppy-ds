import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, fn, userEvent } from 'storybook/test'

import { iconNames } from '../Icon'

import BorderedBox from '../../utils/BorderedBox.svelte'

import ClassNameDemo from './fixtures/ClassName.svelte'
import MealdropCarouselArrowsDemo from './fixtures/MealdropCarouselArrows.svelte'
import SmallDemo from './fixtures/Small.svelte'
import StaysLightOnAnySurfaceDemo from './fixtures/StaysLightOnAnySurface.svelte'
import TestSmallShrinksGlyphDemo from './fixtures/TestSmallShrinksGlyph.svelte'
import IconButton, { type IconButtonProps } from './IconButton.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconButtonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Actions/IconButton',
  component: IconButton,
  args: { name: 'arrow-right', 'aria-label': 'next', onclick: fn() },
  argTypes: {
    name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
    small: { control: 'boolean', description: 'Renders the 3rem variant instead of 4rem.' },
    onclick: { description: 'Fired on click.' },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-IconButton` class.',
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A floating circular affordance — a carousel arrow, an overlay dismissal.
 * Both props are set below, so the controls start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { name: 'arrow-right', small: false },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `name` picks the glyph; the button is icon-only, so pass `aria-label` too. */
export const Name: Story = {
  tags: ['api-ref'],
  argTypes: hide('small', 'class'),
  args: { name: 'cross', 'aria-label': 'close' },
}

/** `small` swaps the 4rem control for the 3rem one, glyph included. */
export const Small: Story = {
  tags: ['api-ref'],
  argTypes: hide('name', 'class'),
  render: (args) => ({ Component: SmallDemo, props: args }),
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('small'),
  args: {
    class: 'iconbutton-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Deliberately not theme-reactive: it stays a light pill in dark mode so it
 * reads against arbitrary imagery. Only the radius and focus ring are tokens,
 * and the glyph colour is hard-coded rather than following the icon token.
 */
export const StaysLightOnAnySurface: Story = {
  tags: ['highlight'],
  argTypes: hide('small', 'class'),
  render: (args) => ({ Component: StaysLightOnAnySurfaceDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The circular control and the glyph it centres. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('name', 'small', 'class'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The circular `<button>`: fixed size, radius, and focus ring.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The glyph, sized from `small` and coloured independently of the theme.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Carousel arrows floating over restaurant photos. */
export const MealdropCarouselArrows: Story = {
  tags: ['examples'],
  argTypes: hide('name', 'small', 'onclick'),
  render: () => ({ Component: MealdropCarouselArrowsDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestClickHandling: Story = {
  tags: ['tests'],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'next' }))

    await expect(args.onclick).toHaveBeenCalledOnce()
  },
}

export const TestNamedByAriaLabel: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    // Icon-only: the glyph is aria-hidden, so the label is the only name.
    await expect(canvas.getByRole('button', { name: 'next' })).toHaveTextContent('')
  },
}

export const TestSmallShrinksGlyph: Story = {
  tags: ['tests'],
  render: (args) => ({ Component: TestSmallShrinksGlyphDemo, props: args }),
  play: async ({ canvas }) => {
    const regular = canvas.getByRole('button', { name: 'regular' }).querySelector('svg')
    const small = canvas.getByRole('button', { name: 'small' }).querySelector('svg')

    await expect(regular?.getAttribute('width')).toBe('24')
    await expect(small?.getAttribute('width')).toBe('15')
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { name: 'arrow-right' },
}
