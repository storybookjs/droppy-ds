<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import MealdropCartLine from './fixtures/MealdropCartLine.svelte'
  import StepperDemo from './fixtures/StepperDemo.svelte'
  import QuantityStepper, { type QuantityStepperProps } from './QuantityStepper.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof QuantityStepperProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Forms & input/QuantityStepper',
    component: QuantityStepper,
    args: { value: 1, onChange: fn() },
    argTypes: {
      value: { control: 'number', description: 'Current quantity.' },
      onChange: { description: 'Receives the new quantity on each click.' },
      min: { control: 'number', description: 'Lower bound. Minus disables here. Defaults to 1.' },
      max: { control: 'number', description: 'Upper bound. Plus disables here. Defaults to 10.' },
      'aria-label': {
        control: 'text',
        description: 'Accessible name for the control group. Defaults to “quantity”.',
      },
      class: {
        control: 'text',
        description:
          'Merged onto the root alongside the component’s own `droppy-QuantityStepper` class.',
      },
    },
    render: stepper,
  })
</script>

<!-- Holds the value in state, so the controlled stepper responds to clicks in stories. -->
{#snippet stepper(args: QuantityStepperProps)}
  <StepperDemo {...args} />
{/snippet}

<!--
  A cart line's quantity. Bounds are set below, so the controls start
  populated — click up to `max` and the plus disables rather than wrapping.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ value: 1, min: 1, max: 10, 'aria-label': 'quantity' }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `value` is the current quantity — the component is fully controlled. -->
<Story name="Value" tags={['api-ref']} argTypes={hide('class')} args={{ value: 4 }} />

<!-- `min` is the lower bound; the minus button disables on it. -->
<Story name="Min" tags={['api-ref']} argTypes={hide('class')} args={{ value: 2, min: 2 }} />

<!-- `max` is the upper bound; the plus button disables on it. -->
<Story name="Max" tags={['api-ref']} argTypes={hide('class')} args={{ value: 3, max: 3 }} />

<!-- `aria-label` names the group, since the two buttons alone don't say what of. -->
<Story
  name="aria-label"
  exportName="AriaLabel"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ 'aria-label': 'Cheeseburger quantity' }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  args={{ class: 'quantitystepper-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  The buttons disable at the bounds rather than wrapping or clamping silently,
  so a click never looks like it did nothing. The value carries `aria-live`,
  because a disabled button and a changed number are the only signals the
  group gives.
-->
<Story
  exportName="BoundsDisableRatherThanClamp"
  name="Bounds Disable Rather Than Clamp"
  tags={['highlight']}
  argTypes={hide('class')}
  args={{ value: 1, min: 1, max: 2 }}
/>

<!-- anatomy — the rendered part tree -->

<!-- The group, its two round buttons, and the live value between them. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('value', 'min', 'max', 'aria-label', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `role="group"` wrapper carrying the accessible name.',
        },
        { id: 'decrement', name: 'Decrement', description: 'The minus button; disabled at `min`.' },
        {
          id: 'value',
          name: 'Value',
          description: 'The current quantity, `aria-live="polite"` so changes are announced.',
        },
        { id: 'increment', name: 'Increment', description: 'The plus button; disabled at `max`.' },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Cart lines with per-dish quantity steppers. -->
<Story
  exportName="MealdropCartLine"
  name="Mealdrop Cart Line"
  tags={['examples']}
  argTypes={hide('value', 'onChange', 'min', 'max', 'aria-label', 'class')}
>
  {#snippet template()}
    <MealdropCartLine />
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestDisablesAtMin"
  name="Test Disables At Min"
  tags={['tests']}
  args={{ value: 1 }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'decrease quantity by one' })).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'increase quantity by one' })
    ).not.toBeDisabled()
  }}
/>

<Story
  exportName="TestDisablesAtMax"
  name="Test Disables At Max"
  tags={['tests']}
  args={{ value: 10 }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'increase quantity by one' })).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'decrease quantity by one' })
    ).not.toBeDisabled()
  }}
/>

<Story
  exportName="TestReportsEachChange"
  name="Test Reports Each Change"
  tags={['tests']}
  args={{ value: 1, max: 2 }}
  play={async ({ args, canvas }) => {
    const increase = canvas.getByRole('button', { name: 'increase quantity by one' })
    const decrease = canvas.getByRole('button', { name: 'decrease quantity by one' })

    await userEvent.click(increase)
    await expect(args.onChange).toHaveBeenCalledWith(2)
    await expect(increase).toBeDisabled()

    await userEvent.click(decrease)
    await expect(args.onChange).toHaveBeenCalledWith(1)
    await expect(decrease).toBeDisabled()
  }}
/>

<Story
  exportName="TestGroupIsNamed"
  name="Test Group Is Named"
  tags={['tests']}
  args={{ 'aria-label': 'Cheeseburger quantity' }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Cheeseburger quantity' })).toBeInTheDocument()
  }}
/>

<Story name="Empty" tags={['empty']} args={{ value: 1, onChange: fn() }} />

<style>
  :global(.quantitystepper-demo-inset) {
    margin: 1rem;
  }
</style>
