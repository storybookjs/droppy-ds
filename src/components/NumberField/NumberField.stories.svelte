<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import DropBoardPriceEditor from './fixtures/DropBoardPriceEditor.svelte'
  import NumberField, { type NumberFieldProps } from './NumberField.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof NumberFieldProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Forms & input/NumberField',
    component: NumberField,
    args: { label: 'Quantity', defaultValue: 1, onValueChange: fn() },
    argTypes: {
      label: {
        control: 'text',
        description: 'Visible label. Also the accessible name, and the scrub handle.',
      },
      defaultValue: { control: 'number', description: 'Starting value, uncontrolled.' },
      value: {
        control: false,
        description: 'The value, for a controlled field. Pair with `onValueChange`.',
      },
      onValueChange: {
        description: 'Receives the parsed number, or `null` when the field is empty.',
      },
      min: { control: 'number', description: 'Lower bound. The decrement disables here.' },
      max: { control: 'number', description: 'Upper bound. The increment disables here.' },
      step: { control: 'number', description: 'How much each increment moves the value.' },
      disabled: { control: 'boolean', description: 'Disables the input and both buttons.' },
      format: {
        control: false,
        description: '`Intl.NumberFormat` options — currency, percent, decimals.',
      },
      class: {
        control: 'text',
        description:
          'Merged onto the root alongside the component’s own `droppy-NumberField` class.',
      },
    },
  })
</script>

