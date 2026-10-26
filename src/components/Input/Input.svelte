<script module lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements'

  type DefaultProps = {
    /** Visible label. Also becomes the input's accessible name. */
    label?: string
    /** Validation message. The slot is always reserved, so showing one never
     *  shifts the fields below it. */
    error?: string
  }

  export type InputProps = DefaultProps & Omit<HTMLInputAttributes, keyof DefaultProps>
</script>

<script lang="ts">
  import theme from '../../theme'
  import { cx } from '../../utils/cx'

  /**
   * A labelled text field with a reserved error slot.
   *
   * The label, the control and the error message are wired together
   * (`for`/`id`, `aria-describedby`) without the caller doing it.
   */
  let {
    label = '',
    type = 'text',
    id,
    error,
    class: className,
    value = $bindable(),
    disabled,
    ...rest
  }: InputProps = $props()

  const uid = $props.id()
  const controlId = $derived(id ?? `${uid}-control`)
  const errorId = `${uid}-error`
</script>

<div
  data-part="root"
  class={cx(theme.FieldRoot, 'droppy-Field')}
  data-disabled={disabled ? '' : undefined}
>
  {#if label}
    <label
      data-part="label"
      class={theme.FieldLabel}
      for={controlId}
      data-disabled={disabled ? '' : undefined}>{label}</label
    >
  {/if}
  <input
    data-part="control"
    id={controlId}
    {type}
    {disabled}
    data-disabled={disabled ? '' : undefined}
    class={cx(theme.Input, 'droppy-Input', className as string)}
    autocomplete="off"
    aria-describedby={errorId}
    bind:value
    {...rest}
  />
  <!-- Always mounted, so the reserved min-height holds the layout steady. -->
  <div data-part="error" id={errorId} class={cx(theme.FieldError, 'droppy-Field-error')}>
    {error || ' '}
  </div>
</div>
