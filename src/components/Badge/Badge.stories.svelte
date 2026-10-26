<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Card } from '../Card'
  import { Heading } from '../Heading'
  import { Review } from '../Review'

  import Badge, { type BadgeProps } from './Badge.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof BadgeProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  // Mealdrop's own listings (`src/stub/restaurants.ts`) — one rated, one newly listed.
  const LISTINGS = [
    {
      name: 'Burger Kingdom',
      specialty: 'Nicest place for burgers',
      rating: 4.2 as number | undefined,
      categories: ['burgers', 'comfort food'],
      isNew: false,
      photoUrl:
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20',
    },
    {
      name: "'t Kuyltje",
      specialty: 'Pastrami sandwiches',
      rating: undefined as number | undefined,
      categories: ['comfort food'],
      isNew: true,
      photoUrl: 'https://duyt4h9nfnj50.cloudfront.net/search_home/FastFood.jpg',
    },
  ]

  const { Story } = defineMeta({
    title: 'Feedback & status/Badge',
    component: Badge,
    args: { text: 'vegan' },
    argTypes: {
      text: {
        control: 'text',
        description: 'The label. Rendered capitalized regardless of the casing passed in.',
      },
      variant: {
        control: 'radio',
        options: ['neutral', 'positive'],
        description: '`positive` matches the look of an affirmative flag, e.g. "new".',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Badge` class.',
      },
    },
  })
</script>

<!--
  A dietary tag on a menu item. Both props are set below, so the controls
  start populated — edit the text or flip the variant to see the two looks.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ text: 'vegan', variant: 'neutral' }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `text` is the only required prop, and the only content the badge renders. -->
<Story
  name="Text"
  tags={['api-ref']}
  argTypes={hide('variant', 'class')}
  args={{ text: 'gluten free' }}
/>

<!-- `variant` swaps the background, text color, and weight — not the size. -->
<Story name="Variant" tags={['api-ref']} argTypes={hide('text', 'class')}>
  {#snippet template(args)}
    <div style="display: flex; gap: 0.5rem">
      <Badge {...args} text="vegan" variant="neutral" />
      <Badge {...args} text="new" variant="positive" />
    </div>
  {/snippet}
</Story>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  name="ClassName"
  tags={['api-ref']}
  argTypes={hide('variant')}
  args={{ class: 'badge-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!-- The pill grows with its content — there's no truncation or fixed width. -->
<Story
  name="LongerText"
  tags={['highlight']}
  argTypes={hide('class')}
  args={{ text: 'contains nuts and dairy' }}
/>

<!-- anatomy — the rendered part tree -->

<!-- A single part: `Badge` renders one `<span>` and nothing inside it. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('text', 'variant', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<span>` carrying the pill background, radius, and capitalization.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Category tags and a new flag on a restaurant tile. -->
<Story name="MealdropRestaurantTags" tags={['examples']} argTypes={hide('text', 'variant', 'class')}>
  {#snippet template()}
    <div style="display: flex; flex-wrap: wrap; gap: 1.5rem">
      {#each LISTINGS as listing (listing.name)}
        <Card interactive style="width: 18rem">
          <div style="position: relative; display: flex">
            {#if listing.isNew}
              <span style="position: absolute; top: 0.5rem; left: 0.5rem; z-index: 1">
                <Badge text="new" variant="positive" />
              </span>
            {/if}
            <img
              src={listing.photoUrl}
              alt=""
              style="height: 160px; width: 100%; object-fit: cover"
            />
          </div>
          <div style="display: grid; gap: 0.5rem; padding: 1.5rem">
            <Heading level={2} size={4}>{listing.name}</Heading>
            <Review rating={listing.rating} />
            <Body size="S">{listing.specialty}</Body>
            <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.5rem">
              {#each listing.categories as category (category)}
                <Badge text={category} />
              {/each}
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestCapitalizesText"
  tags={['tests']}
  args={{ text: 'vegan' }}
  play={async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('vegan')).textTransform).toBe('capitalize')
  }}
/>

<Story
  name="TestVariantSwapsTokens"
  tags={['tests']}
  play={async ({ canvas }) => {
    const neutral = canvas.getByText('vegan')
    const positive = canvas.getByText('new')

    await expect(getComputedStyle(neutral).backgroundColor).not.toBe(
      getComputedStyle(positive).backgroundColor
    )
    await expect(getComputedStyle(neutral).fontWeight).not.toBe(
      getComputedStyle(positive).fontWeight
    )
  }}
>
  {#snippet template()}
    <div style="display: flex; gap: 0.5rem">
      <Badge text="vegan" />
      <Badge text="new" variant="positive" />
    </div>
  {/snippet}
</Story>

<Story
  name="TestMergesClassName"
  tags={['tests']}
  args={{ class: 'badge-demo-custom' }}
  play={async ({ canvas }) => {
    const badge = canvas.getByText('vegan')

    await expect(badge).toHaveClass('droppy-Badge')
    await expect(badge).toHaveClass('badge-demo-custom')
  }}
/>

<Story name="Empty" tags={['empty']} args={{ text: 'Content' }} />

<style>
  :global(.badge-demo-inset) {
    margin: 1rem;
  }
</style>
