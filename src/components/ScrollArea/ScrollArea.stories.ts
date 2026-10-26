import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, waitFor } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import ScrollArea, { type ScrollAreaProps } from './ScrollArea.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import { cardRow, prose, wideGrid } from './fixtures/content'
import MealdropCartScrollDemo from './fixtures/MealdropCartScroll.svelte'
import OrientationDemo from './fixtures/Orientation.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ScrollAreaProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Layout & structure/ScrollArea',
  component: ScrollArea,
  args: { children: prose() },
  argTypes: {
    children: { control: false, description: 'The content that overflows.' },
    orientation: {
      control: 'radio',
      options: ['vertical', 'horizontal', 'both'],
      description:
        '`vertical`/`horizontal` render one scrollbar; `both` renders one of each plus the corner.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ScrollArea` class.',
    },
  },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A fixed-height panel of long text, with a themed scrollbar revealed on hover
 * or while scrolling. `orientation` is set below, so the controls start
 * populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { orientation: 'vertical' },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` are whatever overflows; sizing comes from the theme layer. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation', 'class'),
  args: { children: prose() },
}

/** `orientation` picks which axes get a scrollbar. */
export const Orientation: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation', 'class'),
  render: (args) => ({ Component: OrientationDemo, props: args }),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('orientation'),
  args: { class: 'scrollarea-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Content overflowing both axes renders a scrollbar on each, plus the corner
 * where the two tracks would otherwise intersect — the part that stops them
 * overlapping at the meeting point.
 */
export const BothAxes: Story = {
  tags: ['highlight'],
  argTypes: hide('class'),
  args: { orientation: 'both', children: wideGrid() },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** Root, viewport, content, and a scrollbar with its thumb per axis. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'orientation', 'class'),
  args: { orientation: 'both', children: wideGrid() },
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The clipped box; sizing comes from the theme.' },
        { id: 'viewport', name: 'Viewport', description: 'The scrolling window.' },
        { id: 'content', name: 'Content', description: 'The wrapper the viewport scrolls.' },
        {
          id: 'scrollbar',
          name: 'Scrollbar',
          description: 'One per axis; only mounted once the content actually overflows.',
        },
        { id: 'thumb', name: 'Thumb', description: 'The draggable handle inside each scrollbar.' },
        {
          id: 'corner',
          name: 'Corner',
          description: 'Only with `orientation="both"` — where the two tracks meet.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** A long Mealdrop order scrolling above a pinned total. */
export const MealdropCartScroll: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'orientation', 'class'),
  render: () => ({ Component: MealdropCartScrollDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestVerticalScrollbarAppears: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    // The scrollbar mounts after Bits UI's overflow measurement effect runs,
    // so it isn't there on first paint — re-query inside waitFor.
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="vertical"]')).not.toBeNull()
    })
  },
}

export const TestBothAxesRenderTwoScrollbars: Story = {
  tags: ['tests'],
  args: { orientation: 'both', children: wideGrid() },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="vertical"]')).not.toBeNull()
    })
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
    })
  },
}

export const TestHorizontalOnlyOmitsVertical: Story = {
  tags: ['tests'],
  args: {
    orientation: 'horizontal',
    children: cardRow(false),
  },
  play: async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
    })
    await expect(canvasElement.querySelector('[data-orientation="vertical"]')).toBeNull()
  },
}

export const Empty: Story = {
  tags: ['empty'],
}
