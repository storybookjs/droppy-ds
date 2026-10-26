<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, userEvent } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Heading } from '../Heading'

  import MaxWidth from './fixtures/MaxWidth.svelte'
  import Input, { type InputProps } from './Input.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof InputProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Forms & input/Input',
    component: Input,
    args: { label: 'Full name' },
    argTypes: {
      label: {
        control: 'text',
        description: 'Visible label. Also becomes the input’s accessible name.',
      },
      error: {
        control: 'text',
        description: 'Validation message. The slot is reserved whether or not one is showing.',
      },
      type: { control: 'text', description: 'Native input type, passed straight through.' },
      disabled: { control: 'boolean', description: 'Native disabled, passed straight through.' },
      placeholder: { control: 'text', description: 'Native placeholder, passed straight through.' },
      class: {
        control: 'text',
        description: 'Merged onto the control alongside the component’s own `droppy-Input` class.',
      },
    },
    decorators: [() => ({ Component: MaxWidth })],
  })
</script>

<!--
  A labelled text field. Label, type and placeholder are set below, so the
  controls start populated — type an error message in to see the slot fill
  without the layout moving.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ label: 'Full name', type: 'text', placeholder: 'Ada Lovelace', disabled: false }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `label` is both the visible label and the control's accessible name. -->
<Story
  name="Label"
  tags={['api-ref']}
  argTypes={hide('error', 'class')}
  args={{ label: 'Delivery address' }}
/>

<!-- `error` fills the reserved slot beneath the control. -->
<Story
  name="Error"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ error: 'Enter your full name' }}
/>

<!-- `type` and the other native input props pass straight through. -->
<Story name="Types" tags={['api-ref']} argTypes={hide('type', 'error', 'class')}>
  {#snippet template(args)}
    <Input {...args} label="Email" type="email" />
    <Input {...args} label="Phone" type="tel" />
    <Input {...args} label="Postcode" />
  {/snippet}
</Story>

<!-- `disabled` is the native attribute; the field dims the label with it. -->
<Story
  name="Disabled"
  tags={['api-ref']}
  argTypes={hide('error', 'class')}
  args={{ disabled: true, placeholder: 'Ada Lovelace' }}
/>

<!-- `placeholder` is native too — a hint, never a substitute for the label. -->
<Story
  name="Placeholder"
  tags={['api-ref']}
  argTypes={hide('error', 'class')}
  args={{ placeholder: 'Ada Lovelace' }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('error')}
  args={{ class: 'input-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  The error slot keeps its height whether or not a message is showing, so
  validating one field never shifts the ones below it.
-->
<Story
  exportName="ErrorDoesNotShiftLayout"
  name="Error Does Not Shift Layout"
  tags={['highlight']}
  argTypes={hide('error', 'class')}
>
  {#snippet template(args)}
    <Input {...args} label="Street" error="Enter a street" />
    <Input {...args} label="City" />
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- Field root, label, control, and the always-mounted error slot. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('label', 'error', 'class')}
  args={{ error: 'Enter your full name' }}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The field root, which wires label, control, and error together.',
        },
        { id: 'label', name: 'Label', description: 'The `<label>`; absent when `label` is empty.' },
        { id: 'control', name: 'Control', description: 'The `<input>` itself.' },
        {
          id: 'error',
          name: 'Error',
          description: 'Always mounted — it holds a non-breaking space when there is no message.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Mealdrop's checkout form, with two fields in error. -->
<Story
  exportName="MealdropCheckoutForm"
  name="Mealdrop Checkout Form"
  tags={['examples']}
  argTypes={hide('label', 'error')}
>
  {#snippet template()}
    <form style="display: grid; gap: 1.5rem; max-width: 30rem">
      <section style="display: grid; gap: 0.5rem">
        <Heading level={3} size={4}>Contact details</Heading>
        <Input label="Name" value="Ada Lovelace" />
        <Input label="Email" value="ada@example" error="Enter a valid email address." />
        <Input label="Phone" value="06 12345678" />
      </section>

      <section style="display: grid; gap: 0.5rem">
        <Heading level={3} size={4}>Delivery details</Heading>
        <Input label="Address" value="Staalstraat 12" />
        <Input label="Postcode" value="1011" error="A Dutch postcode looks like 1011 JL." />
        <Input label="City" value="Amsterdam" />
      </section>
    </form>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestLabelNamesTheControl"
  name="Test Label Names The Control"
  tags={['tests']}
  play={async ({ canvas }) => {
    const field = canvas.getByLabelText('Full name')

    await userEvent.type(field, 'Ada Lovelace')

    await expect(field).toHaveValue('Ada Lovelace')
  }}
/>

<Story
  exportName="TestErrorSlotIsAlwaysMounted"
  name="Test Error Slot Is Always Mounted"
  tags={['tests']}
  play={async ({ canvasElement }) => {
    // No error passed, yet the slot exists — that reservation is what keeps
    // the layout from jumping when validation kicks in.
    await expect(canvasElement.querySelector('.droppy-Field-error')).toBeInTheDocument()
  }}
/>

<Story
  exportName="TestErrorIsAnnounced"
  name="Test Error Is Announced"
  tags={['tests']}
  args={{ error: 'Enter your full name' }}
  play={async ({ canvas }) => {
    const field = canvas.getByLabelText('Full name')
    const describedBy = field.getAttribute('aria-describedby')

    await expect(describedBy).toBeTruthy()
    await expect(canvas.getByText('Enter your full name')).toHaveAttribute(
      'id',
      describedBy as string
    )
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.input-demo-inset) {
    margin: 1rem;
  }
</style>
