import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import Review, { type ReviewProps } from './Review.svelte'
import BandBoundariesDemo from './fixtures/BandBoundaries.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import MealdropRestaurantScoresDemo from './fixtures/MealdropRestaurantScores.svelte'
import RatingDemo from './fixtures/Rating.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ReviewProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
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
} satisfies Meta<typeof Review>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A restaurant's score line. Drag the rating control across the bands to watch
 * the label change — and past zero to see the empty state.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { rating: 4.5 },
  argTypes: hide('color', 'class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `rating` drives both the number and the word beside it. */
export const Rating: Story = {
  tags: ['api-ref'],
  argTypes: hide('rating', 'color', 'class'),
  render: (args) => ({ Component: RatingDemo, props: args }),
}

/** `color` overrides the deliberately quiet default token. */
export const Color: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { rating: 4.2, color: '#0a7d32' },
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('color'),
  args: {
    class: 'review-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The bands are fixed: under 2 is "Very poor", 2–4 "Adequate", 4–5 "Very
 * good", and exactly 5 "Excellent". The number is always shown to one decimal,
 * so 4 and 4.0 read the same.
 */
export const RatingBands: Story = {
  tags: ['highlight'],
  argTypes: hide('rating', 'color', 'class'),
  render: (args) => ({
    Component: RatingDemo,
    props: { ...args, ratings: [1, 1.9, 2, 3.9, 4, 4.9, 5], withEmpty: false },
  }),
}

/** No rating renders a plain fallback line instead of a zero-star score. */
export const NoReviews: Story = {
  tags: ['highlight'],
  argTypes: hide('color', 'class'),
  args: { rating: undefined },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** A wrapper and the text line inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('rating', 'color', 'class'),
  parameters: {
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
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Rated and unrated restaurant tiles. */
export const MealdropRestaurantScores: Story = {
  tags: ['examples'],
  argTypes: hide('rating', 'color', 'class'),
  render: () => ({ Component: MealdropRestaurantScoresDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestFormatsTheScoreLine: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByText('★ 4.5 Very good')).toBeInTheDocument()
  },
}

export const TestBandBoundaries: Story = {
  tags: ['tests'],
  render: () => ({ Component: BandBoundariesDemo }),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('★ 1.9 Very poor')).toBeInTheDocument()
    await expect(canvas.getByText('★ 2.0 Adequate')).toBeInTheDocument()
    await expect(canvas.getByText('★ 3.9 Adequate')).toBeInTheDocument()
    await expect(canvas.getByText('★ 4.0 Very good')).toBeInTheDocument()
    await expect(canvas.getByText('★ 5.0 Excellent')).toBeInTheDocument()
  },
}

export const TestNoReviewsFallback: Story = {
  tags: ['tests'],
  args: { rating: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No reviews yet')).toBeInTheDocument()
  },
}

export const Empty: Story = {
  tags: ['empty'],
}
