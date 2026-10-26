<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  /** Why the value changed — passed as `onValueChange`'s second argument. */
  export type NumberFieldChangeDetails = {
    reason: 'input' | 'increment' | 'decrement' | 'keyboard' | 'scrub' | 'blur'
    event: Event
  }

  type DefaultProps = {
    /** Visible label. Also becomes the field's accessible name. */
    label?: string
    disabled?: boolean
    class?: string
    /** Starting value, uncontrolled. */
    defaultValue?: number | null
    /** The value, for a controlled field. Pair with `onValueChange`. */
    value?: number | null
    /** Receives the parsed number, or `null` when the field is empty. */
    onValueChange?: (value: number | null, details: NumberFieldChangeDetails) => void
    /** Lower bound. The decrement disables here. */
    min?: number
    /** Upper bound. The increment disables here. */
    max?: number
    /** How much each increment moves the value. */
    step?: number
    /** `Intl.NumberFormat` options — currency, percent, decimals. */
    format?: Intl.NumberFormatOptions
    /** Locale for formatting and parsing. Defaults to the runtime's. */
    locale?: string
    /** Forwarded to the input, for form submission. */
    name?: string
    id?: string
    required?: boolean
    readonly?: boolean
  }

  export type NumberFieldProps = DefaultProps &
    Omit<HTMLAttributes<HTMLDivElement>, keyof DefaultProps>
</script>

<script lang="ts">
  import theme from '../../theme'
  import { cx } from '../../utils/cx'
  import { Icon } from '../Icon'

  /**
   * A typeable numeric input with increment/decrement buttons and pointer
   * scrub, for a quantity or amount that can also be reached by keyboard or
   * direct entry — unlike `QuantityStepper`, which only supports tap-tap
   * bounded increments.
   *
   * Hand-rolled (Bits UI has no number field): the input is a `spinbutton`
   * with `aria-valuenow/min/max`, arrow/Page/Home/End keys step it, and the
   * label sits inside a scrub area, so dragging it also changes the value.
   */
  let {
    label,
    disabled = false,
    class: className,
    defaultValue,
    value,
    onValueChange,
    min,
    max,
    step = 1,
    format,
    locale,
    name,
    id,
    required,
    readonly = false,
    ...rest
  }: NumberFieldProps = $props()

  const uid = $props.id()
  const inputId = $derived(id ?? `${uid}-input`)

  // svelte-ignore state_referenced_locally
  let internal = $state<number | null>(value ?? defaultValue ?? null)
  const current = $derived(value !== undefined ? value : internal)

  /** Text while the user is typing; `null` shows the formatted value. */
  let draft = $state<string | null>(null)

  const formatter = $derived(new Intl.NumberFormat(locale, format))
  const decimalSeparator = $derived(
    new Intl.NumberFormat(locale).formatToParts(1.1).find((p) => p.type === 'decimal')?.value ?? '.'
  )
  const display = $derived(draft ?? (current === null ? '' : formatter.format(current)))

  const atMin = $derived(min !== undefined && current !== null && current <= min)
  const atMax = $derived(max !== undefined && current !== null && current >= max)

  const clamp = (n: number) => {
    let next = n
    if (min !== undefined) next = Math.max(min, next)
    if (max !== undefined) next = Math.min(max, next)
    // Trim float noise so 0.1 + 0.2 never shows 0.30000000000000004.
    return Number(next.toFixed(10))
  }

  const parse = (text: string): number | null => {
    const cleaned = text.replaceAll(decimalSeparator, '.').replace(/[^\d.-]/g, '')
    if (cleaned === '' || cleaned === '-' || cleaned === '.') return null
    const n = Number(cleaned)
    if (Number.isNaN(n)) return null
    // Percent formatting displays 50% for 0.5.
    return format?.style === 'percent' ? n / 100 : n
  }

  const commit = (next: number | null, details: NumberFieldChangeDetails) => {
    if (next === current) return
    internal = next
    onValueChange?.(next, details)
  }

  const stepBy = (delta: number, reason: NumberFieldChangeDetails['reason'], event: Event) => {
    if (disabled || readonly) return
    draft = null
    const base = current ?? (delta > 0 ? (min ?? 0) - delta : (max ?? 0) - delta)
    commit(clamp(base + delta), { reason, event })
  }

  const handleInput = (event: Event & { currentTarget: HTMLInputElement }) => {
    draft = event.currentTarget.value
    commit(parse(draft), { reason: 'input', event })
  }

  const handleBlur = (event: FocusEvent) => {
    if (draft === null) return
    const parsed = parse(draft)
    draft = null
    commit(parsed === null ? null : clamp(parsed), { reason: 'blur', event })
  }

  const handleKeydown = (event: KeyboardEvent) => {
    const big = step * 10
    const amount = event.shiftKey ? big : step
    switch (event.key) {
      case 'ArrowUp':
        stepBy(amount, 'keyboard', event)
        break
      case 'ArrowDown':
        stepBy(-amount, 'keyboard', event)
        break
      case 'PageUp':
        stepBy(big, 'keyboard', event)
        break
      case 'PageDown':
        stepBy(-big, 'keyboard', event)
        break
      case 'Home':
        if (min === undefined) return
        draft = null
        commit(min, { reason: 'keyboard', event })
        break
      case 'End':
        if (max === undefined) return
        draft = null
        commit(max, { reason: 'keyboard', event })
        break
      default:
        return
    }
    event.preventDefault()
  }

  const press = (direction: 1 | -1) => (event: MouseEvent) => {
    if ((direction > 0 && atMax) || (direction < 0 && atMin)) return
    stepBy(direction * step, direction > 0 ? 'increment' : 'decrement', event)
  }

  /* Scrub: drag horizontally on the label to step the value, one step per pixel. */
  let scrubbing = $state(false)

  const onScrubMove = (event: PointerEvent) => {
    if (!scrubbing || event.movementX === 0) return
    stepBy(event.movementX * step, 'scrub', event)
  }
  const onScrubEnd = () => {
    scrubbing = false
    window.removeEventListener('pointermove', onScrubMove)
    window.removeEventListener('pointerup', onScrubEnd)
  }
  const onScrubStart = (event: PointerEvent) => {
    if (disabled || readonly || event.button !== 0) return
    scrubbing = true
    window.addEventListener('pointermove', onScrubMove)
    window.addEventListener('pointerup', onScrubEnd)
  }

  $effect(() => onScrubEnd)
