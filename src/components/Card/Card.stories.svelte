<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Badge } from '../Badge'
  import { Body } from '../Body'
  import { Heading } from '../Heading'
  import { Review } from '../Review'

  import Card, { type CardProps } from './Card.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof CardProps | 'children'>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const CATEGORIES = [
    {
      title: 'Burgers',
      photoUrl:
        'https://images.pexels.com/photos/2233351/pexels-photo-2233351.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=550',
    },
    {
      title: 'Pizza',
      photoUrl:
        'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=550',
    },
    {
      title: 'Sushi',
      photoUrl:
        'https://images.pexels.com/photos/9210/food-japanese-food-photography-sushi.jpg?auto=compress&cs=tinysrgb&dpr=2&h=550',
    },
  ]

  const { Story } = defineMeta({
    title: 'Media & content/Card',
    component: Card,
    args: { children: 'Card content' },
    argTypes: {
      children: { control: 'text', description: 'Whatever the card groups — no slots.' },
      interactive: {
        control: 'boolean',
        description: 'Hover dim + pointer cursor. Appearance only — wire your own click handling.',
      },
      padded: {
        control: 'boolean',
        description: 'Adds `--ds-space-sm` padding on all sides. Bare by default.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Card` class.',
      },
    },
  })
</script>

<!--
  A rounded, clipped surface for grouping content. Both variant props are set
  below, so the controls start populated — flip `padded` or `interactive`.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ children: 'Card content', padded: true, interactive: false }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `children` compose freely — `Card` provides the surface and nothing else. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('interactive', 'padded', 'class')}
  args={{ padded: true }}
>
  {#snippet template({ children: _children, ...args })}
    <Card {...args}>
      <strong>Burger Kingdom</strong>
      <p style="margin: 0.25rem 0 0">Nicest place for burgers</p>
    </Card>
  {/snippet}
</Story>

<!-- `padded` adds uniform padding, for children that don't own their own. -->
<Story
  name="Padded"
  tags={['api-ref']}
  argTypes={hide('interactive', 'class')}
  args={{ padded: true }}
/>

<!-- `interactive` is appearance only: hover dim and a pointer cursor. -->
<Story
  name="Interactive"
  tags={['api-ref']}
  argTypes={hide('padded', 'class')}
  args={{ interactive: true, padded: true, children: 'Hover me' }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('interactive', 'padded')}
  args={{ class: 'card-demo-inset', children: 'Card content', padded: true }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!-- An edge-to-edge image clips to the card's own corner radius instead of squaring off past it. -->
<Story
  exportName="WithImage"
  name="With Image"
  tags={['highlight']}
  argTypes={hide('children', 'interactive', 'padded', 'class')}
>
  {#snippet template({ children: _children, ...args })}
    <Card {...args} style="width: 16rem">
      <img
        src="https://placehold.co/320x180"
        alt=""
        style="display: block; width: 100%; height: 10rem; object-fit: cover"
      />
      <div style="padding: 1rem">Restaurant name</div>
    </Card>
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- A single part: one `<div>` providing the surface, with children in normal flow. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('children', 'interactive', 'padded', 'class')}
  args={{ padded: true }}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The surface: background, radius, and the clipping that keeps images in.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- A restaurant listing tile: photo, name, rating, specialty, categories. -->
<Story
  exportName="MealdropRestaurantTile"
  name="Mealdrop Restaurant Tile"
  tags={['examples']}
  argTypes={hide('children', 'interactive', 'padded', 'class')}
>
  {#snippet template()}
    <Card interactive style="width: 18rem" onclick={() => {}}>
      <img
        src="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20"
        alt=""
        style="display: block; height: 160px; width: 100%; object-fit: cover"
      />
      <div style="display: grid; gap: 0.5rem; padding: 1.5rem">
        <Heading level={2} size={4}>Burger Kingdom</Heading>
        <Review rating={4.2} />
        <Body size="S">Nicest place for burgers</Body>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem">
          <Badge text="burgers" />
          <Badge text="comfort food" />
        </div>
      </div>
    </Card>
  {/snippet}
</Story>

<!-- A category tile: round photo and a single label, on the same shell. -->
<Story
  exportName="MealdropCategoryTile"
  name="Mealdrop Category Tile"
  tags={['examples']}
  argTypes={hide('children', 'interactive', 'padded', 'class')}
>
  {#snippet template()}
    <div style="display: flex; gap: 1rem; flex-wrap: wrap">
      {#each CATEGORIES as category (category.title)}
        <Card interactive padded style="width: 11rem; text-align: center" onclick={() => {}}>
          <img
            src={category.photoUrl}
            alt=""
            style="display: block; width: 6rem; height: 6rem; margin: 0 auto 0.75rem; border-radius: 50%; object-fit: cover"
          />
          <Body fontWeight="bold">{category.title}</Body>
        </Card>
      {/each}
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestRoundedAndRaised"
  name="Test Rounded And Raised"
  tags={['tests']}
  play={async ({ canvas }) => {
    const card = canvas.getByText('Card content')

    await expect(getComputedStyle(card).borderRadius).toBe('8px')
    // Flat at rest by design — elevation is the consumer's choice to add.
    await expect(getComputedStyle(card).boxShadow).toBe('none')
  }}
/>

<Story
  exportName="TestClipsOverflow"
  name="Test Clips Overflow"
  tags={['tests']}
  play={async ({ canvasElement }) => {
    const card = canvasElement.querySelector('.droppy-Card') as HTMLElement

    await expect(getComputedStyle(card).overflow).toBe('hidden')
  }}
>
  {#snippet template()}
    <Card style="width: 16rem">
      <img src="https://placehold.co/320x180" alt="" style="display: block; width: 100%" />
    </Card>
  {/snippet}
</Story>

<Story
  exportName="TestInteractiveIsAppearanceOnly"
  name="Test Interactive Is Appearance Only"
  tags={['tests']}
  args={{ interactive: true }}
  play={async ({ canvas, canvasElement }) => {
    const card = canvasElement.querySelector('.droppy-Card') as HTMLElement

    await expect(card).toHaveClass('droppy-Card--interactive')
    // No role, no tabindex — the caller owns the interactive semantics.
    await expect(card).not.toHaveAttribute('tabindex')
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.card-demo-inset) {
    margin: 1rem;
  }
</style>
