<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import MealdropCheckoutSteps from './fixtures/MealdropCheckoutSteps.svelte'
  import ProgressBar, { type ProgressBarProps } from './ProgressBar.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ProgressBarProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const VALUES = [0, 1, 2, 3]

  const { Story } = defineMeta({
    title: 'Feedback & status/ProgressBar',
    component: ProgressBar,
    args: { value: 1, max: 3, label: 'Checkout progress' },
    argTypes: {
      value: {
        control: { type: 'range', min: 0, max: 5, step: 1 },
        description: 'How far along the track the fill sits. Clamped to 0–`max` before the DOM.',
      },
      max: { control: 'number', description: 'Upper bound `value` is measured against.' },
      label: {
        control: 'text',
        description: 'Accessible name. The visible copy around the bar is the caller’s own markup.',
      },
      class: {
        control: 'text',
        description:
          'Merged onto the root alongside the component’s own `droppy-ProgressBar` class.',
      },
    },
    render: sized,
  })
</script>

<!-- The default render: the bar inside a 16rem-wide parent. -->
{#snippet sized(args: ProgressBarProps)}
  <div style="width: 16rem">
    <ProgressBar {...args} />
  </div>
{/snippet}

<!--
  Step two of a three-step checkout. Drag `value` past `max` in the controls —
  the fill clamps rather than overflowing.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ value: 1, max: 3, label: 'Checkout progress' }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `value` positions the fill, from empty through to full. -->
<Story name="Value" tags={['api-ref']} argTypes={hide('value', 'class')}>
  {#snippet template(args)}
    <div style="display: grid; gap: 0.75rem; width: 16rem">
      {#each VALUES as value (value)}
        <ProgressBar {...args} {value} />
      {/each}
    </div>
  {/snippet}
</Story>

<!-- `max` is the upper bound — step counts, not just percentages. -->
<Story
  name="Max"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ value: 30, max: 40, label: 'Upload progress' }}
/>

<!-- `label` is the accessible name; nothing visible is rendered from it. -->
<Story
  name="Label"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ label: 'Order preparation' }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  args={{ class: 'progressbar-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  A value past `max` clamps rather than overflowing the track, so a caller
  that counts one step too far still renders a full bar instead of a broken
  one — and `aria-valuenow` reports the clamped number, not the raw one.
-->
<Story
  exportName="OverMaxClamps"
  name="Over Max Clamps"
  tags={['highlight']}
  argTypes={hide('class')}
  args={{ value: 9, max: 3 }}
/>

<!-- anatomy — the rendered part tree -->

<!-- The track carries the ARIA; the fill is a decorative sibling underneath it. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('value', 'max', 'label', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The track: `role="progressbar"` with `aria-valuenow`/`-min`/`-max` and the name.',
        },
        {
          id: 'fill',
          name: 'Fill',
          description: 'The width-driven bar. Purely visual — it carries no ARIA of its own.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Mealdrop's checkout step indicator. -->
<Story
  exportName="MealdropCheckoutSteps"
  name="Mealdrop Checkout Steps"
  tags={['examples']}
  argTypes={hide('value', 'max', 'label', 'class')}
>
  {#snippet template()}
    <MealdropCheckoutSteps />
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestReportsItsRange"
  name="Test Reports Its Range"
  tags={['tests']}
  play={async ({ canvas }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })

    await expect(bar).toHaveAttribute('aria-valuenow', '1')
    await expect(bar).toHaveAttribute('aria-valuemin', '0')
    await expect(bar).toHaveAttribute('aria-valuemax', '3')
  }}
/>

<Story
  exportName="TestClampsOverMax"
  name="Test Clamps Over Max"
  tags={['tests']}
  args={{ value: 9 }}
  play={async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })
    const fill = canvasElement.querySelector('.droppy-ProgressBar-fill') as HTMLElement

    await expect(bar).toHaveAttribute('aria-valuenow', '3')
    await expect(fill.style.width).toBe('100%')
  }}
/>

<Story
  exportName="TestClampsBelowZero"
  name="Test Clamps Below Zero"
  tags={['tests']}
  args={{ value: -4 }}
  play={async ({ canvas, canvasElement }) => {
    const bar = canvas.getByRole('progressbar', { name: 'Checkout progress' })
    const fill = canvasElement.querySelector('.droppy-ProgressBar-fill') as HTMLElement

    await expect(bar).toHaveAttribute('aria-valuenow', '0')
    await expect(fill.style.width).toBe('0%')
  }}
/>

<Story
  exportName="TestFillIsNotAnnounced"
  name="Test Fill Is Not Announced"
  tags={['tests']}
  play={async ({ canvas, canvasElement }) => {
    // Exactly one progressbar in the tree: the fill is a plain div.
    await expect(canvas.getAllByRole('progressbar')).toHaveLength(1)
    await expect(canvasElement.querySelector('.droppy-ProgressBar-fill')).not.toHaveAttribute(
      'role'
    )
  }}
/>

<Story name="Empty" tags={['empty']} args={{ value: 1 }} />

<style>
  :global(.progressbar-demo-inset) {
    margin: 1rem;
  }
</style>
