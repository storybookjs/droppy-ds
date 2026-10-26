<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import PageSection, { type PageSectionProps } from './PageSection.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof PageSectionProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Layout & structure/PageSection',
    component: PageSection,
    args: { title: 'Asian', children: cardsPlaceholder },
    argTypes: {
      title: { control: 'text', description: 'Rendered as an `h2` above the content.' },
      topButtonLabel: {
        control: 'text',
        description: 'Adds a `clear` Button beside the title. Omitted, no control renders.',
      },
      onTopButtonClick: { description: 'Fired by that button.' },
      children: { control: false, description: 'The section body, below the title row.' },
      class: {
        control: 'text',
        description:
          'Merged onto the root alongside the component’s own `droppy-PageSection` class.',
      },
    },
    parameters: { layout: 'fullscreen' },
  })
</script>

{#snippet cardsPlaceholder()}
  <p>Restaurant cards go here.</p>
{/snippet}

<!--
  A titled band of page content. Both the title and the optional action are
  set below, so the controls start populated — clear the label to drop the
  button.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ title: 'Asian', topButtonLabel: 'View all categories', onTopButtonClick: fn() }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `title` renders as an `h2`, so sections nest correctly under a page `h1`. -->
<Story
  name="Title"
  tags={['api-ref']}
  argTypes={hide('topButtonLabel', 'class')}
  args={{ title: 'Award winning restaurants', topButtonLabel: undefined }}
/>

<!-- `topButtonLabel` adds a `clear` Button beside the title. -->
<Story
  exportName="TopButtonLabel"
  name="Top Button Label"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ topButtonLabel: 'View all categories', onTopButtonClick: fn() }}
/>

<!-- `children` are the section body, laid out by the caller. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('topButtonLabel', 'class')}
  args={{ topButtonLabel: undefined }}
>
  {#snippet template(args)}
    <PageSection {...args}>
      <div style="display: flex; gap: 1rem">
        <p>Card one</p>
        <p>Card two</p>
      </div>
    </PageSection>
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
  argTypes={hide('topButtonLabel')}
  args={{ class: 'pagesection-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  The action is optional and renders nothing at all when `topButtonLabel` is
  absent — the title row doesn't reserve space for a button that isn't there.
-->
<Story
  exportName="ActionIsOptional"
  name="Action Is Optional"
  tags={['highlight']}
  argTypes={hide('class')}
>
  {#snippet template(args)}
    <PageSection {...args} title="With an action" topButtonLabel="View all" />
    <PageSection {...args} title="Without one" topButtonLabel={undefined} />
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- The section, its title row, and the optional action inside it. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('title', 'topButtonLabel', 'class')}
  args={{ topButtonLabel: 'View all categories', onTopButtonClick: fn() }}
  parameters={{
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The section: title row above, content below.' },
        {
          id: 'top',
          name: 'Top',
          description: 'The title row — heading on one side, optional action on the other.',
        },
        { id: 'title', name: 'Title', description: 'The `h2`.' },
        {
          id: 'action',
          name: 'Action',
          description: 'The `clear` Button, rendered only when `topButtonLabel` is set.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestTitleIsALevelTwoHeading"
  name="Test Title Is A Level Two Heading"
  tags={['tests']}
  args={{ topButtonLabel: undefined }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Asian' })).toBeInTheDocument()
  }}
/>

<Story
  exportName="TestNoActionWithoutALabel"
  name="Test No Action Without A Label"
  tags={['tests']}
  args={{ topButtonLabel: undefined }}
  play={async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  }}
/>

<Story
  exportName="TestActionFiresItsCallback"
  name="Test Action Fires Its Callback"
  tags={['tests']}
  args={{ topButtonLabel: 'View all categories', onTopButtonClick: fn() }}
  play={async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'View all categories' }))

    await expect(args.onTopButtonClick).toHaveBeenCalledOnce()
  }}
/>

<Story name="Empty" tags={['empty']} args={{ title: 'Title' }}>
  {#snippet template(args)}
    <PageSection {...args}>
      <p>Content goes here.</p>
    </PageSection>
  {/snippet}
</Story>

<style>
  :global(.pagesection-demo-inset) {
    margin: 1rem;
  }
</style>
