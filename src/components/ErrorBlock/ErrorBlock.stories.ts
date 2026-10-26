import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, fn, userEvent } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import ErrorBlock, { type ErrorBlockProps } from './ErrorBlock.svelte'
import ClassNameDemo from './fixtures/ClassName.svelte'
import MealdropEmptyCategoryDemo from './fixtures/MealdropEmptyCategory.svelte'
import MealdropNotFoundDemo from './fixtures/MealdropNotFound.svelte'
import { sushiIllustration } from './fixtures/sushi'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof ErrorBlockProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
  title: 'Feedback & status/ErrorBlock',
  component: ErrorBlock,
  args: {
    title: 'This is not the food you’re looking for.',
    body: 'There seems that there are no restaurants in this category yet. Try to come back later?',
    buttonText: 'See all restaurants',
    onButtonClick: fn(),
  },
  argTypes: {
    title: { control: 'text', description: 'Rendered as an `h2` at the top of the block.' },
    body: { control: 'text', description: 'The explanation, as body copy.' },
    buttonText: { control: 'text', description: 'Label for the single recovery action.' },
    onButtonClick: { description: 'Fired by that action.' },
    illustration: {
      control: false,
      description:
        'Optional slot — an inline SVG, an image, or an animation the caller drives itself.',
    },
    class: {
      control: 'text',
      description: 'Merged onto the root alongside the component’s own `droppy-ErrorBlock` class.',
    },
  },
} satisfies Meta<typeof ErrorBlock>

export default meta
type Story = StoryObj<typeof meta>

/**
 * An empty category with a way out. Title, body, and action are all set below,
 * so the controls start populated.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { illustration: sushiIllustration },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `title` is the `h2` — say what happened, not just that something did. */
export const Title: Story = {
  tags: ['api-ref'],
  argTypes: hide('illustration', 'class'),
  args: { title: 'We couldn’t reach the kitchen.' },
}

/** `body` carries the explanation and, ideally, what to try next. */
export const Body: Story = {
  tags: ['api-ref'],
  argTypes: hide('illustration', 'class'),
  args: { body: 'The restaurant stopped taking orders while you were browsing.' },
}

/** `buttonText` and `onButtonClick` are the single recovery action. */
export const ButtonText: Story = {
  tags: ['api-ref'],
  argTypes: hide('illustration', 'class'),
  args: { buttonText: 'Back to restaurants', onButtonClick: fn() },
}

/** `illustration` takes any snippet — the Lottie player and its JSON stay app assets. */
export const Illustration: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { illustration: sushiIllustration },
}

/**
 * `className` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('illustration'),
  args: {
    class: 'errorblock-demo-inset',
  },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The illustration slot is optional, and the block reads fine without it — the
 * title, body, and action carry the whole message on their own.
 */
export const WithoutIllustration: Story = {
  tags: ['highlight'],
  argTypes: hide('class'),
  args: { illustration: undefined },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** Title, optional illustration, body, and one action — in that DOM order. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('title', 'body', 'buttonText', 'illustration', 'class'),
  args: { illustration: sushiIllustration },
  parameters: {
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The centred column holding the whole message.' },
        { id: 'title', name: 'Title', description: 'The `h2`, first in the DOM.' },
        {
          id: 'illustration',
          name: 'Illustration',
          description: 'The optional slot; absent, nothing is rendered in its place.',
        },
        { id: 'body', name: 'Body', description: 'The explanation copy.' },
        { id: 'action', name: 'Action', description: 'The single recovery Button.' },
      ],
    } satisfies AnatomyParameters,
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** A category with nothing in it. */
export const MealdropEmptyCategory: Story = {
  tags: ['examples'],
  argTypes: hide('title', 'illustration', 'body', 'buttonText', 'onButtonClick', 'class'),
  render: () => ({ Component: MealdropEmptyCategoryDemo }),
}

/** A restaurant that isn't there. */
export const MealdropNotFound: Story = {
  tags: ['examples'],
  argTypes: hide('title', 'illustration', 'body', 'buttonText', 'onButtonClick', 'class'),
  render: () => ({ Component: MealdropNotFoundDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestTitleIsALevelTwoHeading: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'This is not the food you’re looking for.' })
    ).toBeInTheDocument()
  },
}

export const TestActionFiresItsCallback: Story = {
  tags: ['tests'],
  play: async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'See all restaurants' }))

    await expect(args.onButtonClick).toHaveBeenCalledOnce()
  },
}

export const TestIllustrationIsOptional: Story = {
  tags: ['tests'],
  args: { illustration: undefined },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('.droppy-ErrorBlock-illustration')).toBeNull()
    await expect(canvas.getByRole('button', { name: 'See all restaurants' })).toBeVisible()
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: {
    title: 'Title',
    body: 'Body',
    buttonText: 'Click me',
    onButtonClick: fn(),
  },
}
