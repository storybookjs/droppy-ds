<script module lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements'

  type DefaultProps = {
    /** Visible label, rendered above the control. */
    label?: string
    /** Option values. Rendered as both the value and the visible text. */
    options?: Array<string | number>
    value?: string | number
    /** Receives the selected value, coerced to a number when the option is numeric. */
    onChange?: (value: string | number) => void
  }

  export type SelectProps = DefaultProps & Omit<HTMLSelectAttributes, keyof DefaultProps>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  /**
   * A single-choice control over a short, known list.
   *
   * Uses the native `<select>` — on touch devices it opens the platform picker,
   * which no scripted listbox matches for accessibility or muscle memory. Droppy
   * restyles the control and supplies its own chevron.
   */
  let {
    label = '',
    value = '',
    options = [],
    onChange,
    id,
    class: className,
    ...rest
  }: SelectProps = $props()

  const uid = $props.id()
  const selectId = $derived(id ?? uid)

  const handleChange = (event: Event & { currentTarget: HTMLSelectElement }) => {
    const raw = event.currentTarget.value
    // Numeric options are far and away the common case (quantities,
    // servings), so hand those back as numbers — but never turn a
    // non-numeric option into NaN.
    onChange?.(raw !== '' && !Number.isNaN(Number(raw)) ? Number(raw) : raw)
  }
</script>

<div data-part="root" class={cx('droppy-Select', className as string)}>
  {#if label}
    <label data-part="label" class="droppy-Select-label" for={selectId}>{label}</label>
  {/if}
  <div data-part="wrapper" class="droppy-Select-controlWrapper">
    <select
      data-part="control"
      id={selectId}
      class="droppy-Select-control"
      {value}
      onchange={handleChange}
      {...rest}
    >
      {#each options as option (option)}
        <option value={option}>{option}</option>
      {/each}
    </select>
  </div>
</div>
