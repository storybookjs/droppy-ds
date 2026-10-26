<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TextOrSnippet } from '../../utils/text'

  export type ProgressProps = {
    /** Current value. `null` (or omitted) renders an indeterminate bar. */
    value?: number | null
    /** Upper bound `value` is measured against. */
    max?: number
    /** Lower bound of the range. */
    min?: number
    /** Accessible name, rendered above the track. */
    label?: TextOrSnippet
    /** Renders the formatted value (a percentage by default) next to the label. */
    showValue?: boolean
    /** Options for `Intl.NumberFormat`; defaults to a percentage. */
    format?: Intl.NumberFormatOptions
    /** Locale for the formatted value. */
    locale?: Intl.LocalesArgument
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'role'>
</script>

<script lang="ts">
  import { Progress as BitsProgress } from 'bits-ui'
  import theme from '../../theme'
  import { cx } from '../../utils/cx'

  /**
   * A track-and-fill indicator built on Bits UI's `Progress`, adding a `Label`
   * and formatted `Value` part on top of the plain fill `ProgressBar` renders.
   * `value={null}` (or omitting it) puts the bar in indeterminate mode, for a
   * wait whose length or step count isn't known — something `ProgressBar` has
   * no way to express.
   */
  let {
    value = null,
    max = 100,
    min = 0,
    label,
    showValue,
    format,
    locale,
    class: className,
    ...rest
  }: ProgressProps = $props()

  const labelId = $props.id()

  const indeterminate = $derived(value === null)
  const complete = $derived(value !== null && value >= max)
  const fraction = $derived(
    value === null || max === min ? 0 : (Math.min(Math.max(value, min), max) - min) / (max - min)
  )
  const formatted = $derived.by(() => {
    if (value === null) return ''
    if (format && format.style !== 'percent')
      return new Intl.NumberFormat(locale, format).format(value)
    return new Intl.NumberFormat(locale, { style: 'percent', ...format }).format(fraction)
  })
  // Base UI's state attributes, which the theme CSS keys off.
  const stateAttrs = $derived({
    'data-indeterminate': indeterminate ? '' : undefined,
    'data-complete': complete ? '' : undefined,
    'data-progressing': !indeterminate && !complete ? '' : undefined,
  })
</script>

<BitsProgress.Root
  data-part="root"
  {value}
  {max}
  {min}
  aria-labelledby={label ? labelId : undefined}
  aria-valuetext={value === null ? undefined : formatted}
  class={cx(theme.ProgressRoot, 'droppy-Progress', className as string)}
  {...stateAttrs}
  {...rest as Record<string, unknown>}
>
  {#if label}
    <span data-part="label" id={labelId} class={theme.ProgressLabel} {...stateAttrs}>
      {#if typeof label === 'string'}{label}{:else}{@render label()}{/if}
    </span>
  {/if}
  {#if showValue}
    <span data-part="value" aria-hidden="true" class={theme.ProgressValue} {...stateAttrs}
      >{formatted}</span
    >
  {/if}
  <div data-part="track" class={theme.ProgressTrack} {...stateAttrs}>
    <div
      data-part="indicator"
      class={theme.ProgressIndicator}
      style:inset-inline-start={indeterminate ? undefined : '0'}
      style:height={indeterminate ? undefined : 'inherit'}
      style:width={indeterminate ? undefined : `${fraction * 100}%`}
      {...stateAttrs}
    ></div>
  </div>
</BitsProgress.Root>
