<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Card } from '../Card'

  import Heading, { type HeadingProps } from './Heading.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof HeadingProps | 'children'>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const STEPS = [1, 2, 3, 4, 5] as const

  const SECTIONS = [
    { section: 'Food', dishes: ['Cheeseburger', 'Fries'] },
    { section: 'Dessert', dishes: ['Vanilla ice cream'] },
    { section: 'Drinks', dishes: ['Coca-Cola', 'Sprite'] },
  ]

  const { Story } = defineMeta({
    title: 'Typography/Heading',
    component: Heading,
    args: { children: 'Best food in town' },
    argTypes: {
      children: { control: 'text', description: 'The heading text.' },
      level: {
        control: 'radio',
        options: [1, 2, 3, 4, 5],
        description: 'The rendered tag (`h1`–`h5`). Also the size step when `size` is unset.',
      },
      size: {
        control: 'radio',
        options: [undefined, 1, 2, 3, 4, 5],
        description: 'Visual size step, independent of `level`. Defaults to `level`.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Heading` class.',
      },
    },
  })
</script>

<!--
  A page title. `level` and `size` are both set below, so the controls start
  populated — move them apart to see the tag and the visual size decouple.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ children: 'Best food in town', level: 1, size: undefined }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `children` is the heading text; nodes work as well as strings. -->
<Story name="Children" tags={['api-ref']} argTypes={hide('level', 'size', 'class')}>
  {#snippet template({ children: _children, ...args })}
    <Heading {...args}>Best food in <em>town</em></Heading>
  {/snippet}
</Story>

<!-- `level` picks the tag and, on its own, the size step to match. -->
<Story name="Levels" tags={['api-ref']} argTypes={hide('level', 'size', 'class')}>
  {#snippet template(args)}
    {#each STEPS as level (level)}
      <Heading {...args} {level}>Level {level}</Heading>
    {/each}
  {/snippet}
</Story>

<!-- `size` picks the visual step on its own; the tag still follows `level`. -->
<Story name="Sizes" tags={['api-ref']} argTypes={hide('level', 'size', 'class')}>
  {#snippet template(args)}
    {#each STEPS as size (size)}
      <Heading {...args} level={2} {size}>h2 at size {size}</Heading>
    {/each}
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
  argTypes={hide('level', 'size')}
  args={{ class: 'heading-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  `size` decouples the visual size from the outline, so a card title can stay
  an `h2` for screen readers while looking like a level-4 heading. Without it
  you'd reach for a wrong `level` and break the document outline.
-->
<Story
  exportName="SizeDecoupledFromLevel"
  name="Size Decoupled From Level"
  tags={['highlight']}
  argTypes={hide('class')}
  args={{ level: 2, size: 4 }}
/>

<!-- anatomy — the rendered part tree -->

<!-- A single part, whose tag follows `level`. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('children', 'level', 'size', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The rendered `<h1>`–`<h5>`, picked by `level` and sized by `size`.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- The heading ladder on a restaurant detail page. -->
<Story
  exportName="MealdropHeadingLadder"
  name="Mealdrop Heading Ladder"
  tags={['examples']}
  argTypes={hide('children', 'level', 'size', 'class')}
>
  {#snippet template()}
    <div style="display: grid; gap: 2rem; max-width: 36rem">
      <Heading level={1}>Burger Kingdom</Heading>

      {#each SECTIONS as { section, dishes } (section)}
        <section style="display: grid; gap: 0.75rem">
          <Heading level={2}>{section}</Heading>
          {#each dishes as dish (dish)}
            <Card padded>
              <Heading level={3} size={4}>{dish}</Heading>
              <Body size="S">Nice grilled burger with cheese</Body>
            </Card>
          {/each}
        </section>
      {/each}
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestRendersMatchingTag"
  name="Test Renders Matching Tag"
  tags={['tests']}
  args={{ level: 3 }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3 })).toBeInTheDocument()
  }}
/>

<Story
  exportName="TestSizeDoesNotChangeTag"
  name="Test Size Does Not Change Tag"
  tags={['tests']}
  args={{ level: 2, size: 4 }}
  play={async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2 })

    await expect(heading).toHaveClass('droppy-Heading--4')
    await expect(heading).not.toHaveClass('droppy-Heading--2')
  }}
/>

<Story
  exportName="TestForwardsRefAndProps"
  name="Test Forwards Ref And Props"
  tags={['tests']}
  args={{ id: 'heading-demo-id', level: 2 }}
  play={async ({ canvas }) => {
    // The ref/prop passthrough is what lets Bits UI's Dialog.Title point `aria-labelledby` at the real heading element.
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveAttribute('id', 'heading-demo-id')
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.heading-demo-inset) {
    margin: 1rem;
  }
</style>
