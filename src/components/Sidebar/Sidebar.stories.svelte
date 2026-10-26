<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

  import { inPortalHost } from '../../../.storybook/preview'
  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Button } from '../Button'

  import MealdropCartPanel from './fixtures/MealdropCartPanel.svelte'
  import SidebarDemo from './fixtures/SidebarDemo.svelte'
  import Sidebar, { type SidebarProps } from './Sidebar.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof SidebarProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const LONG_ORDER_LINES = Array.from({ length: 20 }, (_, index) => index)

  const { Story } = defineMeta({
    title: 'Overlays/Sidebar',
    component: Sidebar,
    args: { isOpen: false, title: 'Your order', onClose: fn(), children: order },
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
    render: demo,
    parameters: { layout: 'fullscreen' },
    decorators: [inPortalHost],
  })
</script>

<!-- A trigger plus a Sidebar whose open state starts at the `isOpen` arg. -->
{#snippet demo(args: SidebarProps)}
  <SidebarDemo {...args} />
{/snippet}

<!-- A short order list. -->
{#snippet order()}
  <ul style="margin: 0; padding-left: 1rem">
    <li>Margherita — €9.50</li>
    <li>Garlic bread — €4.00</li>
    <li>Sparkling water — €2.50</li>
  </ul>
{/snippet}

<!-- Twenty lines — enough to scroll. -->
{#snippet longOrder()}
  <ul style="margin: 0; padding-left: 1rem">
    {#each LONG_ORDER_LINES as line (line)}
      <li>Margherita — €9.50</li>
    {/each}
  </ul>
{/snippet}

<!-- A total and a checkout button, for the footer. -->
{#snippet checkout(total: string)}
  <div style="display: flex; flex-direction: column; gap: 1rem; width: 100%">
    <strong>Total — {total}</strong>
    <Button large icon="arrow-right">Go to checkout</Button>
  </div>
{/snippet}

{#snippet checkoutShort()}
  {@render checkout('€16.00')}
{/snippet}

{#snippet checkoutLong()}
  {@render checkout('€190.00')}
{/snippet}

<!--
  A cart reviewed alongside the page. `isOpen` and `title` are set below, so
  the controls start populated — flip `isOpen` to open it without clicking.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ isOpen: true, title: 'Your order' }}
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

<!-- `title` is the top-bar heading, and the dialog's accessible name. -->
<Story
  name="Title"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true, title: 'Filter restaurants' }}
/>

<!-- `children` scroll; the top bar and footer stay put around them. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true, children: order }}
/>

<!-- `footer` is pinned to the bottom — a plain flex container the caller fills. -->
<Story
  name="Footer"
  tags={['api-ref']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true, footer: checkoutShort }}
/>

<!-- `container` picks the portal target — an element or a selector. -->
<Story
  name="Container"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ isOpen: true, container: '#sidebar-container-demo' }}
>
  {#snippet template(args)}
    <SidebarDemo {...args} hostId="sidebar-container-demo" />
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
  args={{ isOpen: true, class: 'sidebar-demo-inset', container: '#sidebar-classname-demo' }}
  decorators={[inBorderedBox]}
>
  {#snippet template(args)}
    <SidebarDemo {...args} hostId="sidebar-classname-demo" />
  {/snippet}
</Story>

<!-- highlight — features and behaviours worth calling out -->

<!-- Below the mobile breakpoint the panel takes the full width. -->
<Story
  exportName="FullWidthOnMobile"
  name="Full Width On Mobile"
  tags={['highlight']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true }}
  globals={{ viewport: { value: 'mobile1' } }}
/>

<!--
  The footer is pinned and the content scrolls above it, so a long order never
  pushes the checkout button out of reach.
-->
<Story
  exportName="PinnedFooterWithScrollingContent"
  name="Pinned Footer With Scrolling Content"
  tags={['highlight']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true, children: longOrder, footer: checkoutLong }}
/>

<!-- animation — the motion contract -->

<!--
  The panel slides from the trailing edge off `[data-starting-style]` and
  `[data-ending-style]`, and stays mounted through the exit so the close
  animation runs before it leaves the DOM.
