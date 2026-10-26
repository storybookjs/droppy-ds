import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, waitFor } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Carousel, { type CarouselProps } from './Carousel.svelte'
import MealdropRestaurantRailDemo from './fixtures/MealdropRestaurantRail.svelte'
import TileCarousel from './fixtures/TileCarousel.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof CarouselProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const tiles = Array.from({ length: 8 }, (_, index) => `Item ${index + 1}`)

const meta = {
  title: 'Media & content/Carousel',
  component: Carousel as unknown as typeof TileCarousel,
  args: { itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 }, items: tiles },
  argTypes: {
    items: {
      control: 'object',
      description: 'The data for each slide. One wrapper is added per item.',
    },
    slide: {
      control: false,
      description: 'Renders one slide’s content from its item and index.',
    },
    itemsPerView: {
      control: 'object',
      description: 'How many items are visible per breakpoint (mobile-first). Fractions are fine.',
    },
    slidesToScroll: {
      control: 'object',
      description: 'How many items each arrow click advances, per breakpoint. Defaults to 1.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Carousel` class.',
    },
  },
  parameters: {
    // Off-screen slides render at opacity 0.5 by design, to signal there's
    // more to scroll to — the a11y addon's color-contrast check flags that
    // reduced contrast on stub story content, but it's the intended dimmed
    // state, not a real content-legibility issue.
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
  },
  render: (args) => ({ Component: TileCarousel, props: args }),
} satisfies Meta<typeof TileCarousel>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A scrolling row of tiles. `itemsPerView` is set below, so the controls start
 * populated — the fractional mobile value is deliberate, so a sliver of the
 * next tile shows and the row reads as scrollable.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 } },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `items` and `slide` make the slides — one wrapper is added per item. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('slidesToScroll', 'class'),
  args: { items: Array.from({ length: 4 }, (_, i) => `Card ${i + 1}`) },
}

/** `itemsPerView` sets how many fit per breakpoint. Fractions show a sliver of the next. */
export const ItemsPerView: Story = {
  tags: ['api-ref'],
  argTypes: hide('slidesToScroll', 'class'),
  args: { itemsPerView: { mobile: 1, tablet: 2, desktop: 3 } },
}

/** `slidesToScroll` advances more than one item per arrow click. */
export const SlidesToScroll: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { slidesToScroll: { desktop: 4 } },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('slidesToScroll'),
  args: { class: 'carousel-demo-inset' },
  decorators: [inBorderedBox],
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Arrows only render once there is somewhere to go in that direction — with
 * fewer items than fit, neither appears. They are desktop-only besides;
 * smaller screens scroll by dragging or by horizontal wheel gesture.
 */
export const ArrowsOnlyWhenThereIsSomewhereToGo: Story = {
  tags: ['highlight'],
  argTypes: hide('slidesToScroll', 'class'),
  args: { items: tiles.slice(0, 2) },
}

/**
 * Slides that aren't almost fully visible dim to 0.5, so a partially scrolled
 * row signals there is more to reach rather than looking clipped.
 */
export const OffscreenSlidesDim: Story = {
  tags: ['highlight'],
  argTypes: hide('slidesToScroll', 'class'),
  args: { itemsPerView: { mobile: 1.2, tablet: 2.5, desktop: 3.5 } },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The rail, its viewport and track, one wrapper per slide, and the arrows. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('items', 'slide', 'itemsPerView', 'slidesToScroll', 'class'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Carries the per-breakpoint item counts as CSS custom properties.',
        },
        { id: 'viewport', name: 'Viewport', description: 'The clipped window Embla drives.' },
        { id: 'container', name: 'Container', description: 'The track that slides horizontally.' },
        {
          id: 'slide',
          name: 'Slide',
          description: 'One wrapper per child; dims when not almost fully in view.',
        },
        {
          id: 'nav',
          name: 'Nav',
          description: 'Previous/next arrows. Only mounted when that direction can scroll.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** The 'Restaurants near you' rail. */
export const MealdropRestaurantRail: Story = {
  tags: ['examples'],
  argTypes: hide('items', 'slide', 'itemsPerView', 'slidesToScroll', 'class'),
  render: () => ({ Component: MealdropRestaurantRailDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersEverySlide: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Item 1')).toBeInTheDocument()
    // Every item gets a wrapper, whether or not it is currently in view.
    await expect(canvasElement.querySelectorAll('[data-part="slide"]')).toHaveLength(8)
  },
}

export const TestNoArrowsWithNothingToScroll: Story = {
  tags: ['tests'],
  // One slide, so there is nothing to scroll at any breakpoint — two would
  // still scroll in a narrow canvas, where only ~1 item fits.
  args: { items: tiles.slice(0, 1), itemsPerView: { mobile: 1, tablet: 2, desktop: 2 } },
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    )
    await expect(canvas.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
  },
}

export const TestItemsPerViewReachesCss: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.droppy-Carousel') as HTMLElement

    // The counts drive the slide widths through custom properties rather than
    // inline widths, so the CSS owns the breakpoints.
    await expect(root.style.getPropertyValue('--droppy-Carousel-items-desktop')).toBe('4')
    await expect(root.style.getPropertyValue('--droppy-Carousel-items-mobile')).toBe('1.2')
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 }, items: tiles },
}
