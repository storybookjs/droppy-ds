<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { createRawSnippet } from 'svelte'
  import { expect, fn, userEvent } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import errorAnimation from './animations/Error.json'
  import notFoundAnimation from './animations/NotFound.json'
  import ErrorBlock, { type ErrorBlockProps } from './ErrorBlock.svelte'
  import AnimatedIllustration from './fixtures/AnimatedIllustration.svelte'

  /** A plate of sushi, as an inline SVG illustration. */
  const SUSHI_ILLUSTRATION = createRawSnippet(() => ({
    render: () =>
      `<svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="56" fill="var(--ds-color-surface-sunken)" /><circle cx="60" cy="60" r="34" fill="var(--ds-palette-neutral-0)" /><circle cx="60" cy="60" r="14" fill="var(--ds-palette-brand-200)" /></svg>`,
  }))

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ErrorBlockProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
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
        description:
          'Merged onto the root alongside the component’s own `droppy-ErrorBlock` class.',
      },
    },
  })
</script>

<!--
  An empty category with a way out. Title, body, and action are all set below,
  so the controls start populated.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ illustration: SUSHI_ILLUSTRATION }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `title` is the `h2` — say what happened, not just that something did. -->
<Story
  name="Title"
  tags={['api-ref']}
  argTypes={hide('illustration', 'class')}
  args={{ title: 'We couldn’t reach the kitchen.' }}
/>

<!-- `body` carries the explanation and, ideally, what to try next. -->
<Story
  name="Body"
  tags={['api-ref']}
  argTypes={hide('illustration', 'class')}
  args={{ body: 'The restaurant stopped taking orders while you were browsing.' }}
/>

<!-- `buttonText` and `onButtonClick` are the single recovery action. -->
<Story
  exportName="ButtonText"
  name="Button Text"
  tags={['api-ref']}
  argTypes={hide('illustration', 'class')}
  args={{ buttonText: 'Back to restaurants', onButtonClick: fn() }}
/>

<!-- `illustration` takes any snippet — the Lottie player and its JSON stay app assets. -->
<Story
  name="Illustration"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ illustration: SUSHI_ILLUSTRATION }}
/>

<!--
  `className` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('illustration')}
  args={{ class: 'errorblock-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  The illustration slot is optional, and the block reads fine without it — the
  title, body, and action carry the whole message on their own.
-->
<Story
  exportName="WithoutIllustration"
  name="Without Illustration"
  tags={['highlight']}
  argTypes={hide('class')}
  args={{ illustration: undefined }}
/>

<!-- anatomy — the rendered part tree -->

<!-- Title, optional illustration, body, and one action — in that DOM order. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('title', 'body', 'buttonText', 'illustration', 'class')}
  args={{ illustration: SUSHI_ILLUSTRATION }}
  parameters={{
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
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- A category with nothing in it. -->
<Story
  exportName="MealdropEmptyCategory"
  name="Mealdrop Empty Category"
  tags={['examples']}
  argTypes={hide('title', 'illustration', 'body', 'buttonText', 'onButtonClick', 'class')}
>
  {#snippet template()}
    <ErrorBlock
      title="This is not the food you're looking for."
      body="No restaurants are serving sushi near you right now. Try another category."
      buttonText="Browse categories"
      onButtonClick={() => {}}
    >
      {#snippet illustration()}<AnimatedIllustration animation={errorAnimation} />{/snippet}
    </ErrorBlock>
  {/snippet}
</Story>

<!-- A restaurant that isn't there. -->
<Story
  exportName="MealdropNotFound"
  name="Mealdrop Not Found"
  tags={['examples']}
  argTypes={hide('title', 'illustration', 'body', 'buttonText', 'onButtonClick', 'class')}
>
  {#snippet template()}
    <ErrorBlock
      title="We couldn't find that restaurant."
      body="It may have closed, or the link may be out of date."
      buttonText="Back to home"
      onButtonClick={() => {}}
    >
      {#snippet illustration()}<AnimatedIllustration animation={notFoundAnimation} />{/snippet}
    </ErrorBlock>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestTitleIsALevelTwoHeading"
  name="Test Title Is A Level Two Heading"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'This is not the food you’re looking for.' })
    ).toBeInTheDocument()
  }}
/>

<Story
  exportName="TestActionFiresItsCallback"
  name="Test Action Fires Its Callback"
  tags={['tests']}
  play={async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'See all restaurants' }))

    await expect(args.onButtonClick).toHaveBeenCalledOnce()
  }}
/>

<Story
  exportName="TestIllustrationIsOptional"
  name="Test Illustration Is Optional"
  tags={['tests']}
  args={{ illustration: undefined }}
  play={async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelector('.droppy-ErrorBlock-illustration')).toBeNull()
    await expect(canvas.getByRole('button', { name: 'See all restaurants' })).toBeVisible()
  }}
/>

<Story
  name="Empty"
  tags={['empty']}
  args={{
    title: 'Title',
    body: 'Body',
    buttonText: 'Click me',
    onButtonClick: fn(),
  }}
/>

<style>
  :global(.errorblock-demo-inset) {
    margin: 1rem;
  }
</style>
