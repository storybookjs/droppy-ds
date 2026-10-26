import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { createRawSnippet } from 'svelte'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Container, { type ContainerProps } from './Container.svelte'
import TintedDemo from './fixtures/Tinted.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ContainerProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Layout & structure/Container',
  component: Container,
  args: { children: 'Page content' },
  argTypes: {
    children: { control: 'text', description: 'The page content the wrapper bounds.' },
    desktopOnly: {
      control: 'boolean',
      description:
        'Applies the max-width and side padding from the desktop breakpoint (1024px) up, rather than immediately.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-Container` class.',
    },
  },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The page-width wrapper, tinted here so the bound is visible. Both props are
 * set below — toggle `desktopOnly` and resize to see where the constraint
 * starts applying.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { children: 'Page content', desktopOnly: false },
  argTypes: hide('class'),
  render: (args) => ({ Component: TintedDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` render in normal flow — the wrapper only bounds the width. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('desktopOnly', 'class'),
  args: {
    children: createRawSnippet(() => ({
      render: () =>
        `<div><h2 style="margin: 0">Restaurants near you</h2><p>Everything inside keeps the page's max width and side padding.</p></div>`,
    })),
  },
  render: (args) => ({ Component: TintedDemo, props: args }),
}

/** `desktopOnly` defers the constraint until the desktop breakpoint. */
export const DesktopOnly: Story = {
  tags: ['api-ref'],
  argTypes: hide('children', 'class'),
  args: { desktopOnly: true },
  render: (args) => ({ Component: TintedDemo, props: args }),
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('desktopOnly', 'children'),
  args: {
    class: 'container-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: TintedDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A single part: one `<div>` that bounds width and adds side padding. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'desktopOnly', 'class'),
  render: (args) => ({ Component: TintedDemo, props: args }),
  parameters: {
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<div>` carrying the max-width bound and the side padding.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestBoundsPageWidth: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Page content')).maxWidth).toBe('1600px')
  },
}

export const TestMergesClassName: Story = {
  tags: ['tests'],
  args: { class: 'container-demo-custom' },
  play: async ({ canvas }) => {
    const root = canvas.getByText('Page content')

    await expect(root).toHaveClass('droppy-Container')
    await expect(root).toHaveClass('container-demo-custom')
  },
}

export const Empty: Story = { tags: ['empty'] }
