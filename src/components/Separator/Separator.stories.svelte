<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Card } from '../Card'
  import { Heading } from '../Heading'

  import Separator, { type SeparatorProps } from './Separator.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof SeparatorProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const SUMMARY_LINES = [
    { name: 'Cheeseburger ×2', amount: '€17.00' },
    { name: 'Fries ×1', amount: '€2.50' },
    { name: 'Coca-Cola ×3', amount: '€5.25' },
  ]

  const { Story } = defineMeta({
    title: 'Layout & structure/Separator',
    component: Separator,
    argTypes: {
      orientation: {
        control: 'radio',
        options: ['horizontal', 'vertical'],
        description: 'Sets `aria-orientation` and `data-orientation` together.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Separator` class.',
      },
    },
  })
</script>

<!--
  A divider between two stacked blocks. `orientation` is set below, so the
  controls start populated — flip it to vertical and the demo lays out
  horizontally to match.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ orientation: 'horizontal' }}
  argTypes={hide('class')}
>
  {#snippet template(args)}
    <div
      style:display="flex"
      style:flex-direction={args.orientation === 'vertical' ? 'row' : 'column'}
      style:align-items={args.orientation === 'vertical' ? 'center' : undefined}
      style:gap="1rem"
      style:height={args.orientation === 'vertical' ? '2rem' : undefined}
    >
      <span>Section one</span>
      <Separator {...args} />
      <span>Section two</span>
    </div>
  {/snippet}
</Story>

<!-- api-ref — one story per prop -->

<!-- `orientation` drives the ARIA attribute and the data attribute together. -->
<Story name="Orientation" tags={['api-ref']} argTypes={hide('orientation', 'class')}>
  {#snippet template(args)}
    <div style="display: grid; gap: 1.5rem">
      <div style="display: flex; flex-direction: column; gap: 1rem">
        <span>Above</span>
        <Separator {...args} orientation="horizontal" />
        <span>Below</span>
      </div>
      <div style="display: flex; align-items: center; gap: 1rem; height: 2rem">
        <span>Left</span>
        <Separator {...args} orientation="vertical" />
        <span>Right</span>
      </div>
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
  argTypes={hide('orientation')}
  args={{ class: 'separator-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- anatomy — the rendered part tree -->

<!-- A single part: one `<div>` with `role="separator"` and no children. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('orientation', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `role="separator"` line, carrying `aria-orientation` and `data-orientation`.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
>
  {#snippet template(args)}
    <div style="display: flex; flex-direction: column; gap: 1rem">
      <span>Above</span>
      <Separator {...args} />
      <span>Below</span>
    </div>
  {/snippet}
</Story>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Dividers in Mealdrop's order summary. -->
<Story
  name="MealdropOrderSummaryDividers"
  tags={['examples']}
  argTypes={hide('orientation', 'style', 'class')}
>
  {#snippet template()}
    <Card padded style="max-width: 24rem">
      <Heading level={3} size={4}>Order summary</Heading>

      <div style="display: grid; gap: 0.75rem; margin-top: 1rem">
        {#each SUMMARY_LINES as line, index (line.name)}
          <div style="display: grid; gap: 0.75rem">
            <div style="display: flex; justify-content: space-between">
              <Body size="S">{line.name}</Body>
              <Body size="S">{line.amount}</Body>
            </div>
            {#if index < SUMMARY_LINES.length - 1}<Separator />{/if}
          </div>
        {/each}
      </div>

      <div style="margin: 1.5rem 0">
        <Separator />
      </div>

      <div style="display: flex; justify-content: space-between">
        <Body fontWeight="bold">Total</Body>
        <Body fontWeight="bold">€24.75</Body>
      </div>
    </Card>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestHorizontalAttributes"
  tags={['tests']}
  play={async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
    await expect(separator).toHaveAttribute('data-orientation', 'horizontal')
  }}
/>

<Story
  name="TestVerticalAttributes"
  tags={['tests']}
  args={{ orientation: 'vertical' }}
  play={async ({ canvas }) => {
    const separator = canvas.getByRole('separator')

    await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
    await expect(separator).toHaveAttribute('data-orientation', 'vertical')
  }}
/>

<Story
  name="TestIsNotFocusable"
  tags={['tests']}
  play={async ({ canvas }) => {
    // Structural, not the interactive "range" variant the ARIA spec also
    // permits — so it carries no tabindex.
    await expect(canvas.getByRole('separator')).not.toHaveAttribute('tabindex')
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.separator-demo-inset) {
    margin: 1rem;
  }
</style>
