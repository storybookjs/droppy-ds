import type { AnatomyParameters } from '@component-anatomy/storybook'
import type { Decorator, Meta, StoryObj } from '@storybook/svelte-vite'
import { expect, fn, userEvent } from 'storybook/test'

import BorderedBox from '../../utils/BorderedBox.svelte'

import ClassNameDemo from './fixtures/ClassName.svelte'
import MealdropCartLineDemo from './fixtures/MealdropCartLine.svelte'
import StepperDemo from './fixtures/StepperDemo.svelte'
import QuantityStepper, { type QuantityStepperProps } from './QuantityStepper.svelte'

/** Hides props that aren't a story's point, so its controls stay actionable. */
const hide = (...props: Array<keyof QuantityStepperProps>) =>
  Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

/** A bordered parent, so the margin the ClassName demo adds is actually visible. */
const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

const meta = {
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
  render: (args) => ({ Component: StepperDemo, props: args }),
} satisfies Meta<typeof QuantityStepper>

export default meta
type Story = StoryObj<typeof meta>

/**
 * A cart line's quantity. Bounds are set below, so the controls start
 * populated — click up to `max` and the plus disables rather than wrapping.
 */
export const Default: Story = {
  tags: ['showcase'],
  args: { value: 1, min: 1, max: 10, 'aria-label': 'quantity' },
  argTypes: hide('class'),
}

/* ------------------------------------------------------------------ */
/* api-ref — one story per prop                                        */
/* ------------------------------------------------------------------ */

/** `value` is the current quantity — the component is fully controlled. */
export const Value: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { value: 4 },
}

/** `min` is the lower bound; the minus button disables on it. */
export const Min: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { value: 2, min: 2 },
}

/** `max` is the upper bound; the plus button disables on it. */
export const Max: Story = {
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { value: 3, max: 3 },
}

/** `aria-label` names the group, since the two buttons alone don't say what of. */
export const AriaLabel: Story = {
  name: 'aria-label',
  tags: ['api-ref'],
  argTypes: hide('class'),
  args: { 'aria-label': 'Cheeseburger quantity' },
}

/**
 * `class` merges with the component's own class rather than replacing it.
 * The demo class adds a margin, visible as the gap inside the bordered parent.
 */
export const ClassName: Story = {
  tags: ['api-ref'],
  args: { class: 'quantitystepper-demo-inset' },
  decorators: [inBorderedBox],
  render: (args) => ({ Component: ClassNameDemo, props: args }),
}

/* ------------------------------------------------------------------ */
/* highlight — features and behaviours worth calling out               */
/* ------------------------------------------------------------------ */

/**
 * The buttons disable at the bounds rather than wrapping or clamping silently,
 * so a click never looks like it did nothing. The value carries `aria-live`,
 * because a disabled button and a changed number are the only signals the
 * group gives.
 */
export const BoundsDisableRatherThanClamp: Story = {
  tags: ['highlight'],
  argTypes: hide('class'),
  args: { value: 1, min: 1, max: 2 },
}

/* ------------------------------------------------------------------ */
/* anatomy — the rendered part tree                                    */
/* ------------------------------------------------------------------ */

/** The group, its two round buttons, and the live value between them. */
export const Anatomy: Story = {
  tags: ['anatomy'],
  argTypes: hide('value', 'min', 'max', 'aria-label', 'class'),
  parameters: {
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
  },
}

/* ------------------------------------------------------------------ */
/* examples — Mealdrop / DropBoard compositions                        */
/* ------------------------------------------------------------------ */

/** Cart lines with per-dish quantity steppers. */
export const MealdropCartLine: Story = {
  tags: ['examples'],
  argTypes: hide('value', 'onChange', 'min', 'max', 'aria-label', 'class'),
  render: () => ({ Component: MealdropCartLineDemo }),
}

/* ------------------------------------------------------------------ */
/* tests — assertions only, one behaviour each                         */
/* ------------------------------------------------------------------ */

export const TestDisablesAtMin: Story = {
  tags: ['tests'],
  args: { value: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'decrease quantity by one' })).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'increase quantity by one' })
    ).not.toBeDisabled()
  },
}

export const TestDisablesAtMax: Story = {
  tags: ['tests'],
  args: { value: 10 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'increase quantity by one' })).toBeDisabled()
    await expect(
      canvas.getByRole('button', { name: 'decrease quantity by one' })
    ).not.toBeDisabled()
  },
}

export const TestReportsEachChange: Story = {
  tags: ['tests'],
  args: { value: 1, max: 2 },
  play: async ({ args, canvas }) => {
    const increase = canvas.getByRole('button', { name: 'increase quantity by one' })
    const decrease = canvas.getByRole('button', { name: 'decrease quantity by one' })

    await userEvent.click(increase)
    await expect(args.onChange).toHaveBeenCalledWith(2)
    await expect(increase).toBeDisabled()

    await userEvent.click(decrease)
    await expect(args.onChange).toHaveBeenCalledWith(1)
    await expect(decrease).toBeDisabled()
  },
}

export const TestGroupIsNamed: Story = {
  tags: ['tests'],
  args: { 'aria-label': 'Cheeseburger quantity' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Cheeseburger quantity' })).toBeInTheDocument()
  },
}

export const Empty: Story = {
  tags: ['empty'],
  args: { value: 1, onChange: fn() },
}
