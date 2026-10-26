<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import PageTemplate, { type PageTemplateProps } from './PageTemplate.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof PageTemplateProps | 'children'>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Layout & structure/PageTemplate',
    component: PageTemplate,
    args: {
      header: header,
      footer: footer,
      children: pageContent,
    },
    argTypes: {
      header: { control: false, description: 'Rendered above the content, outside `<main>`.' },
      footer: { control: false, description: 'Rendered below the content, outside `<main>`.' },
      children: { control: false, description: 'The page content, inside the `<main>` landmark.' },
      class: {
        control: 'text',
        description:
          'Merged onto the root alongside the component’s own `droppy-PageTemplate` class.',
      },
    },
  })
</script>

{#snippet header()}
  <header style="padding: 1rem; background: #f5f5f5">Site header</header>
{/snippet}

{#snippet footer()}
  <footer style="padding: 1rem; background: #1a1a1a; color: #fff">Site footer</footer>
{/snippet}

{#snippet pageContent()}
  <div style="padding: 1rem">Page content</div>
{/snippet}

<!-- The page shell every routed page sits inside: header, `<main>`, footer. -->
<Story
  name="Default"
  tags={['showcase']}
  args={{ header: header, footer: footer }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `header` sits above the content area, outside the `<main>` landmark. -->
<Story
  name="Header"
  exportName="HeaderProp"
  tags={['api-ref']}
  argTypes={hide('footer', 'class')}
  args={{ footer: undefined }}
/>

<!-- `footer` sits below the content area, also outside `<main>`. -->
<Story
  name="Footer"
  exportName="FooterProp"
  tags={['api-ref']}
  argTypes={hide('header', 'class')}
  args={{ header: undefined }}
/>

<!-- `children` are the page content — the only part inside the landmark. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('header', 'footer', 'class')}
  args={{ header: undefined, footer: undefined }}
>
  {#snippet template(args)}
    <PageTemplate {...args}>
      <div style="padding: 1rem">Just the content area, semantically a <code>main</code>.</div>
    </PageTemplate>
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
  argTypes={hide('header', 'footer')}
  args={{ class: 'pagetemplate-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  The content area carries a minimum height, so a short page's footer still
  lands at the bottom of the viewport instead of riding up under the fold.
-->
<Story
  exportName="ShortPageKeepsFooterDown"
  name="Short Page Keeps Footer Down"
  tags={['highlight']}
  argTypes={hide('class')}
>
  {#snippet template(args)}
    <PageTemplate {...args}>
      <div style="padding: 1rem">One line of content.</div>
    </PageTemplate>
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- The shell and its `<main>` landmark. Header and footer are the caller's nodes. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('header', 'footer', 'children', 'class')}
  parameters={{
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The column: header, content, footer in order.' },
        {
          id: 'content',
          name: 'Content',
          description: 'The `<main>` landmark, carrying the min-height that pins the footer down.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestRendersAllThreeSlots"
  name="Test Renders All Three Slots"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByText('Site header')).toBeInTheDocument()
    await expect(canvas.getByText('Page content')).toBeInTheDocument()
    await expect(canvas.getByText('Site footer')).toBeInTheDocument()
  }}
/>

<Story
  exportName="TestContentIsTheMainLandmark"
  name="Test Content Is The Main Landmark"
  tags={['tests']}
  play={async ({ canvas }) => {
    const main = canvas.getByRole('main')

    await expect(main).toHaveTextContent('Page content')
    // Header and footer sit outside the landmark, not within it.
    await expect(main).not.toHaveTextContent('Site header')
    await expect(main).not.toHaveTextContent('Site footer')
  }}
/>

<Story
  exportName="TestSlotsAreOptional"
  name="Test Slots Are Optional"
  tags={['tests']}
  args={{ header: undefined, footer: undefined }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('main')).toBeInTheDocument()
    await expect(canvas.queryByText('Site header')).not.toBeInTheDocument()
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.pagetemplate-demo-inset) {
    margin: 1rem;
  }
</style>
