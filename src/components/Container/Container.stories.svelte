<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import Container, { type ContainerProps } from './Container.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ContainerProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  /** Tints the container so the width bound is visible. */
  const TINT = 'background: var(--ds-color-surface-highlight)'

  const { Story } = defineMeta({
    title: 'Layout & structure/Container',
    component: Container,
    args: { children: 'Page content' },
    argTypes: {
      children: { control: 'text', description: 'The page content the wrapper bounds.' },
      desktopOnly: {
        control: 'boolean',
        description:
          'Applies the max-width and side padding from the desktop breakpoint (1024px) up, rather than immediately.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Container` class.',
      },
    },
    parameters: { layout: 'fullscreen' },
  })
</script>

<!--
  The page-width wrapper, tinted here so the bound is visible. Both props are
  set below — toggle `desktopOnly` and resize to see where the constraint
  starts applying.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ children: 'Page content', desktopOnly: false }}
  argTypes={hide('class')}
>
  {#snippet template(args)}
    <Container {...args} style={TINT} />
  {/snippet}
</Story>

<!-- api-ref — one story per prop -->

<!-- `children` render in normal flow — the wrapper only bounds the width. -->
<Story name="Children" tags={['api-ref']} argTypes={hide('desktopOnly', 'class')}>
  {#snippet template(args)}
    <Container {...args} style={TINT}>
      <div>
        <h2 style="margin: 0">Restaurants near you</h2>
        <p>Everything inside keeps the page's max width and side padding.</p>
      </div>
    </Container>
  {/snippet}
</Story>

<!-- `desktopOnly` defers the constraint until the desktop breakpoint. -->
<Story
  exportName="DesktopOnly"
  name="Desktop Only"
  tags={['api-ref']}
  argTypes={hide('children', 'class')}
  args={{ desktopOnly: true }}
>
  {#snippet template(args)}
    <Container {...args} style={TINT} />
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
  argTypes={hide('desktopOnly', 'children')}
  args={{ class: 'container-demo-inset' }}
  decorators={[inBorderedBox]}
>
  {#snippet template(args)}
    <Container {...args} style={TINT} />
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- A single part: one `<div>` that bounds width and adds side padding. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('children', 'desktopOnly', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<div>` carrying the max-width bound and the side padding.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
>
  {#snippet template(args)}
    <Container {...args} style={TINT} />
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestBoundsPageWidth"
  name="Test Bounds Page Width"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Page content')).maxWidth).toBe('1600px')
  }}
/>

<Story
  exportName="TestMergesClassName"
  name="Test Merges Class Name"
  tags={['tests']}
  args={{ class: 'container-demo-custom' }}
  play={async ({ canvas }) => {
    const root = canvas.getByText('Page content')

    await expect(root).toHaveClass('droppy-Container')
    await expect(root).toHaveClass('container-demo-custom')
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.container-demo-inset) {
    margin: 1rem;
  }
</style>
