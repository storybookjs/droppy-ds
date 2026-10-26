<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  export type BadgeProps = {
    /** The label. Rendered capitalized regardless of the casing passed in. */
    text: string
    /** `positive` matches the look of an affirmative flag, e.g. "new". */
    variant?: 'neutral' | 'positive'
  } & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  let { text, variant = 'neutral', class: className, ...rest }: BadgeProps = $props()
</script>

<span
  data-part="root"
  class={cx(
    'droppy-Badge',
    variant === 'positive' && 'droppy-Badge--positive',
    className as string
  )}
  {...rest}>{text}</span
>
