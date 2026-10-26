<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Card } from '../Card'
  import { Heading } from '../Heading'

  import RouterLink from './fixtures/RouterLink.svelte'
  import Link, { type LinkProps } from './Link.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof LinkProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** Drops args the template supplies itself, so they don't collide with its own content. */
  const omit = <K extends keyof LinkProps>(args: LinkProps, ...keys: K[]): Omit<LinkProps, K> =>
    Object.fromEntries(Object.entries(args).filter(([key]) => !keys.includes(key as K))) as Omit<
      LinkProps,
      K
    >

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
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
  })
</script>

<!--
  A plain sentence link. Text and destination are set below, so the controls
  start populated.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ children: 'Order again', href: '/orders' }}
  argTypes={hide('render', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `children` is the link text — keep it descriptive out of context. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('render', 'class')}
  args={{ children: 'Track your order' }}
/>

<!-- `href` is the destination for the default `<a>`. -->
<Story
  name="Href"
  tags={['api-ref']}
  argTypes={hide('render', 'class')}
  args={{ href: 'https://droppy.example/help', children: 'Visit the help centre' }}
/>

<!--
  `render` swaps the `<a>` for a router-aware link — a snippet that spreads the
  props it receives onto a stand-in router link. The rendered element owns its
  own destination, so `href` is never passed to the snippet.
-->
<Story name="Render" tags={['api-ref', 'highlight']} argTypes={hide('href', 'class')}>
  {#snippet template(args)}
    <Link {...omit(args, 'render', 'href')}>
      {#snippet render(props)}
        <RouterLink to="/orders" {...props} />
      {/snippet}
    </Link>
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
  argTypes={hide('render')}
  args={{ class: 'link-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!-- Inline inside a sentence, inheriting the surrounding text's font. -->
<Story name="Inline" tags={['highlight']} argTypes={hide('render', 'class')}>
  {#snippet template(args)}
    <p>
      Your order is on its way. <Link {...omit(args, 'children')}>Track it</Link> or view the receipt.
    </p>
  {/snippet}
</Story>

<!--
  On a dark surface, `Link` inherits `currentColor` from the wrapping context
  rather than fighting it with a hard-coded light-mode token.
-->
<Story
  exportName="OnDarkSurface"
  name="On Dark Surface"
  tags={['highlight']}
  argTypes={hide('render', 'class')}
>
  {#snippet template(args)}
    <div style="background: #1a1a1a; color: #fff; padding: 1.5rem; border-radius: 0.5rem">
      <Link {...args} style="color: inherit" />
    </div>
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- A single part, whose tag is the `<a>` — or whatever `render` supplies. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('children', 'href', 'render', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<a>` — or the element `render` supplies, rendered with this class.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- An order-confirmation paragraph with an inline link. -->
<Story
  exportName="MealdropOrderConfirmationLink"
  name="Mealdrop Order Confirmation Link"
  tags={['examples']}
  argTypes={hide('href', 'render', 'children', 'class')}
>
  {#snippet template()}
    <Card padded style="max-width: 28rem">
      <Heading level={3} size={4}>Thanks, your order is on its way</Heading>

      <div style="display: grid; gap: 1rem; margin-top: 1rem">
        <Body size="S">
          Burger Kingdom is preparing order DB-2291.
          <Link href="https://example.com/orders/DB-2291">Track it</Link> on the courier's site.
        </Body>

        <Body size="S">
          Or follow it in the app —
          <Link>
            {#snippet render(props)}<RouterLink to="/orders/DB-2291" {...props} />{/snippet}
            track it here
          </Link> without leaving Mealdrop.
        </Body>
      </div>
    </Card>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestRendersAnAnchor"
  name="Test Renders An Anchor"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Order again' })).toHaveAttribute(
      'href',
      '/orders'
    )
  }}
/>

<Story
  exportName="TestRenderKeepsItsOwnDestination"
  name="Test Render Keeps Its Own Destination"
  tags={['tests']}
  play={async ({ canvasElement }) => {
    const link = canvasElement.querySelector('[data-router-link]')

    // `href` is never handed to the `render` snippet, so it can't clobber
    // the destination the router element computes from `to`.
    await expect(link).toHaveAttribute('href', '/orders')
  }}
>
  {#snippet template(args)}
    <Link {...omit(args, 'render', 'href')}>
      {#snippet render(props)}
        <RouterLink to="/orders" {...props} />
      {/snippet}
    </Link>
  {/snippet}
</Story>

<Story
  exportName="TestMergesClassName"
  name="Test Merges Class Name"
  tags={['tests']}
  args={{ class: 'link-demo-custom' }}
  play={async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Order again' })

    await expect(link).toHaveClass('droppy-Link')
    await expect(link).toHaveClass('link-demo-custom')
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.link-demo-inset) {
    margin: 1rem;
  }
</style>