-->
<Story
  exportName="SlideTransition"
  name="Slide Transition"
  tags={['animation']}
  argTypes={hide('container', 'class')}
  args={{ isOpen: true }}
  play={async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)
    const popup = await doc.findByRole('dialog')

    await expect(getComputedStyle(popup).transitionProperty).not.toBe('none')
  }}
/>

<!-- anatomy — the rendered part tree -->

<!--
  Portalled into a node inside the canvas via `container`, so the Anatomy
  panel can reach the parts — it only scans the story canvas, and the default
  portal target is the document body. Rendered open and with no trigger, so the
  panel scans the drawer's own parts rather than the button that would have
  opened it. The footer's reserved height is overridden ([#140]) so a one-line
  total sits in a bar rather than at the top of a 165px block.
-->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('isOpen', 'title', 'children', 'footer', 'container', 'class')}
  args={{ isOpen: true, class: 'sidebar-anatomy-footer' }}
  parameters={{
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
  }}
>
  {#snippet template({ children: _c, footer: _f, onClose: _o, ...args })}
    <Sidebar {...args} onClose={() => {}}>
      <ul style="margin: 0; padding-left: 1rem">
        <li>Margherita — €9.50</li>
        <li>Garlic bread — €4.00</li>
        <li>Sparkling water — €2.50</li>
      </ul>
      {#snippet footer()}
        <Body type="span" fontWeight="bold">Total — €16.00</Body>
      {/snippet}
    </Sidebar>
  {/snippet}
</Story>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Mealdrop's cart panel, opened from the header's cart button. -->
<Story
  exportName="MealdropCartPanel"
  name="Mealdrop Cart Panel"
  tags={['examples']}
  argTypes={hide('isOpen', 'title', 'onClose', 'footer', 'container', 'children', 'class')}
  play={async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: '6' }))

    await waitFor(() => expect(canvas.getByRole('dialog')).toBeVisible())
  }}
>
  {#snippet template(args)}
    <MealdropCartPanel container={args.container} />
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestOpensAndCloses"
  name="Test Opens And Closes"
  tags={['tests']}
  play={async ({ args, canvas, canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open cart' }))
    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())

    await userEvent.click(doc.getByRole('button', { name: 'close sidebar' }))

    await waitFor(() => expect(args.onClose).toHaveBeenCalled())
    // Settle the exit transition before the automatic a11y check: Bits UI's
    // focus guards (aria-hidden + tabindex) exist while the drawer is mounted
    // and trip axe's aria-hidden-focus rule if it snapshots mid-close.
    await waitFor(() => expect(doc.queryByRole('dialog')).not.toBeInTheDocument())
  }}
/>

<Story
  exportName="TestTitleNamesTheDialog"
  name="Test Title Names The Dialog"
  tags={['tests']}
  args={{ isOpen: true }}
  play={async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(doc.getByRole('dialog', { name: 'Your order' })).toBeVisible())
  }}
/>

<Story
  exportName="TestFooterIsOptional"
  name="Test Footer Is Optional"
  tags={['tests']}
  args={{ isOpen: true, footer: undefined }}
  play={async ({ canvasElement }) => {
    const doc = within(canvasElement.ownerDocument.body)

    await waitFor(() => expect(doc.getByRole('dialog')).toBeVisible())
    await expect(
      canvasElement.ownerDocument.querySelector('[data-testid="sidebar-footer"]')
    ).toBeNull()
  }}
/>

<Story
  exportName="TestContainerPortalsWhereAsked"
  name="Test Container Portals Where Asked"
  tags={['tests']}
  args={{ isOpen: true, container: '#sidebar-portal-test' }}
  play={async ({ canvas }) => {
    const host = canvas.getByTestId('portal-host')

    await waitFor(() => expect(host.querySelector('[role="dialog"]')).not.toBeNull())
  }}
>
  {#snippet template(args)}
    <SidebarDemo {...args} hostId="sidebar-portal-test" hostTestId="portal-host" />
  {/snippet}
</Story>

<Story name="Empty" tags={['empty']} args={{ isOpen: false, title: 'Title', onClose: fn() }} />

<style>
  :global(.sidebar-anatomy-footer .droppy-Sidebar-footer) {
    --droppy-sidebar-footer-height: 3.5rem;
    align-items: center;
  }
</style>
