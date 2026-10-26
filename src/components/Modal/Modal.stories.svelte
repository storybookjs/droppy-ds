<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

  import { inPortalHost } from '../../../.storybook/preview'
  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Heading } from '../Heading'

  import MealdropFoodItemModal from './fixtures/MealdropFoodItemModal.svelte'
  import ModalDemo from './fixtures/ModalDemo.svelte'
  import Modal, { type ModalProps } from './Modal.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ModalProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const DISH = { name: 'Cheeseburger' }

  const { Story } = defineMeta({
    title: 'Overlays/Modal',
    component: Modal,
    args: { isOpen: false, onClose: fn(), children: removeFromCartBody },
    argTypes: {
      isOpen: { control: 'boolean', description: 'Whether the dialog is open. Fully controlled.' },
      onClose: { description: 'Fired on close — the button, Escape, or an outside press.' },
      children: { control: false, description: 'The dialog body. The top bar is supplied.' },
      'aria-label': {
        control: 'text',
        description: 'Accessible name for the dialog. Defaults to “dialog”.',
      },
      container: {
        control: false,
        description: 'Where to portal. An element or a selector; defaults to the body.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the popup alongside the component’s own `droppy-Modal` class.',
      },
    },
    render: modalDemo,
    decorators: [inPortalHost],
    parameters: { layout: 'fullscreen' },
  })
</script>

{#snippet removeFromCartBody()}
  <div style="padding: 1.5rem">
    <Heading level={4}>Remove from cart?</Heading>
    <p>This takes the item out of your order. You can add it back at any time.</p>
  </div>
{/snippet}

{#snippet orderOnItsWayBody()}
  <div style="padding: 1.5rem">
    <Heading level={4}>Your order is on its way</Heading>
    <p>Arriving in about 25 minutes.</p>
  </div>
{/snippet}

<!-- A trigger plus a Modal whose open state starts at the `isOpen` arg. -->
{#snippet modalDemo(args: ModalProps)}
  <ModalDemo {...args} />
{/snippet}

<!--
  A blocking confirmation. `isOpen` and the accessible name are set below, so
  the controls start populated — flip `isOpen` to open it without clicking.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ isOpen: true, 'aria-label': 'Remove from cart' }}
  argTypes={hide('container', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `isOpen` drives everything — the component holds no open state of its own. -->
<Story
  exportName="IsOpen"
  name="Is Open"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: false }}
/>

<!-- `children` are the body; the top bar and its close button are supplied. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true, children: orderOnItsWayBody }}
/>

<!-- `aria-label` names the dialog, since the body has no guaranteed heading. -->
<Story
  exportName="AriaLabel"
  name="aria-label"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true, 'aria-label': 'Remove from cart' }}
/>

<!--
  `container` picks the portal target — an element or a selector. Mealdrop
  portals into its own `#modal` node; unset, it goes to the body.
-->
<Story
  name="Container"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ isOpen: true, container: '#modal-container-demo' }}
>
  {#snippet template(args)}
    <div id="modal-container-demo"></div>
    <ModalDemo {...args} />
  {/snippet}
</Story>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('container')}
  args={{ isOpen: true, class: 'modal-demo-inset', container: '#modal-classname-demo' }}
  decorators={[inBorderedBox]}
>
  {#snippet template(args)}
    <div id="modal-classname-demo"></div>
    <ModalDemo {...args} />
  {/snippet}
</Story>

<!-- highlight — features and behaviours worth calling out -->

<!-- Below 768px the card becomes a bottom sheet and slides up from the edge. -->
<Story
  name="Mobile"
  tags={['highlight']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true }}
  globals={{ viewport: { value: 'mobile1' } }}
/>

<!--
  Focus lands on the popup itself, not the close button: the content is what
  the reader asked for, and landing on "close" reads as an invitation to
  leave. Tab still reaches the close button first.
-->
<Story
  exportName="InitialFocusIsThePopup"
  name="Initial Focus Is The Popup"
  tags={['highlight']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true }}
/>

