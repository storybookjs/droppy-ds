<script module lang="ts">
  export type QuantityStepperProps = {
    /** Current quantity. */
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    /** Accessible name for the control group. */
    'aria-label'?: string
    class?: string
  }
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'
  import { Body } from '../Body'
  import { Button } from '../Button'

  /**
   * A minus/plus pair flanking a quantity, for adjusting the count of a single
   * item — a food order's line, a cart quantity.
   *
   * The two buttons disable at `min`/`max` rather than wrapping or clamping
   * silently, and the value announces its own changes via `aria-live`, since
   * the group has no other way to signal that a click landed.
   */
  let {
    value,
    onChange,
    min = 1,
    max = 10,
    'aria-label': ariaLabel = 'quantity',
    class: className,
  }: QuantityStepperProps = $props()
</script>

<div
  data-part="root"
  role="group"
  aria-label={ariaLabel}
  class={cx('droppy-QuantityStepper', className)}
>
  <Button
    data-part="decrement"
    aria-label="decrease quantity by one"
    round
    clear
    icon="minus"
    onclick={() => onChange(value - 1)}
    disabled={value <= min}
  />
  <Body data-part="value" type="span" aria-live="polite" class="droppy-QuantityStepper-value">
    {String(value)}
  </Body>
  <Button
    data-part="increment"
    aria-label="increase quantity by one"
    round
    clear
    icon="plus"
    onclick={() => onChange(value + 1)}
    disabled={value >= max}
  />
</div>