</script>

<div
  data-part="field"
  class={cx(theme.FieldRoot, 'droppy-Field')}
  data-disabled={disabled ? '' : undefined}
>
  <div
    data-part="root"
    class={cx(theme.NumberFieldRoot, 'droppy-NumberField', className)}
    data-disabled={disabled ? '' : undefined}
    {...rest}
  >
    {#if label}
      <span
        data-part="scrub"
        role="presentation"
        class={theme.NumberFieldScrubArea}
        data-scrubbing={scrubbing ? '' : undefined}
        onpointerdown={onScrubStart}
      >
        <label
          data-part="label"
          class={theme.FieldLabel}
          for={inputId}
          data-disabled={disabled ? '' : undefined}>{label}</label
        >
      </span>
    {/if}
    <div data-part="group" class={theme.NumberFieldGroup} role="group">
      <button
        data-part="decrement"
        type="button"
        tabindex="-1"
        class={theme.NumberFieldDecrement}
        aria-label="Decrease"
        aria-controls={inputId}
        aria-disabled={disabled || atMin ? 'true' : 'false'}
        data-disabled={disabled || atMin ? '' : undefined}
        {disabled}
        onclick={press(-1)}
      >
        <Icon name="minus" />
      </button>
      <input
        data-part="input"
        id={inputId}
        class={theme.NumberFieldInput}
        type="text"
        role="spinbutton"
        inputmode={step % 1 === 0 && (min ?? 0) >= 0 ? 'numeric' : 'decimal'}
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        aria-valuenow={current ?? undefined}
        aria-valuetext={current === null ? undefined : formatter.format(current)}
        aria-valuemin={min}
        aria-valuemax={max}
        {name}
        {required}
        {disabled}
        {readonly}
        data-disabled={disabled ? '' : undefined}
        value={display}
        oninput={handleInput}
        onblur={handleBlur}
        onkeydown={handleKeydown}
      />
      <button
        data-part="increment"
        type="button"
        tabindex="-1"
        class={theme.NumberFieldIncrement}
        aria-label="Increase"
        aria-controls={inputId}
        aria-disabled={disabled || atMax ? 'true' : 'false'}
        data-disabled={disabled || atMax ? '' : undefined}
        {disabled}
        onclick={press(1)}
      >
        <Icon name="plus" />
      </button>
    </div>
  </div>
</div>
