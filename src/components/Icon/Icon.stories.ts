import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import ClassNameDemo from './fixtures/ClassName.svelte'
import DecorativeByDefaultDemo from './fixtures/DecorativeByDefault.svelte'
import MealdropHeaderDemo from './fixtures/MealdropHeader.svelte'
import NameDemo from './fixtures/Name.svelte'
import SizeDemo from './fixtures/Size.svelte'
import Icon, { type IconProps } from './Icon.svelte'
import { iconNames } from './icons'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof IconProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Media & content/Icon',
  component: Icon,
  args: { name: 'cart' },
  argTypes: {
    name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
    size: { control: 'text', description: 'Rendered width and height. Defaults to `1.5rem`.' },
    color: {
      control: 'text',
      description: 'Overrides the stroke colour. Defaults to the theme’s icon token.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Icon` class.',
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

/**
 * One glyph from the set. Name and size are set below, so the controls start
 * populated — pick another icon from the dropdown or change the size.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { name: 'cart', size: '1.5rem' },
  argTypes: hide('color', 'class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `name` picks from the bundled set — every icon in it, below. */
export const Name: Story = {
  tags: ['api-ref'],
  argTypes: hide('name', 'color', 'class'),
  render: (args) => ({ Component: NameDemo, props: args }),
}

/** `size` sets width and height together; numbers and CSS lengths both work. */
export const Size: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'color', 'class'),
  render: (args) => ({ Component: SizeDemo, props: args }),
}

/** `color` overrides the stroke, for the cases the icon token doesn't cover. */
export const Color: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { color: 'var(--ds-color-text-error)', size: '2rem' },
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('color'),
  args: {
    class: 'icon-demo-inset',
    size: '2rem',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Icons are decorative by default: `aria-hidden` and `focusable="false"`, so
 * they never reach the accessibility tree. The control an icon sits inside is
 * what carries the accessible name — see `IconButton`'s `aria-label`.
 */
export const DecorativeByDefault: Story = {
  tags: ['highlight'],
  argTypes: hide('color', 'class'),
  render: (args) => ({ Component: DecorativeByDefaultDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<svg>`, its paths supplied by `name`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('name', 'size', 'color', 'class'),
  args: { size: '3rem' },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `aria-hidden` `<svg>` carrying the viewBox, the stroke colour, and the size.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Mealdrop's header, where every icon reaches the page through a control's
 *  `icon` prop rather than a bare `Icon`. */
export const MealdropHeader: Story = {
  tags: ['examples'],
  argTypes: hide('name', 'color', 'size'),
  parameters: { layout: 'fullscreen' },
  render: () => ({ Component: MealdropHeaderDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestIsDecorative: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon')

    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
  },
}

export const TestSizeAppliesToBothAxes: Story = {
  tags: ['tests'],
  args: { size: '2rem' },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon') as SVGElement

    // `minWidth` is what stops a flex parent squeezing the glyph.
    await expect(icon.style.width).toBe('2rem')
    await expect(icon.style.height).toBe('2rem')
    await expect(icon.style.minWidth).toBe('2rem')
  },
}

export const TestColorOverridesStroke: Story = {
  tags: ['tests'],
  args: { color: 'rgb(183, 28, 28)' },
  play: async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon') as SVGElement

    await expect(getComputedStyle(icon).stroke).toBe('rgb(183, 28, 28)')
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { name: 'cart' },
}
