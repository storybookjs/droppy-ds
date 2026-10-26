import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, userEvent } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import ClassNameDemo from './fixtures/ClassName.svelte'
import ErrorDoesNotShiftLayoutDemo from './fixtures/ErrorDoesNotShiftLayout.svelte'
import MaxWidth from './fixtures/MaxWidth.svelte'
import MealdropCheckoutFormDemo from './fixtures/MealdropCheckoutForm.svelte'
import TypesDemo from './fixtures/Types.svelte'
import Input, { type InputProps } from './Input.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof InputProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
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
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A labelled text field. Label, type and placeholder are set below, so the
 * controls start populated — type an error message in to see the slot fill
 * without the layout moving.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'Full name', type: 'text', placeholder: 'Ada Lovelace', disabled: false },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` is both the visible label and the control's accessible name. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('error', 'class'),
  args: { label: 'Delivery address' },
}

/** `error` fills the reserved slot beneath the control. */
export const Error: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { error: 'Enter your full name' },
}

/** `type` and the other native input props pass straight through. */
export const Types: Story = {
  tags: ['api-ref'],
  argTypes: hide('type', 'error', 'class'),
  render: (args) => ({ Component: TypesDemo, props: args }),
}

/** `disabled` is the native attribute; the field dims the label with it. */
export const Disabled: Story = {
  tags: ['api-ref'],
  argTypes: hide('error', 'class'),
  args: { disabled: true, placeholder: 'Ada Lovelace' },
}

/** `placeholder` is native too — a hint, never a substitute for the label. */
export const Placeholder: Story = {
  tags: ['api-ref'],
  argTypes: hide('error', 'class'),
  args: { placeholder: 'Ada Lovelace' },
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  argTypes: hide('error'),
  args: { class: 'input-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The error slot keeps its height whether or not a message is showing, so
 * validating one field never shifts the ones below it.
 */
export const ErrorDoesNotShiftLayout: Story = {
  tags: ['highlight'],
  argTypes: hide('error', 'class'),
  render: (args) => ({ Component: ErrorDoesNotShiftLayoutDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** Field root, label, control, and the always-mounted error slot. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'error', 'class'),
  args: { error: 'Enter your full name' },
  parameters: {
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
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Mealdrop's checkout form, with two fields in error. */
export const MealdropCheckoutForm: Story = {
  tags: ['examples'],
  argTypes: hide('label', 'error'),
  render: () => ({ Component: MealdropCheckoutFormDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestLabelNamesTheControl: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Full name')

    await userEvent.type(field, 'Ada Lovelace')

    await expect(field).toHaveValue('Ada Lovelace')
  },
}

export const TestErrorSlotIsAlwaysMounted: Story = {
  tags: ['tests'],
  play: async ({ canvasElement }) => {
    // No error passed, yet the slot exists — that reservation is what keeps
    // the layout from jumping when validation kicks in.
    await expect(canvasElement.querySelector('.droppy-Field-error')).toBeInTheDocument()
  },
}

export const TestErrorIsAnnounced: Story = {
  tags: ['tests'],
  args: { error: 'Enter your full name' },
  play: async ({ canvas }) => {
    const field = canvas.getByLabelText('Full name')
    const describedBy = field.getAttribute('aria-describedby')

    await expect(describedBy).toBeTruthy()
    await expect(canvas.getByText('Enter your full name')).toHaveAttribute(
      'id',
      describedBy as string
    )
  },
}

export const Empty: Story = { tags: ['empty'] }
