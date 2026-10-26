import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Breadcrumb, { type BreadcrumbProps } from './Breadcrumb.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import ItemRenderDemo from './fixtures/ItemRender.svelte'
import MealdropCategoryTrailDemo from './fixtures/MealdropCategoryTrail.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof BreadcrumbProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  args: { items: [{ label: 'categories', href: '/categories' }, { label: 'sushi' }] },
  argTypes: {
    items: {
      control: 'object',
      description:
        'The trail, as `{ label, href?, render? }`. The last item is the current page and never links out.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Breadcrumb` class.',
    },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The trail above a category page. Edit the items in the controls to add or
 * remove crumbs — the last one is always the current page.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { items: [{ label: 'categories', href: '/categories' }, { label: 'sushi' }] },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `items` is the trail. A crumb with no `href` and no `render` renders as text. */
export const Items: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: {
    items: [
      { label: 'home', href: '/' },
      { label: 'categories', href: '/categories' },
      { label: 'asian', href: '/categories/asian' },
      { label: 'sushi' },
    ],
  },
}

/** A single crumb is the current page on its own — no separator is rendered. */
export const SingleCrumb: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { items: [{ label: 'restaurants' }] },
}

/**
 * Item `render` swaps the default `<a>` for a router-aware link, cloned with
 * the crumb's class and — on the last item — `aria-current`.
 */
export const ItemRender: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('class'),
  render: (args) => ({ Component: ItemRenderDemo, props: args }),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: {
    class: 'breadcrumb-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The last crumb carries `aria-current="page"` whether it renders as a link or
 * as plain text, and the whole trail sits in a `<nav aria-label="breadcrumb">`
 * landmark — the semantics Mealdrop's `div`/`p` version had none of.
 */
export const CurrentPageIsMarked: Story = {
  tags: ['highlight'],
  argTypes: hide('class'),
  args: {
    items: [
      { label: 'categories', href: '/categories' },
      { label: 'sushi', href: '/categories/sushi' },
    ],
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The landmark, the list, and one crumb per item with its separator. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('items', 'class'),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The `<nav aria-label="breadcrumb">` landmark.' },
        { id: 'list', name: 'List', description: 'The `<ol>` — crumb order is document order.' },
        {
          id: 'item',
          name: 'Item',
          description: 'One `<li>` per crumb, holding it and its separator.',
        },
        { id: 'link', name: 'Link', description: 'A crumb with a destination, rendered as `<a>`.' },
        {
          id: 'text',
          name: 'Text',
          description: 'A crumb with no destination, rendered as `<span>` — usually the last one.',
        },
        {
          id: 'separator',
          name: 'Separator',
          description: 'The `aria-hidden` slash between crumbs; never announced.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** The trail under a category page banner. */
export const MealdropCategoryTrail: Story = {
  tags: ['examples'],
  argTypes: hide('items', 'class'),
  parameters: { layout: 'fullscreen' },
  render: () => ({ Component: MealdropCategoryTrailDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestCurrentPageIsMarked: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('sushi')).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByText('categories')).not.toHaveAttribute('aria-current')
  },
}

export const TestLandmarkIsLabelled: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  },
}

export const TestRenderKeepsItsOwnDestination: Story = {
  tags: ['tests'],
  render: (args) => ({ Component: ItemRenderDemo, props: args }),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-router-link]')).toHaveLength(2)
    await expect(canvas.getByText('sushi')).toHaveAttribute('aria-current', 'page')
  },
}

export const TestSeparatorIsNotAnnounced: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    const separator = canvasElement.querySelector('.droppy-Breadcrumb-separator')

    await expect(separator).toHaveAttribute('aria-hidden', 'true')
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { items: [{ label: 'parent', href: '/parent' }, { label: 'current page' }] },
}
