<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'

  import MaxWidth from './fixtures/MaxWidth.svelte'
  import MealdropBurgerExtras from './fixtures/MealdropBurgerExtras.svelte'
  import Select, { type SelectProps } from './Select.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof SelectProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Forms & input/Select',
    component: Select,
    args: { label: 'servings', options: [1, 2, 3, 4, 5], value: 2, onChange: fn() },
    argTypes: {
      label: { control: 'text', description: 'Visible label, rendered above the control.' },
      options: {
        control: 'object',
        description: 'Option values. Each is rendered as both the value and the visible text.',
      },
      value: { control: 'text', description: 'The selected value.' },
      onChange: {
        description: 'Receives the selected value, coerced to a number when the option is numeric.',
      },
      disabled: { control: 'boolean', description: 'Native disabled, passed straight through.' },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Select` class.',
      },
    },
    decorators: [() => ({ Component: MaxWidth })],
  })
</script>

<!--
  A short, known list — how many servings. Every prop is set below, so the
  controls start populated; edit the options array to change the list.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ label: 'servings', options: [1, 2, 3, 4, 5], value: 2, disabled: false }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `label` is the visible label, wired to the control with `for`/`id`. -->
<Story
  name="Label"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ label: 'delivery window' }}
/>

<!-- `options` are rendered as both the value and the visible text. -->
<Story
  name="Options"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{
    label: 'delivery window',
    options: ['ASAP', 'In 30 minutes', 'In an hour', 'Tonight'],
    value: 'ASAP',
  }}
/>

<!-- `value` and `onChange` make the control fully controlled. -->
<Story name="Value" tags={['api-ref']} argTypes={hide('class')} args={{ value: 4 }} />

<!-- `disabled` is native, and passed straight through. -->
<Story name="Disabled" tags={['api-ref']} argTypes={hide('class')} args={{ disabled: true }} />

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  name="ClassName"
  tags={['api-ref']}
  args={{ class: 'select-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  Numeric options come back as numbers and text options as strings, so a
  caller never parses the value first — and a non-numeric option is never
  turned into `NaN`, which is what Mealdrop's blanket `Number()` did.
-->
<Story name="ValueCoercion" tags={['highlight']} argTypes={hide('options', 'value', 'class')}>
  {#snippet template(args)}
    <div style="display: grid; gap: 1rem">
      <Select {...args} label="servings" options={[1, 2, 3]} value={2} />
      <Select {...args} label="delivery window" options={['ASAP', 'Tonight']} value="ASAP" />
    </div>
  {/snippet}
</Story>

<!--
  The control is the native `<select>`. On touch devices that opens the
  platform picker, which no scripted listbox matches for accessibility or
  muscle memory — Droppy only restyles it and supplies its own chevron.
-->
<Story name="NativeControl" tags={['highlight']} argTypes={hide('class')} />

<!-- anatomy — the rendered part tree -->

<!-- Label, a wrapper carrying the chevron, and the native control inside it. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('label', 'options', 'value', 'disabled', 'class')}
  parameters={{
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The field: label above, control below.' },
        { id: 'label', name: 'Label', description: 'Tied to the control by `for`/`id`.' },
        {
          id: 'wrapper',
          name: 'Wrapper',
          description: 'Positions the chevron over the control, which draws its own.',
        },
        { id: 'control', name: 'Control', description: 'The native `<select>`.' },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Choosing up to two extras for a customisable burger. -->
<Story
  name="MealdropBurgerExtras"
  tags={['examples']}
  argTypes={hide('label', 'options', 'value', 'onChange', 'disabled', 'class')}
>
  {#snippet template()}
    <MealdropBurgerExtras />
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestReportsNumericValues"
  tags={['tests']}
  play={async ({ args, canvas }) => {
    await userEvent.selectOptions(canvas.getByLabelText('servings'), '4')

    await expect(args.onChange).toHaveBeenCalledWith(4)
  }}
/>

<Story
  name="TestReportsTextValues"
  tags={['tests']}
  args={{
    label: 'delivery window',
    options: ['ASAP', 'In 30 minutes', 'In an hour', 'Tonight'],
    value: 'ASAP',
  }}
  play={async ({ args, canvas }) => {
    await userEvent.selectOptions(canvas.getByLabelText('delivery window'), 'Tonight')

    // Never NaN: a non-numeric option comes back as its own string.
    await expect(args.onChange).toHaveBeenCalledWith('Tonight')
  }}
/>

<Story
  name="TestLabelNamesTheControl"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByLabelText('servings').tagName).toBe('SELECT')
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.select-demo-inset) {
    margin: 1rem;
  }
</style>
