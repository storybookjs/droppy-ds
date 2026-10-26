import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { inPortalHost } from '../../../.storybook/preview'

import BorderedBox from '../../utils/BorderedBox.svelte'

import AnatomyDemo from './fixtures/Anatomy.svelte'
import { checkout, longOrder, order } from './fixtures/content'
import MealdropCartPanelDemo from './fixtures/MealdropCartPanel.svelte'
import SidebarDemo from './fixtures/SidebarDemo.svelte'
import Sidebar, { type SidebarProps } from './Sidebar.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SidebarProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Overlays/Sidebar',
  component: Sidebar,
  args: { isOpen: false, title: 'Your order', onClose: fn(), children: order() },
  argTypes: {
    isOpen: { control: 'boolean', description: 'Whether the panel is open. Fully controlled.' },
    title: { control: 'text', description: 'Heading in the top bar. Also names the dialog.' },
    onClose: { description: 'Fired on close — the button, Escape, or an outside press.' },
    children: { control: false, description: 'The scrolling panel content.' },
    footer: { control: false, description: 'Pinned to the bottom — totals and primary actions.' },
    container: {
      control: false,
      description: 'Where to portal. An element or a selector; defaults to the body.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the popup alongside the component’s own `droppy-Sidebar` class.',
    },
  },
  render: (args) => ({ Component: SidebarDemo, props: args }),
  parameters: { layout: 'fullscreen' },
  decorators: [inPortalHost],
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A cart reviewed alongside the page. `isOpen` and `title` are set below, so
 * the controls start populated — flip `isOpen` to open it without clicking.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { isOpen: true, title: 'Your order' },
  argTypes: hide('container', 'class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `isOpen` drives everything — the component holds no open state of its own. */
export const IsOpen: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'class'),
  args: { isOpen: false },
}

/** `title` is the top-bar heading, and the dialog's accessible name. */
export const Title: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'class'),
  args: { isOpen: true, title: 'Filter restaurants' },
}

/** `children` scroll; the top bar and footer stay put around them. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'class'),
  args: { isOpen: true, children: order() },
}

/** `footer` is pinned to the bottom — a plain flex container the caller fills. */
export const Footer: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'class'),
  args: {
    isOpen: true,
    footer: checkout('€16.00'),
  },
}

/** `container` picks the portal target — an element or a selector. */
export const Container: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { isOpen: true, container: '#sidebar-container-demo' },
  render: (args) => ({
    Component: SidebarDemo,
    props: { ...args, hostId: 'sidebar-container-demo' },
  }),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('container'),
  args: { isOpen: true, class: 'sidebar-demo-inset', container: '#sidebar-classname-demo' },
  decorators: [inBorderedBox],
  render: (args) => ({
    Component: SidebarDemo,
    props: { ...args, hostId: 'sidebar-classname-demo' },
  }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/** Below the mobile breakpoint the panel takes the full width. */
export const FullWidthOnMobile: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'class'),
  args: { isOpen: true },
  globals: { viewport: { value: 'mobile1' } },
}

/**
 * The footer is pinned and the content scrolls above it, so a long order never
 * pushes the checkout button out of reach.
 */
export const PinnedFooterWithScrollingContent: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'class'),
  args: {
    isOpen: true,
    children: longOrder(),
    footer: checkout('€190.00'),
  },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * The panel slides from the trailing edge off `[data-starting-style]` and
 * `[data-ending-style]`, and stays mounted through the exit so the close
 * animation runs before it leaves the DOM.
 */
export const SlideTransition: Story = {
  tags: ['animation'],
  argTypes: hide('container', 'class'),
  args: { isOpen: true },
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)
    const popup = await doc.findByRole('dialog')

    await expect(getComputedStyle(popup).transitionProperty).not.toBe('none')
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/**
 * Portalled into a node inside the canvas via `container`, so the Anatomy
 * panel can reach the parts — it only scans the story canvas, and the default
 * portal target is the document body.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('isOpen', 'title', 'children', 'footer', 'container', 'class'),
  args: {
    isOpen: true,
    class: 'sidebar-anatomy-footer',
  },
  render: (args) => ({ Component: AnatomyDemo, props: args }),
  parameters: {
    portalHostHeight: '28rem',
    anatomy: {
      parts: [
        { id: 'backdrop', name: 'Backdrop', description: 'The dimmed layer behind the panel.' },
        { id: 'root', name: 'Popup', description: 'The sliding panel: focus trap, shape.' },
        { id: 'topbar', name: 'Top bar', description: 'Holds the title and the close button.' },
        { id: 'title', name: 'Title', description: 'The heading; also names the dialog.' },
        { id: 'close', name: 'Close', description: 'The round icon button that dismisses.' },
        { id: 'content', name: 'Content', description: 'The scrolling region between the two.' },
        { id: 'footer', name: 'Footer', description: 'Pinned to the bottom; absent without one.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Mealdrop's cart panel, opened from the header's cart button. */
export const MealdropCartPanel: Story = {
  tags: ['examples'],
  argTypes: hide('isOpen', 'title', 'onClose', 'footer', 'container', 'children', 'class'),
  render: (args) => ({ Component: MealdropCartPanelDemo, props: args }),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: '6' }))

    await waitFor(() => expect(canvas.getByRole('dialog')).toBeVisible())
  },
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestOpensAndCloses: Story = {
  tags: ['tests'],
  play: async ({ args, canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open cart' }))
    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())

    await userEvent.click(doc.getByRole('button', { name: 'close sidebar' }))

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
    // Settle the exit transition before the automatic a11y check: Bits UI's
    // focus guards (aria-hidden + tabindex) exist while the drawer is mounted
    // and trip axe's aria-hidden-focus rule if it snapshots mid-close.
    await waitFor(() => expect(doc.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

export const TestTitleNamesTheDialog: Story = {
  tags: ['tests'],
  args: { isOpen: true },
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(doc.getByRole('dialog', { name: 'Your order' })).toBeVisible())
  },
}

export const TestFooterIsOptional: Story = {
  tags: ['tests'],
  args: { isOpen: true, footer: undefined },
  play: async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())
    await expect(
      canvasElement.ownerDocument.querySelector('[data-testid="sidebar-footer"]')
    ).toBeNull()
  },
}

export const TestContainerPortalsWhereAsked: Story = {
  tags: ['tests'],
  args: { isOpen: true, container: '#sidebar-portal-test' },
  render: (args) => ({
    Component: SidebarDemo,
    props: { ...args, hostId: 'sidebar-portal-test', hostTestId: 'portal-host' },
  }),
  play: async ({ canvas }) => {
    const host = canvas.getByTestId('portal-host')

    await waitFor(() => expect(host.querySelector('[role="dialog"]')).not.toBeNull())
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { isOpen: false, title: 'Title', onClose: fn() },
}
