<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  export type ProgressBarProps = {
    /** How far along the track the fill sits. Clamped to `0`–`max` before it reaches the DOM. */
    value: number
    /** Upper bound `value` is measured against. */
    max?: number
    /** Accessible name — the title/copy around the bar lives in the caller's own markup. */
    label?: string
  } & Omit<HTMLAttributes<HTMLDivElement>, 'role' | 'aria-label' | 'children'>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  /**
   * A track-and-fill indicator for progress through a known number of steps —
   * a multi-step checkout, an upload, a form with a fixed page count.
   *
   * Renders `role="progressbar"` with `aria-valuenow`/`-min`/`-max` on the
   * track; the fill is a plain, `aria-hidden` sibling underneath it.
   */
  let { value, max = 100, label, class: className, ...rest }: ProgressBarProps = $props()

  const clampedValue = $derived(Math.min(Math.max(value, 0), max))
  const percent = $derived(max > 0 ? (clampedValue / max) * 100 : 0)
</script>

<div
  data-part="root"
  role="progressbar"
  aria-valuenow={clampedValue}
  aria-valuemin={0}
  aria-valuemax={max}
  aria-label={label}
  class={cx('droppy-ProgressBar', className as string)}
  {...rest}
>
  <div data-part="fill" class="droppy-ProgressBar-fill" style:width="{percent}%"></div>
</div>
