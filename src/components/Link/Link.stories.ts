import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Link, { type LinkProps } from './Link.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import InlineDemo from './fixtures/Inline.svelte'
import MealdropOrderConfirmationLinkDemo from './fixtures/MealdropOrderConfirmationLink.svelte'
import OnDarkSurfaceDemo from './fixtures/OnDarkSurface.svelte'
import RenderDemo from './fixtures/Render.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof LinkProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Actions/Link',
  component: Link,
  args: { children: 'Order again', href: '/orders' },
  argTypes: {
    children: { control: 'text', description: 'The link text.' },
    href: {
      control: 'text',
      description: 'Destination for the default `<a>`. Ignored when `render` is set.',
    },
    render: {
      control: false,
      description:
        'Escape hatch for a router-aware link — a snippet receiving this link’s class and props to spread.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Link` class.',
    },
  },
} satisfies Meta<typeof Link>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A plain sentence link. Text and destination are set below, so the controls
 * start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Order again', href: '/orders' },
  argTypes: hide('render', 'class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` is the link text — keep it descriptive out of context. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('render', 'class'),
  args: { children: 'Track your order' },
}

/** `href` is the destination for the default `<a>`. */
export const Href: Story = {
  tags: ['api-ref'],
  argTypes: hide('render', 'class'),
  args: { href: 'https://droppy.example/help', children: 'Visit the help centre' },
}

/**
 * `render` swaps the `<a>` for a router-aware link — a snippet that spreads the
 * props it receives onto a stand-in router link. The rendered element owns its
 * own destination, so `href` is never passed to the snippet.
 */
export const Render: Story = {
  tags: ['api-ref', 'highlight'],
  argTypes: hide('href', 'class'),
  render: (args) => ({ Component: RenderDemo, props: args }),
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('render'),
  args: {
    class: 'link-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** Inline inside a sentence, inheriting the surrounding text's font. */
export const Inline: Story = {
  tags: ['highlight'],
  argTypes: hide('render', 'class'),
  render: (args) => ({ Component: InlineDemo, props: args }),
}

/**
 * On a dark surface, `Link` inherits `currentColor` from the wrapping context
 * rather than fighting it with a hard-coded light-mode token.
 */
export const OnDarkSurface: Story = {
  tags: ['highlight'],
  argTypes: hide('render', 'class'),
  render: (args) => ({ Component: OnDarkSurfaceDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part, whose tag is the `<a>` — or whatever `render` supplies. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'href', 'render', 'class'),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<a>` — or the element `render` supplies, rendered with this class.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** An order-confirmation paragraph with an inline link. */
export const MealdropOrderConfirmationLink: Story = {
  tags: ['examples'],
  argTypes: hide('href', 'render', 'children', 'class'),
  render: () => ({ Component: MealdropOrderConfirmationLinkDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestRendersAnAnchor: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Order again' })).toHaveAttribute(
      'href',
      '/orders'
    )
  },
}

export const TestRenderKeepsItsOwnDestination: Story = {
  tags: ['tests'],
  render: (args) => ({ Component: RenderDemo, props: args }),
  play: async ({ canvasElement }) => {
    const link = canvasElement.querySelector('[data-router-link]')

    // `href` is never handed to the `render` snippet, so it can't clobber
    // the destination the router element computes from `to`.
    await expect(link).toHaveAttribute('href', '/orders')
  },
}

export const TestMergesClassName: Story = {
  tags: ['tests'],
  args: { class: 'link-demo-custom' },
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Order again' })

    await expect(link).toHaveClass('droppy-Link')
    await expect(link).toHaveClass('link-demo-custom')
  },
}

export const Empty: Story = { tags: ['empty'] }
