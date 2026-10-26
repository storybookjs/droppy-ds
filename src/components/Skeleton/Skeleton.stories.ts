import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Skeleton, { type SkeletonProps } from './Skeleton.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import DefaultDemo from './fixtures/Default.svelte'
import HeightDemo from './fixtures/Height.svelte'
import MealdropRestaurantCardLoadingDemo from './fixtures/MealdropRestaurantCardLoading.svelte'
import StyleDemo from './fixtures/Style.svelte'
import TextBlockDemo from './fixtures/TextBlock.svelte'
import WidthDemo from './fixtures/Width.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SkeletonProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Feedback & status/Skeleton',
  component: Skeleton,
  argTypes: {
    width: {
      control: 'text',
      description: 'Numbers are treated as pixels; strings pass through. Defaults to `100%`.',
    },
    height: {
      control: 'text',
      description: 'Numbers are treated as pixels; strings pass through. Defaults to `1em`.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Skeleton` class.',
    },
    style: {
      control: false,
      description: 'Inline CSS string, applied after the computed width and height.',
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A placeholder line inside a paragraph, taking the height of the surrounding
 * font. Both dimensions are set below, so the controls start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { width: '100%', height: '1em' },
  argTypes: hide('class', 'style'),
  render: (args) => ({ Component: DefaultDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `width` takes a number of pixels or any CSS length. */
export const Width: Story = {
  tags: ['api-ref'],
  argTypes: hide('width', 'class', 'style'),
  render: (args) => ({ Component: WidthDemo, props: args }),
}

/** `height` defaults to `1em`, so a bare skeleton matches its text context. */
export const Height: Story = {
  tags: ['api-ref'],
  argTypes: hide('height', 'class', 'style'),
  render: (args) => ({ Component: HeightDemo, props: args }),
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('style'),
  args: {
    class: 'skeleton-demo-inset',
    width: 200,
    height: 24,
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/** `style` is merged after the computed width and height, so it can add anything else. */
export const Style: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { width: '100%', height: 200, style: 'border-radius: 4px 4px 0 0' },
  render: (args) => ({ Component: StyleDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * A card's text column while it loads: each width fixed to the shape it stands
 * in for, so the layout doesn't jump once the real copy arrives. The loading
 * container owns the announcement — the placeholders underneath are hidden.
 */
export const TextBlock: Story = {
  tags: ['highlight'],
  argTypes: hide('width', 'height', 'class', 'style'),
  render: (args) => ({ Component: TextBlockDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * The shimmer is a gradient swept by CSS keyframes, entirely from
 * `Skeleton.css`. Unlike Spinner, it is removed outright under
 * `prefers-reduced-motion` — a placeholder still reads as a placeholder when
 * it holds still, so nothing is lost by stopping it.
 */
export const ShimmerAnimation: Story = {
  tags: ['animation'],
  argTypes: hide('width', 'height', 'class', 'style'),
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('.droppy-Skeleton') as HTMLElement
    const computed = getComputedStyle(skeleton)

    await expect(computed.animationName).toBe('droppy-skeleton-shimmer')
    await expect(computed.backgroundImage).toContain('gradient')
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `aria-hidden` `<span>` with no children. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('width', 'height', 'class', 'style'),
  args: { width: 200, height: 24 },
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `aria-hidden` `<span>` carrying the computed size and the shimmer gradient.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** A restaurant tile loading, beside the tile it becomes. */
export const MealdropRestaurantCardLoading: Story = {
  tags: ['examples'],
  argTypes: hide('width', 'height', 'class', 'style'),
  render: () => ({ Component: MealdropRestaurantCardLoadingDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestHiddenFromAssistiveTech: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.droppy-Skeleton')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  },
}

export const TestNumbersBecomePixels: Story = {
  tags: ['tests'],
  args: { width: 120, height: 40 },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('.droppy-Skeleton') as HTMLElement

    await expect(skeleton.style.width).toBe('120px')
    await expect(skeleton.style.height).toBe('40px')
  },
}

export const TestStringsPassThrough: Story = {
  tags: ['tests'],
  args: { width: '50%', height: '2rem' },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('.droppy-Skeleton') as HTMLElement

    await expect(skeleton.style.width).toBe('50%')
    await expect(skeleton.style.height).toBe('2rem')
  },
}

export const Empty: Story = {
  tags: ['empty'],
}
