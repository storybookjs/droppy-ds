import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, fn, userEvent } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import ClassNameDemo from './fixtures/ClassName.svelte'
import MaxWidth from './fixtures/MaxWidth.svelte'
import MealdropBurgerExtrasDemo from './fixtures/MealdropBurgerExtras.svelte'
import ValueCoercionDemo from './fixtures/ValueCoercion.svelte'
import Select, { type SelectProps } from './Select.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof SelectProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
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
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A short, known list — how many servings. Every prop is set below, so the
 * controls start populated; edit the options array to change the list.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { label: 'servings', options: [1, 2, 3, 4, 5], value: 2, disabled: false },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `label` is the visible label, wired to the control with `for`/`id`. */
export const Label: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { label: 'delivery window' },
}

/** `options` are rendered as both the value and the visible text. */
export const Options: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: {
    label: 'delivery window',
    options: ['ASAP', 'In 30 minutes', 'In an hour', 'Tonight'],
    value: 'ASAP',
  },
}

/** `value` and `onChange` make the control fully controlled. */
export const Value: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { value: 4 },
}

/** `disabled` is native, and passed straight through. */
export const Disabled: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { disabled: true },
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: { class: 'select-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * Numeric options come back as numbers and text options as strings, so a
 * caller never parses the value first — and a non-numeric option is never
 * turned into `NaN`, which is what Mealdrop's blanket `Number()` did.
 */
export const ValueCoercion: Story = {
  tags: ['highlight'],
  argTypes: hide('options', 'value', 'class'),
  render: (args) => ({ Component: ValueCoercionDemo, props: args }),
}

/**
 * The control is the native `<select>`. On touch devices that opens the
 * platform picker, which no scripted listbox matches for accessibility or
 * muscle memory — Droppy only restyles it and supplies its own chevron.
 */
export const NativeControl: Story = {
  tags: ['highlight'],
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** Label, a wrapper carrying the chevron, and the native control inside it. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('label', 'options', 'value', 'disabled', 'class'),
  parameters: {
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
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Choosing up to two extras for a customisable burger. */
export const MealdropBurgerExtras: Story = {
  tags: ['examples'],
  argTypes: hide('label', 'options', 'value', 'onChange', 'disabled', 'class'),
  render: () => ({ Component: MealdropBurgerExtrasDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestReportsNumericValues: Story = {
  tags: ['tests'],
  play: async ({ args, canvas }) => {
    await userEvent.selectOptions(canvas.getByLabelText('servings'), '4')

    await expect(args.onChange).toHaveBeenCalledWith(4)
  },
}

export const TestReportsTextValues: Story = {
  tags: ['tests'],
  args: {
    label: 'delivery window',
    options: ['ASAP', 'In 30 minutes', 'In an hour', 'Tonight'],
    value: 'ASAP',
  },
  play: async ({ args, canvas }) => {
    await userEvent.selectOptions(canvas.getByLabelText('delivery window'), 'Tonight')

    // Never NaN: a non-numeric option comes back as its own string.
    await expect(args.onChange).toHaveBeenCalledWith('Tonight')
  },
}

export const TestLabelNamesTheControl: Story = {
  tags: ['tests'],
  play: async ({ canvas }) => {
    await expect(canvas.getByLabelText('servings').tagName).toBe('SELECT')
  },
}

export const Empty: Story = {
  tags: ['empty'],
}