<!--
  A typeable quantity with stepper buttons. Bounds and step are set below, so
  the controls start populated — the buttons disable at the bounds rather than
  wrapping.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ label: 'Quantity', defaultValue: 1, min: 0, max: 10, step: 1, disabled: false }}
  argTypes={hide('value', 'format', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `label` names the field and doubles as the scrub handle. -->
<Story
  name="Label"
  tags={['api-ref']}
  argTypes={hide('value', 'format', 'class')}
  args={{ label: 'Servings' }}
/>

<!-- `defaultValue` seeds the field without making it controlled. -->
<Story
  exportName="DefaultValue"
  name="Default Value"
  tags={['api-ref']}
  argTypes={hide('value', 'format', 'class')}
  args={{ defaultValue: 5 }}
/>

<!-- `min` and `max` bound the range; the buttons disable at each end. -->
<Story
  exportName="MinAndMax"
  name="Min And Max"
  tags={['api-ref']}
  argTypes={hide('value', 'format', 'class')}
  args={{ defaultValue: 9, min: 0, max: 10 }}
/>

<!-- `step` sets how far each increment moves. -->
<Story
  name="Step"
  tags={['api-ref']}
  argTypes={hide('value', 'format', 'class')}
  args={{ defaultValue: 1, step: 0.5 }}
/>

<!-- `format` takes `Intl.NumberFormat` options — currency, percent, decimals. -->
<Story
  name="Format"
  tags={['api-ref']}
  argTypes={hide('value', 'class')}
  args={{
    label: 'Price',
    defaultValue: 8.5,
    step: 0.25,
    format: { style: 'currency', currency: 'EUR' },
  }}
/>

<!-- `disabled` dims the input and both buttons together. -->
<Story
  name="Disabled"
  tags={['api-ref']}
  argTypes={hide('value', 'format', 'class')}
  args={{ defaultValue: 3, disabled: true }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('value', 'format')}
  args={{ class: 'numberfield-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  Three ways in, not one: type a value, press the buttons, or drag the label
  itself — the scrub area sits behind the label text. That third route is what
  separates this from `QuantityStepper`, which only does tap-tap increments.
-->
<Story
  exportName="ThreeWaysToChangeTheValue"
  name="Three Ways To Change The Value"
  tags={['highlight']}
  argTypes={hide('value', 'format', 'class')}
  args={{ defaultValue: 100 }}
/>

<!-- anatomy — the rendered part tree -->

<!-- A field wrapper, the scrub area holding the label, and the button group. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('label', 'defaultValue', 'value', 'min', 'max', 'step', 'format', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'field',
          name: 'Field',
          description: 'The field wrapper, which associates the label with the input.',
        },
        {
          id: 'root',
          name: 'Root',
          description: 'Owns the value, the bounds, and the formatting.',
        },
        {
          id: 'scrub',
          name: 'Scrub area',
          description: 'Wraps the label; dragging it steps the value.',
        },
        { id: 'label', name: 'Label', description: 'The visible label and accessible name.' },
        { id: 'group', name: 'Group', description: 'Holds the two buttons and the input.' },
        { id: 'decrement', name: 'Decrement', description: 'The minus; disabled at `min`.' },
        { id: 'input', name: 'Input', description: 'The typeable control.' },
        { id: 'increment', name: 'Increment', description: 'The plus; disabled at `max`.' },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- DropBoard's menu-item price and prep-time fields. -->
<Story exportName="DropBoardPriceEditor" name="Drop Board Price Editor" tags={['examples']}>
  {#snippet template()}
    <DropBoardPriceEditor />
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestTypingReportsAParsedNumber"
  name="Test Typing Reports A Parsed Number"
  tags={['tests']}
  args={{ defaultValue: undefined }}
  play={async ({ args, canvas }) => {
    const input = canvas.getByRole('spinbutton')

    await userEvent.clear(input)
    await userEvent.type(input, '42')

    await waitFor(() => expect(input).toHaveValue('42'))
    await expect(args.onValueChange).toHaveBeenLastCalledWith(42, expect.anything())
  }}
/>

<Story
  exportName="TestIncrementAndDecrement"
  name="Test Increment And Decrement"
  tags={['tests']}
  args={{ defaultValue: 5 }}
  play={async ({ canvas }) => {
    const input = canvas.getByRole('spinbutton')

    await userEvent.click(canvas.getByRole('button', { name: 'Increase' }))
    await waitFor(() => expect(input).toHaveValue('6'))

    await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }))
    await userEvent.click(canvas.getByRole('button', { name: 'Decrease' }))
    await waitFor(() => expect(input).toHaveValue('4'))
  }}
/>

<Story
  exportName="TestButtonsDisableAtBounds"
  name="Test Buttons Disable At Bounds"
  tags={['tests']}
  args={{ defaultValue: 9, min: 0, max: 10 }}
  play={async ({ canvas }) => {
    const increment = canvas.getByRole('button', { name: 'Increase' })
    const decrement = canvas.getByRole('button', { name: 'Decrease' })

    await userEvent.click(increment)
    await waitFor(() => expect(increment).toHaveAttribute('aria-disabled', 'true'))
    await expect(decrement).toHaveAttribute('aria-disabled', 'false')
  }}
/>

<Story
  exportName="TestDisabledBlocksEverything"
  name="Test Disabled Blocks Everything"
  tags={['tests']}
  args={{ defaultValue: 3, disabled: true }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('spinbutton')).toBeDisabled()
    await expect(canvas.getByRole('button', { name: 'Increase' })).toHaveAttribute('data-disabled')
  }}
/>

<Story
  exportName="TestScrubbingTheLabel"
  name="Test Scrubbing The Label"
  tags={['tests']}
  args={{ defaultValue: 100 }}
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('spinbutton')
    await expect(input).toHaveValue('100')

    const scrubArea = canvasElement.querySelector('[role="presentation"]') as HTMLElement
    const box = scrubArea.getBoundingClientRect()
    const start = { clientX: box.left + box.width / 2, clientY: box.top + box.height / 2 }

    scrubArea.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, ...start }))
    scrubArea.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: start.clientX + 10,
        clientY: start.clientY,
        movementX: 10,
        movementY: 0,
      })
    )
    await waitFor(() => expect(input).toHaveValue('110'))

    scrubArea.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.numberfield-demo-inset) {
    margin: 1rem;
  }
</style>