<!-- animation — the motion contract -->

<!--
  Both the backdrop and the popup transition off `[data-starting-style]` and
  `[data-ending-style]`, which Bits UI sets while the dialog enters and
  leaves. The popup stays mounted through the exit, so the close animation
  runs before it disappears.
-->
<Story
  exportName="OpenCloseTransition"
  name="Open Close Transition"
  tags={['animation']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true }}
  play={async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)
    const popup = await doc.findByRole('dialog')
    const backdrop = canvasElement.ownerDocument.querySelector(
      '[data-testid="modal-backdrop"]'
    ) as HTMLElement

    await expect(getComputedStyle(popup).transitionProperty).not.toBe('none')
    await expect(getComputedStyle(backdrop).transitionProperty).toContain('opacity')
  }}
/>

<!-- anatomy — the rendered part tree -->

<!--
  Portalled into a node inside the canvas via `container`, so the Anatomy
  panel can reach the parts — it only scans the story canvas, and the default
  portal target is the document body. Rendered open and with no trigger, so
  the panel scans the dialog's own parts rather than the button that would
  have opened it.
-->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('isOpen', 'children', 'container', 'class')}
  args={{ isOpen: true, 'aria-label': 'Remove from cart' }}
  parameters={{
    anatomy: {
      parts: [
        { id: 'backdrop', name: 'Backdrop', description: 'The dimmed layer behind the dialog.' },
        {
          id: 'root',
          name: 'Popup',
          description: 'The dialog card: `aria-modal`, the focus trap, and the shape.',
        },
        { id: 'topbar', name: 'Top bar', description: 'Holds the close affordance.' },
        { id: 'close', name: 'Close', description: 'The round icon button that dismisses.' },
      ],
    } satisfies AnatomyParameters,
  }}
>
  {#snippet template({ onClose: _onClose, children: _children, ...args })}
    <Modal {...args} onClose={() => {}}>
      {@render removeFromCartBody()}
    </Modal>
  {/snippet}
</Story>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Mealdrop's food-item modal, opened from a dish on the menu. -->
<Story
  exportName="MealdropFoodItemModal"
  name="Mealdrop Food Item Modal"
  tags={['examples']}
  argTypes={hide('isOpen', 'onClose', 'container', 'aria-label', 'children', 'class')}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: DISH.name }))

    await waitFor(() => expect(canvas.getByRole('dialog')).toBeVisible())
  }}
>
  {#snippet template(args)}
    <MealdropFoodItemModal container={args.container} />
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestOpensAndCloses"
  name="Test Opens And Closes"
  tags={['tests']}
  play={async ({ args, canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }))
    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())

    await userEvent.click(doc.getByRole('button', { name: 'close modal' }))

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
  }}
/>

<Story
  exportName="TestEscapeDismisses"
  name="Test Escape Dismisses"
  tags={['tests']}
  play={async ({ args, canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }))
    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())

    await userEvent.keyboard('{Escape}')

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
  }}
/>

<Story
  exportName="TestDialogIsNamed"
  name="Test Dialog Is Named"
  tags={['tests']}
  args={{ isOpen: true, 'aria-label': 'Remove from cart' }}
  play={async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(doc.getByRole('dialog', { name: 'Remove from cart' })).toBeVisible())
  }}
/>

<Story
  exportName="TestContainerPortalsWhereAsked"
  name="Test Container Portals Where Asked"
  tags={['tests']}
  args={{ isOpen: true, container: '#modal-portal-test' }}
  play={async ({ canvas }) => {
    const host = canvas.getByTestId('portal-host')

    await waitFor(() => expect(host.querySelector('[role="dialog"]')).not.toBeNull())
  }}
>
  {#snippet template(args)}
    <div id="modal-portal-test" data-testid="portal-host"></div>
    <ModalDemo {...args} />
  {/snippet}
</Story>

<Story name="Empty" tags={['empty']} args={{ isOpen: false, onClose: fn() }} />

<style>
  :global(.modal-demo-inset) {
    margin: 1rem;
  }
</style>
