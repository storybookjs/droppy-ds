<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { TopBanner } from '../TopBanner'

  import Breadcrumb, { type BreadcrumbProps } from './Breadcrumb.svelte'
  import RouterLink from './fixtures/RouterLink.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof BreadcrumbProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
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
        description:
          'Merged onto the root alongside the component’s own `droppy-Breadcrumb` class.',
      },
    },
  })
</script>

{#snippet homeLink(props: Record<string, unknown>)}<RouterLink to="/" {...props} />{/snippet}
{#snippet categoriesLink(props: Record<string, unknown>)}<RouterLink
    to="/categories"
    {...props}
  />{/snippet}
{#snippet sushiLink(props: Record<string, unknown>)}<RouterLink
    to="/categories/sushi"
    {...props}
  />{/snippet}

<!--
  The trail above a category page. Edit the items in the controls to add or
  remove crumbs — the last one is always the current page.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ items: [{ label: 'categories', href: '/categories' }, { label: 'sushi' }] }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `items` is the trail. A crumb with no `href` and no `render` renders as text. -->
<Story
  name="Items"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{
    items: [
      { label: 'home', href: '/' },
      { label: 'categories', href: '/categories' },
      { label: 'asian', href: '/categories/asian' },
      { label: 'sushi' },
    ],
  }}
/>

<!-- A single crumb is the current page on its own — no separator is rendered. -->
<Story
  exportName="SingleCrumb"
  name="Single Crumb"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ items: [{ label: 'restaurants' }] }}
/>

<!--
  Item `render` swaps the default `<a>` for a router-aware link, cloned with
  the crumb's class and — on the last item — `aria-current`.
-->
<Story
  exportName="ItemRender"
  name="Item Render"
  tags={['api-ref', 'highlight']}
  argTypes={hide('class')}
>
  {#snippet template({ items: _items, ...args })}
    <Breadcrumb
      {...args}
      items={[
        { label: 'categories', render: categoriesLink },
        { label: 'sushi', render: sushiLink },
      ]}
    />
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
  args={{ class: 'breadcrumb-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  The last crumb carries `aria-current="page"` whether it renders as a link or
  as plain text, and the whole trail sits in a `<nav aria-label="breadcrumb">`
  landmark — the semantics Mealdrop's `div`/`p` version had none of.
-->
<Story
  exportName="CurrentPageIsMarked"
  name="Current Page Is Marked"
  tags={['highlight']}
  argTypes={hide('class')}
  args={{
    items: [
      { label: 'categories', href: '/categories' },
      { label: 'sushi', href: '/categories/sushi' },
    ],
  }}
/>

<!-- anatomy — the rendered part tree -->

<!-- The landmark, the list, and one crumb per item with its separator. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('items', 'class')}
  parameters={{
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
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- The trail under a category page banner. -->
<Story
  exportName="MealdropCategoryTrail"
  name="Mealdrop Category Trail"
  tags={['examples']}
  argTypes={hide('items', 'class')}
  parameters={{ layout: 'fullscreen' }}
>
  {#snippet template()}
    <div>
      <TopBanner
        title="Sushi"
        photoUrl="https://images.pexels.com/photos/9210/food-japanese-food-photography-sushi.jpg?auto=compress&cs=tinysrgb&dpr=2&h=550"
      />
      <div style="padding: 1rem 1.5rem">
        <Breadcrumb
          items={[
            { label: 'home', render: homeLink },
            { label: 'categories', render: categoriesLink },
            { label: 'sushi', render: sushiLink },
          ]}
        />
      </div>
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestCurrentPageIsMarked"
  name="Test Current Page Is Marked"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByText('sushi')).toHaveAttribute('aria-current', 'page')
    await expect(canvas.getByText('categories')).not.toHaveAttribute('aria-current')
  }}
/>

<Story
  exportName="TestLandmarkIsLabelled"
  name="Test Landmark Is Labelled"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('navigation', { name: 'breadcrumb' })).toBeInTheDocument()
  }}
/>

<Story
  exportName="TestRenderKeepsItsOwnDestination"
  name="Test Render Keeps Its Own Destination"
  tags={['tests']}
  play={async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-router-link]')).toHaveLength(2)
    await expect(canvas.getByText('sushi')).toHaveAttribute('aria-current', 'page')
  }}
>
  {#snippet template({ items: _items, ...args })}
    <Breadcrumb
      {...args}
      items={[
        { label: 'categories', render: categoriesLink },
        { label: 'sushi', render: sushiLink },
      ]}
    />
  {/snippet}
</Story>

<Story
  exportName="TestSeparatorIsNotAnnounced"
  name="Test Separator Is Not Announced"
  tags={['tests']}
  play={async ({ canvasElement }) => {
    const separator = canvasElement.querySelector('.droppy-Breadcrumb-separator')

    await expect(separator).toHaveAttribute('aria-hidden', 'true')
  }}
/>

<Story
  name="Empty"
  tags={['empty']}
  args={{ items: [{ label: 'parent', href: '/parent' }, { label: 'current page' }] }}
/>

<style>
  :global(.breadcrumb-demo-inset) {
    margin: 1rem;
  }
</style>
