<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, userEvent, waitFor, within } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import { inPortalHost } from '../../../.storybook/preview'

  import CreateToastButton from './fixtures/CreateToastButton.svelte'
  import MealdropButtons from './fixtures/MealdropButtons.svelte'
  import RaiseOnMount from './fixtures/RaiseOnMount.svelte'
  import ToastProvider, { type ToastProviderProps } from './ToastProvider.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ToastProviderProps | 'buttonLabel'>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Feedback & status/Toast',
    component: ToastProvider,
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
    render: template,
  })
</script>

<!--
  The default render: a ToastProvider around a "Save draft" button.
  `buttonLabel` stands in for `children` so the label stays a control.
-->
{#snippet template({
  children: _children,
  buttonLabel,
  ...args
}: ToastProviderProps & { buttonLabel?: string })}
  <ToastProvider {...args}>
    <CreateToastButton label={buttonLabel} />
  </ToastProvider>
{/snippet}

<!--
  Wrap the tree once, then raise toasts from anywhere beneath with
  `useToast().add(...)`. There is no trigger and no `open` prop — click the
  button to see one.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ timeout: 5000, limit: 3 }}
  argTypes={hide('container', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `children` is the tree that raises toasts — the provider renders it as-is. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ buttonLabel: 'Notify me' }}
/>

<!-- `timeout` sets how long a toast lingers. `0` keeps it until dismissed. -->
<Story
  name="Timeout"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ timeout: 0 }}
/>

<!-- `limit` caps how many show at once; older ones are marked limited, not dropped. -->
<Story
  name="Limit"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ limit: 1, timeout: 0 }}
/>

<!-- `container` picks the portal target for the stack. -->
<Story
  name="Container"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ container: '#toast-container-demo', timeout: 0 }}
>
  {#snippet template({ children: _children, buttonLabel, ...args })}
    <div id="toast-container-demo"></div>
    <ToastProvider {...args}>
      <CreateToastButton label={buttonLabel} />
    </ToastProvider>
  {/snippet}
</Story>

<!--
  `className` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('container')}
  args={{ class: 'toast-demo-inset', container: '#toast-classname-demo', timeout: 0 }}
  decorators={[inBorderedBox]}
>
  {#snippet template({ children: _children, buttonLabel, ...args })}
    <div id="toast-classname-demo"></div>
    <ToastProvider {...args}>
      <CreateToastButton label={buttonLabel} />
    </ToastProvider>
  {/snippet}
</Story>

<!-- highlight — features and behaviours worth calling out -->

<!--
  The close button is `aria-hidden` until the stack is hovered or focused, so
  a single passing notification doesn't compete with the page for keyboard
  attention. Hover the stack to reveal it.
-->
<Story
  exportName="CloseAppearsOnHover"
  name="Close Appears On Hover"
  tags={['highlight']}
  argTypes={hide('container', 'class')}
  args={{ timeout: 0 }}
/>

<!-- animation — the motion contract -->

<!--
  Each toast enters and leaves off `[data-starting-style]` and
  `[data-ending-style]`, and the exit additionally reads
  `[data-swipe-direction]` so a swiped toast leaves the way it was pushed
  rather than fading in place.
-->
<Story
  exportName="EnterExitTransition"
  name="Enter Exit Transition"
  tags={['animation']}
  argTypes={hide('container', 'class')}
  args={{ timeout: 0 }}
  play={async ({ canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))
    const region = await doc.findByRole('region', { name: 'Notifications' })
    const toast = await waitFor(() => {
      const node = region.querySelector('[data-part="toast"]')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })

    await expect(getComputedStyle(toast).transitionProperty).not.toBe('none')
  }}
/>

<!-- anatomy — the rendered part tree -->

<!--
  Portalled into a node inside the canvas via `container`, so the Anatomy
  panel can reach the parts — it only scans the story canvas, and the default
  portal target is the document body. A toast is raised on play so the stack
  isn't empty.
-->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('children', 'timeout', 'limit', 'container', 'class')}
  args={{ timeout: 0 }}
  parameters={{
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
  }}
>
  <!-- Raised on mount rather than by a click, so the canvas holds the toast
       itself and the panel has no trigger button to scan. -->
  {#snippet template({ children: _children, buttonLabel: _buttonLabel, ...args })}
    <ToastProvider {...args}>
      <RaiseOnMount />
    </ToastProvider>
  {/snippet}
</Story>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Adding to a cart, and saving a menu. -->
<Story
  exportName="MealdropAddedToCart"
  name="Mealdrop Added To Cart"
  tags={['examples']}
  argTypes={hide('children', 'container', 'timeout', 'limit', 'class')}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Add to cart' }))

    await waitFor(() => expect(canvas.getByText('Added to your order')).toBeVisible())
  }}
>
  {#snippet template(args)}
    <ToastProvider container={args.container}>
      <MealdropButtons />
    </ToastProvider>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestAppearsOnDemand"
  name="Test Appears On Demand"
  tags={['tests']}
  play={async ({ canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const region = doc.getByRole('region', { name: 'Notifications' })
    await waitFor(() => expect(within(region).getByText('Draft saved')).toBeVisible())
  }}
/>

<Story
  exportName="TestDismissesOnClose"
  name="Test Dismisses On Close"
  tags={['tests']}
  play={async ({ canvas, canvasElement }) => {
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
  }}
/>

<Story
  exportName="TestContainerPortalsWhereAsked"
  name="Test Container Portals Where Asked"
  tags={['tests']}
  args={{ container: '#toast-portal-test', timeout: 0 }}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Save draft' }))

    const host = canvas.getByTestId('portal-host')
    await waitFor(() => expect(host.querySelector('[data-part="toast"]')).not.toBeNull())
  }}
>
  {#snippet template({ children: _children, buttonLabel, ...args })}
    <div id="toast-portal-test" data-testid="portal-host"></div>
    <ToastProvider {...args}>
      <CreateToastButton label={buttonLabel} />
    </ToastProvider>
  {/snippet}
</Story>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.toast-demo-inset) {
    margin: 1rem;
  }
</style>
