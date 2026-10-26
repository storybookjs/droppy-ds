<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import InverseSurface from './fixtures/InverseSurface.svelte'
  import RouterLink from './fixtures/RouterLink.svelte'
  import FooterCard, { type FooterCardProps } from './FooterCard.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof FooterCardProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Navigation/FooterCard',
    component: FooterCard,
    args: {
      title: 'Discover us',
      links: [
        { name: 'Home', href: '/' },
        { name: 'Categories', href: '/categories' },
        { name: 'About', href: '/about' },
      ],
    },
    argTypes: {
      title: { control: 'text', description: 'Column heading, rendered as an `h2`.' },
      links: {
        control: 'object',
        description:
          'The link list, as `{ name, href?, external?, render? }`. Empty renders no list.',
      },
      children: {
        control: false,
        description: 'Arbitrary content below the list — app badges, a paragraph.',
      },
      class: {
        control: 'text',
        description:
          'Merged onto the root alongside the component’s own `droppy-FooterCard` class.',
      },
    },
    decorators: [() => ({ Component: InverseSurface })],
  })
</script>

{#snippet home(props: Record<string, unknown>)}<RouterLink to="/" {...props} />{/snippet}
{#snippet categories(props: Record<string, unknown>)}<RouterLink
    to="/categories"
    {...props}
  />{/snippet}

<!--
  One column of a page footer. Title and links are both set below, so the
  controls start populated — edit the list to add or remove entries.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{
    title: 'Discover us',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' },
      { name: 'About', href: '/about' },
    ],
  }}
  argTypes={hide('children', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `title` is the column heading, rendered as an `h2`. -->
<Story
  name="Title"
  tags={['api-ref']}
  argTypes={hide('links', 'children', 'class')}
  args={{ title: 'Our social media' }}
/>

<!-- `links` is the list. Omitted or empty, no `<ul>` is rendered at all. -->
<Story
  name="Links"
  tags={['api-ref']}
  argTypes={hide('children', 'class')}
  args={{
    links: [
      { name: 'Home', href: '/' },
      { name: 'Categories', href: '/categories' },
    ],
  }}
/>

<!-- Item `external` opens in a new tab with `rel="noopener noreferrer"`. -->
<Story
  name="ExternalLinks"
  tags={['api-ref', 'highlight']}
  argTypes={hide('children', 'class')}
  args={{
    title: 'Our social media',
    links: [
      { name: 'Facebook', href: 'https://facebook.com', external: true },
      { name: 'Instagram', href: 'https://instagram.com', external: true },
    ],
  }}
/>

<!-- Item `render` swaps the default `<a>` for a router-aware link, per item. -->
<Story name="ItemRender" tags={['api-ref', 'highlight']} argTypes={hide('children', 'class')}>
  {#snippet template(args)}
    <FooterCard
      {...args}
      links={[
        { name: 'Home', render: home },
        { name: 'Categories', render: categories },
      ]}
    />
  {/snippet}
</Story>

<!-- `children` render below the list — app store badges, a short paragraph. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('links', 'class')}
  args={{ title: 'Check our apps', links: [] }}
>
  {#snippet template(args)}
    <FooterCard {...args}>
      <!-- No color set here — it inherits FooterCard's own on-dark text color. -->
      <p style="margin: 0">Available on iOS and Android.</p>
    </FooterCard>
  {/snippet}
</Story>

<!--
  `className` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  name="ClassName"
  tags={['api-ref']}
  argTypes={hide('links', 'children')}
  args={{ class: 'footercard-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- anatomy — the rendered part tree -->

<!-- The column, its heading, and the list of links inside it. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('title', 'links', 'children', 'class')}
  parameters={{
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The column: heading above, list below.' },
        { id: 'title', name: 'Title', description: 'The `h2` column heading.' },
        { id: 'list', name: 'List', description: 'The `<ul>`; absent when `links` is empty.' },
        { id: 'item', name: 'Item', description: 'One `<li>` per entry.' },
        {
          id: 'link',
          name: 'Link',
          description: 'The `Link` inside it — an `<a>`, or whatever `render` supplies.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Mealdrop's footer link columns. -->
<Story
  name="MealdropFooterRow"
  tags={['examples']}
  argTypes={hide('title', 'links', 'children', 'class')}
>
  {#snippet template()}
    <div style="display: flex; flex-wrap: wrap; gap: 3rem">
      <FooterCard
        title="Discover us"
        links={[
          { name: 'Home', href: '/' },
          { name: 'Categories', href: '/categories' },
          { name: 'About', href: '/about' },
        ]}
      />
      <FooterCard
        title="Our social media"
        links={[
          { name: 'Facebook', href: 'https://facebook.com', external: true },
          { name: 'Instagram', href: 'https://instagram.com', external: true },
          { name: 'Twitter', href: 'https://twitter.com', external: true },
        ]}
      />
      <FooterCard title="Check our apps">
        <div style="display: grid; gap: 0.5rem">
          <img src="https://placehold.co/120x40?text=App+Store" alt="Download on the App Store" />
          <img src="https://placehold.co/120x40?text=Google+Play" alt="Get it on Google Play" />
        </div>
      </FooterCard>
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestLinksResolve"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Categories' })).toHaveAttribute(
      'href',
      '/categories'
    )
  }}
/>

<Story
  name="TestExternalLinksAreSafe"
  tags={['tests']}
  args={{ links: [{ name: 'Facebook', href: 'https://facebook.com', external: true }] }}
  play={async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Facebook' })

    await expect(link).toHaveAttribute('target', '_blank')
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  }}
/>

<Story
  name="TestEmptyLinksRendersNoList"
  tags={['tests']}
  args={{ links: [] }}
  play={async ({ canvas }) => {
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument()
    await expect(canvas.getByRole('heading', { level: 2 })).toBeInTheDocument()
  }}
/>

<Story
  name="TestItemRenderKeepsItsDestination"
  tags={['tests']}
  play={async ({ canvasElement }) => {
    const link = canvasElement.querySelector('[data-router-link]')

    await expect(link).toHaveAttribute('href', '/categories')
  }}
>
  {#snippet template(args)}
    <FooterCard {...args} links={[{ name: 'Categories', render: categories }]} />
  {/snippet}
</Story>

<Story name="Empty" tags={['empty']} args={{ title: 'Legal mentions' }} />

<style>
  :global(.footercard-demo-inset) {
    margin: 1rem;
  }
</style>
