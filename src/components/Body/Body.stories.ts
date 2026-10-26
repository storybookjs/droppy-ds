import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Body, { type BodyProps } from './Body.svelte'
import ChildrenDemo from './fixtures/Children.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import ElementChoiceDemo from './fixtures/ElementChoice.svelte'
import MealdropRestaurantCardTextDemo from './fixtures/MealdropRestaurantCardText.svelte'
import SizeAndWeightDemo from './fixtures/SizeAndWeight.svelte'
import SizesDemo from './fixtures/Sizes.svelte'
import WeightsDemo from './fixtures/Weights.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BodyProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Typography/Body',
  component: Body,
  args: { children: 'The kitchen closes at 10pm, last orders 9:30.' },
  argTypes: {
    children: { control: 'text', description: 'The text, or any nodes to render inside.' },
    size: {
      control: 'radio',
      options: [undefined, 'S', 'XS', 'XXS'],
      description: 'Visual size step. Absent renders the base body size.',
    },
    fontWeight: {
      control: 'radio',
      options: ['regular', 'medium', 'bold', 'black'],
      description: 'Font weight, independent of `size` and `type`.',
    },
    type: {
      control: 'radio',
      options: ['p', 'span', 'label', 'figcaption'],
      description: 'The rendered element.',
    },
    color: {
      control: 'text',
      description: 'Overrides the text color inline. Unset, follows the primary text token.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Body` class.',
    },
  },
} satisfies Meta<typeof Body>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A line of body copy at the base size. Every prop that shapes the text is set
 * below, so the controls start populated — change the size step, the weight, or
 * the element it renders as.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: {
    children: 'The kitchen closes at 10pm, last orders 9:30.',
    size: undefined,
    fontWeight: 'regular',
    type: 'p',
  },
  argTypes: hide('color', 'class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` takes nodes as well as strings, so inline markup composes. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'fontWeight', 'color', 'class'),
  render: (args) => ({ Component: ChildrenDemo, props: args }),
}

/** `size` picks the type-scale step, leaving the element and weight alone. */
export const Sizes: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'color', 'class'),
  render: (args) => ({ Component: SizesDemo, props: args }),
}

/** `fontWeight` is independent of both size and element. */
export const Weights: Story = {
  tags: ['api-ref'],
  argTypes: hide('fontWeight', 'color', 'class'),
  render: (args) => ({ Component: WeightsDemo, props: args }),
}

/** `type` picks which element is rendered — all four share the same styling. */
export const ElementChoice: Story = {
  tags: ['api-ref'],
  argTypes: hide('type', 'color', 'class'),
  render: (args) => ({ Component: ElementChoiceDemo, props: args }),
}

/** `color` overrides the text token inline, for the cases the scale doesn't cover. */
export const ColorOverride: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'fontWeight', 'class'),
  args: { color: 'var(--ds-color-text-error)', children: 'Delivery unavailable at this address.' },
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('size', 'fontWeight', 'color'),
  args: {
    class: 'body-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * `type` renders a real element, not a styled `span` — `label` gives you a
 * `<label>` that can be associated with a control.
 */
export const RendersMatchingTag: Story = {
  tags: ['highlight'],
  argTypes: hide('size', 'fontWeight', 'color', 'class'),
  args: { type: 'label', children: 'Delivery address' },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part, whose tag follows `type`. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('size', 'fontWeight', 'type', 'color', 'class'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The rendered element — `<p>`, `<span>`, `<label>`, or `<figcaption>` per `type`.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** The text column of a restaurant tile. */
export const MealdropRestaurantCardText: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'size', 'fontWeight', 'type', 'color', 'class'),
  render: () => ({ Component: MealdropRestaurantCardTextDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersMatchingTag: Story = {
  tags: ['tests'],
  args: { type: 'label', children: 'Delivery address' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Delivery address').tagName).toBe('LABEL')
  },
}

export const TestSizeAndWeightAreIndependent: Story = {
  tags: ['tests'],
  render: () => ({ Component: SizeAndWeightDemo }),
  play: async ({ canvas }) => {
    const regular = canvas.getByText('Small regular')
    const bold = canvas.getByText('Small bold')

    await expect(getComputedStyle(regular).fontSize).toBe(getComputedStyle(bold).fontSize)
    await expect(getComputedStyle(regular).fontWeight).not.toBe(getComputedStyle(bold).fontWeight)
  },
}

export const TestColorOverridesToken: Story = {
  tags: ['tests'],
  args: { color: 'rgb(10, 125, 50)', children: 'Delivered' },
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Delivered')).color).toBe('rgb(10, 125, 50)')
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { children: 'Body text' },
}
