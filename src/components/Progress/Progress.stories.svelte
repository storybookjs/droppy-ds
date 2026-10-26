<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Card } from '../Card'
  import { Heading } from '../Heading'

  import Progress, { type ProgressProps } from './Progress.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ProgressProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const VALUES = [0, 40, 100]

  const { Story } = defineMeta({
    title: 'Feedback & status/Progress',
    component: Progress,
    args: { value: 40, label: 'Uploading files', showValue: true },
    argTypes: {
      value: {
        control: { type: 'range', min: 0, max: 100, step: 1 },
        description: 'Current value. `null` or omitted renders an indeterminate bar.',
      },
      max: { control: 'number', description: 'Upper bound `value` is measured against.' },
      label: { control: 'text', description: 'Accessible name, rendered above the track.' },
      showValue: {
        control: 'boolean',
        description: 'Renders the formatted value — a percentage by default — beside the label.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Progress` class.',
      },
    },
  })
</script>

<!--
  A determinate upload. Every prop is set below, so the controls start
  populated — drag `value`, or clear it entirely to reach indeterminate mode.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ value: 40, max: 100, label: 'Uploading files', showValue: true }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `value` positions the indicator; `null` switches to indeterminate. -->
<Story name="Value" tags={['api-ref']} argTypes={hide('value', 'class')}>
  {#snippet template(args)}
    <div style="display: grid; gap: 1rem">
      {#each VALUES as value (value)}
        <Progress {...args} {value} />
      {/each}
      <Progress {...args} value={null} showValue={false} />
    </div>
  {/snippet}
</Story>

<!-- `max` rescales the range — the reported percentage follows it. -->
<Story name="Max" tags={['api-ref']} argTypes={hide('class')} args={{ value: 30, max: 40 }} />

<!-- `label` is the accessible name and the visible caption above the track. -->
<Story
  name="Label"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ label: 'Preparing your order' }}
/>

<!-- `showValue` renders the formatted value beside the label. -->
<Story name="ShowValue" tags={['api-ref']} argTypes={hide('class')}>
  {#snippet template(args)}
    <div style="display: grid; gap: 1rem">
      <Progress {...args} showValue />
      <Progress {...args} showValue={false} />
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
  args={{ class: 'progress-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  `value={null}` is indeterminate: `aria-valuenow` is dropped entirely rather
  than reported as zero, and `[data-indeterminate]` drives the animation. This
  is the case `ProgressBar` has no way to express.
-->
<Story
  name="Indeterminate"
  tags={['highlight']}
  argTypes={hide('class')}
  args={{ value: null, showValue: false }}
/>

<!-- At the top of the range the root gains `[data-complete]`, for a finished state. -->
<Story name="Complete" tags={['highlight']} argTypes={hide('class')} args={{ value: 100 }} />

<!-- anatomy — the rendered part tree -->

<!-- Root, the optional label and value, and the track holding the indicator. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('value', 'max', 'label', 'showValue', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the range and the `[data-indeterminate]` / `[data-complete]` states.',
        },
        { id: 'label', name: 'Label', description: 'The caption; also the accessible name.' },
        {
          id: 'value',
          name: 'Value',
          description: 'The formatted value, when `showValue` is set.',
        },
        { id: 'track', name: 'Track', description: 'The groove the indicator moves inside.' },
        { id: 'indicator', name: 'Indicator', description: 'The fill, sized from the value.' },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- DropBoard's menu-photo uploader, determinate then indeterminate. -->
<Story
  name="DropBoardPhotoUpload"
  tags={['examples']}
  argTypes={hide('value', 'max', 'label', 'showValue', 'class')}
>
  {#snippet template()}
    <Card padded style="max-width: 28rem">
      <Heading level={3} size={4}>Menu photos</Heading>

      <div style="display: grid; gap: 2rem; margin-top: 1.5rem">
        <div style="display: grid; gap: 0.5rem">
          <Progress value={37} label="Uploading 3 of 8 photos" showValue />
          <Body size="XXS">Bytes in flight — the browser knows the total.</Body>
        </div>

        <div style="display: grid; gap: 0.5rem">
          <Progress value={null} label="Processing images" />
          <Body size="XXS">The server owns this step, and will not say how long it has left.</Body>
        </div>
      </div>
    </Card>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestReportsItsRange"
  tags={['tests']}
  play={async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: 'Uploading files' })

    await expect(progressbar).toHaveAttribute('aria-valuenow', '40')
    await expect(progressbar).toHaveAttribute('aria-valuemin', '0')
    await expect(progressbar).toHaveAttribute('aria-valuemax', '100')
    await expect(canvas.getByText('40%')).toBeVisible()
  }}
/>

<Story
  name="TestIndeterminateDropsValueNow"
  tags={['tests']}
  args={{ value: null, showValue: false }}
  play={async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: 'Uploading files' })

    await expect(progressbar).not.toHaveAttribute('aria-valuenow')
    await expect(progressbar).toHaveAttribute('data-indeterminate')
  }}
/>

<Story
  name="TestCompleteState"
  tags={['tests']}
  args={{ value: 100 }}
  play={async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: 'Uploading files' })

    await expect(progressbar).toHaveAttribute('aria-valuenow', '100')
    await expect(progressbar).toHaveAttribute('data-complete')
  }}
/>

<Story
  name="TestCustomMaxRescalesPercentage"
  tags={['tests']}
  args={{ value: 30, max: 40 }}
  play={async ({ canvas }) => {
    const progressbar = canvas.getByRole('progressbar', { name: 'Uploading files' })

    await expect(progressbar).toHaveAttribute('aria-valuemax', '40')
    await expect(canvas.getByText('75%')).toBeVisible()
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.progress-demo-inset) {
    margin: 1rem;
  }
</style>
