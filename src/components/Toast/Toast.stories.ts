import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, userEvent, waitFor, within } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import { inPortalHost } from '../../../.storybook/preview'

import MealdropAddedToCartDemo from './fixtures/MealdropAddedToCart.svelte'
import ToastDemo from './fixtures/ToastDemo.svelte'
import ToastProvider, { type ToastProviderProps } from './ToastProvider.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ToastProviderProps | 'buttonLabel'>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Feedback & status/Toast',
  component: ToastProvider as unknown as typeof ToastDemo,
  args: {},
  argTypes: {
    children: { control: false, description: 'The tree that raises toasts via `useToast`.' },
    buttonLabel: {
      control: 'text',
      description:
        'Story-only: the label of the “Save draft” button the stories render as `children`.',
    },
    timeout: {
      control: 'number',
      description: 'Milliseconds before a toast auto-dismisses. `0` disables auto-dismiss.',
    },
    limit: {
      control: 'number',
      description: 'How many show at once; older ones are marked limited rather than removed.',
    },
    container: {
      control: false,
      description: 'Where to portal the stack. An element or a selector; defaults to the body.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the viewport alongside the component’s own `droppy-Toast` class.',
    },
  },
  decorators: [inPortalHost],
  render: (args) => ({ Component: ToastDemo, props: args }),
} satisfies Meta<typeof ToastDemo>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Wrap the tree once, then raise toasts from anywhere beneath with
 * `useToast().add(...)`. There is no trigger and no `open` prop — click the
 * button to see one.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { timeout: 5000, limit: 3 },
  argTypes: hide('container', 'class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `children` is the tree that raises toasts — the provider renders it as-is. */
export const Children: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'class'),
  args: { buttonLabel: 'Notify me' },
}

/** `timeout` sets how long a toast lingers. `0` keeps it until dismissed. */
export const Timeout: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'class'),
  args: { timeout: 0 },
}

/** `limit` caps how many show at once; older ones are marked limited, not dropped. */
export const Limit: Story = {
  tags: ['api-ref'],
  argTypes: hide('container', 'class'),
  args: { limit: 1, timeout: 0 },
}

/** `container` picks the portal target for the stack. */
export const Container: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { container: '#toast-container-demo', timeout: 0 },
  render: (args) => ({
    Component: ToastDemo,
    props: { ...args, hostId: 'toast-container-demo' },
  }),
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('container'),
  args: { class: 'toast-demo-inset', container: '#toast-classname-demo', timeout: 0 },
  decorators: [inBorderedBox],
  render: (args) => ({
    Component: ToastDemo,
    props: { ...args, hostId: 'toast-classname-demo' },
  }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The close button is `aria-hidden` until the stack is hovered or focused, so
 * a single passing notification doesn't compete with the page for keyboard
 * attention. Hover the stack to reveal it.
 */
export const CloseAppearsOnHover: Story = {
  tags: ['highlight'],
  argTypes: hide('container', 'class'),
  args: { timeout: 0 },
}

/* ------------------------------------------------------------------ */
/* animation — the motion contract                                     */
/* ------------------------------------------------------------------ */

/**
 * Each toast enters and leaves off `[data-starting-style]` and
 * `[data-ending-style]`, and the exit additionally reads
 * `[data-swipe-direction]` so a swiped toast leaves the way it was pushed
 * rather than fading in place.
 */
export const EnterExitTransition: Story = {
  tags: ['animation'],
  argTypes: hide('container', 'class'),
  args: { timeout: 0 },
  play: async ({ canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))
    const region = await doc.findByRole('region', { name: 'Notifications' })
    const toast = await waitFor(() => {
      const node = region.querySelector('[data-part="toast"]')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })

    await expect(getComputedStyle(toast).transitionProperty).not.toBe('none')
  },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/**
 * Portalled into a node inside the canvas via `container`, so the Anatomy
 * panel can reach the parts — it only scans the story canvas, and the default
 * portal target is the document body. A toast is raised on play so the stack
 * isn't empty.
 */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('children', 'timeout', 'limit', 'container', 'class'),
  args: { timeout: 0 },
  // Raised on mount rather than by a click, so the canvas holds the toast
  // itself and the panel has no trigger button to scan.
  render: (args) => ({ Component: ToastDemo, props: { ...args, raiseOnMount: true } }),
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Viewport', description: 'The stack region the toasts portal into.' },
        {
          id: 'toast',
          name: 'Toast',
          description: 'One notification; owns the enter/exit states.',
        },
        {
          id: 'content',
          name: 'Content',
          description: 'Lays the text out against the close button.',
        },
        { id: 'title', name: 'Title', description: 'The headline.' },
        { id: 'description', name: 'Description', description: 'The supporting line.' },
        {
          id: 'close',
          name: 'Close',
          description: '`aria-hidden` until the stack is hovered or focused.',
        },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Adding to a cart, and saving a menu. */
export const MealdropAddedToCart: Story = {
  tags: ['examples'],
  argTypes: hide('children', 'container', 'timeout', 'limit', 'class'),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add to cart' }))

    await waitFor(() => expect(canvas.getByText('Added to your order')).toBeVisible())
  },
  render: (args) => ({ Component: MealdropAddedToCartDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestAppearsOnDemand: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const region = doc.getByRole('region', { name: 'Notifications' })
    await waitFor(() => expect(within(region).getByText('Draft saved')).toBeVisible())
  },
}

export const TestDismissesOnClose: Story = {
  tags: ['tests'],
  play: async ({ canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const region = doc.getByRole('region', { name: 'Notifications' })
    await waitFor(() => expect(within(region).getByText('Draft saved')).toBeVisible())

    // The close button is aria-hidden until the stack is hovered or focused,
    // so a single toast doesn't compete with the page for keyboard attention.
    await userEvent.hover(region)
    await userEvent.click(within(region).getByRole('button', { name: 'Dismiss' }))

    await waitFor(() => expect(doc.queryByText('Draft saved')).not.toBeInTheDocument(), {
      timeout: 3000,
    })
  },
}

export const TestContainerPortalsWhereAsked: Story = {
  tags: ['tests'],
  args: { container: '#toast-portal-test', timeout: 0 },
  render: (args) => ({
    Component: ToastDemo,
    props: { ...args, hostId: 'toast-portal-test', hostTestId: 'portal-host' },
  }),
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const host = canvas.getByTestId('portal-host')
    await waitFor(() => expect(host.querySelector('[data-part="toast"]')).not.toBeNull())
  },
}

export const Empty: Story = {
  tags: ['empty'],
}
