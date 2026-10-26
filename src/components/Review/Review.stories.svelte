<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Badge } from '../Badge'
  import { Body } from '../Body'
  import { Card } from '../Card'
  import { Heading } from '../Heading'

  import Review, { type ReviewProps } from './Review.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ReviewProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const SAMPLE_RATINGS = [1, 3, 4.5, 5]
  const BAND_RATINGS = [1, 1.9, 2, 3.9, 4, 4.9, 5]

  const { Story } = defineMeta({
    title: 'Feedback & status/Review',
    component: Review,
    args: { rating: 4.5 },
    argTypes: {
      rating: {
        control: { type: 'range', min: 0, max: 5, step: 0.1 },
        description: 'Average out of 5. Unset or falsy renders “No reviews yet”.',
      },
      color: {
        control: 'text',
        description: 'Overrides the quiet review text token (`--ds-color-text-review`).',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Review` class.',
      },
    },
  })
</script>

{#snippet ratingList(args: ReviewProps, ratings: number[], withEmpty: boolean)}
  <div style="display: grid; gap: 0.25rem">
    {#each ratings as rating (rating)}
      <Review {...args} {rating} />
    {/each}
    {#if withEmpty}<Review {...args} rating={undefined} />{/if}
  </div>
{/snippet}

<!--
  A restaurant's score line. Drag the rating control across the bands to watch
  the label change — and past zero to see the empty state.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ rating: 4.5 }}
  argTypes={hide('color', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `rating` drives both the number and the word beside it. -->
<Story name="Rating" tags={['api-ref']} argTypes={hide('rating', 'color', 'class')}>
  {#snippet template(args)}
    {@render ratingList(args, SAMPLE_RATINGS, true)}
  {/snippet}
</Story>

<!-- `color` overrides the deliberately quiet default token. -->
<Story
  name="Color"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ rating: 4.2, color: '#0a7d32' }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('color')}
  args={{ class: 'review-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  The bands are fixed: under 2 is "Very poor", 2–4 "Adequate", 4–5 "Very
  good", and exactly 5 "Excellent". The number is always shown to one decimal,
  so 4 and 4.0 read the same.
-->
<Story
  exportName="RatingBands"
  name="Rating Bands"
  tags={['highlight']}
  argTypes={hide('rating', 'color', 'class')}
>
  {#snippet template(args)}
    {@render ratingList(args, BAND_RATINGS, false)}
  {/snippet}
</Story>

<!-- No rating renders a plain fallback line instead of a zero-star score. -->
<Story
  exportName="NoReviews"
  name="No Reviews"
  tags={['highlight']}
  argTypes={hide('color', 'class')}
  args={{ rating: undefined }}
/>

<!-- anatomy — the rendered part tree -->

<!-- A wrapper and the text line inside it. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('rating', 'color', 'class')}
  parameters={{
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The wrapper the caller positions.' },
        {
          id: 'text',
          name: 'Text',
          description: 'The score line — star, number, and band label as one string.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Rated and unrated restaurant tiles. -->
<Story
  exportName="MealdropRestaurantScores"
  name="Mealdrop Restaurant Scores"
  tags={['examples']}
  argTypes={hide('rating', 'color', 'class')}
>
  {#snippet template()}
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
      <Card padded style="width: 16rem">
        <Heading level={2} size={4}>Burger Kingdom</Heading>
        <Review rating={4.2} />
        <Body size="S">Nicest place for burgers</Body>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem">
          <Badge text="burgers" />
          <Badge text="comfort food" />
        </div>
      </Card>

      <Card padded style="width: 16rem">
        <Heading level={2} size={4}>'t Kuyltje</Heading>
        <Review color="var(--ds-color-text-primary)" />
        <Body size="S">Pastrami sandwiches</Body>
        <div style="display: flex; gap: 0.5rem; margin-top: 0.75rem">
          <Badge text="new" variant="positive" />
          <Badge text="comfort food" />
        </div>
      </Card>
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestFormatsTheScoreLine"
  name="Test Formats The Score Line"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByText('★ 4.5 Very good')).toBeInTheDocument()
  }}
/>

<Story
  exportName="TestBandBoundaries"
  name="Test Band Boundaries"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByText('★ 1.9 Very poor')).toBeInTheDocument()
    await expect(canvas.getByText('★ 2.0 Adequate')).toBeInTheDocument()
    await expect(canvas.getByText('★ 3.9 Adequate')).toBeInTheDocument()
    await expect(canvas.getByText('★ 4.0 Very good')).toBeInTheDocument()
    await expect(canvas.getByText('★ 5.0 Excellent')).toBeInTheDocument()
  }}
>
  {#snippet template()}
    <Review rating={1.9} />
    <Review rating={2} />
    <Review rating={3.9} />
    <Review rating={4} />
    <Review rating={5} />
  {/snippet}
</Story>

<Story
  exportName="TestNoReviewsFallback"
  name="Test No Reviews Fallback"
  tags={['tests']}
  args={{ rating: undefined }}
  play={async ({ canvas }) => {
    await expect(canvas.getByText('No reviews yet')).toBeInTheDocument()
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.review-demo-inset) {
    margin: 1rem;
  }
</style>
