<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TextOrSnippet } from '../../utils/text'

  export type CardProps = {
    /** Hover dim + pointer cursor. The shell only — callers wire their own onclick. */
    interactive?: boolean
    /** Adds `--ds-space-sm` padding on all sides. Bare by default, since most of
     *  the components this replaces already own their internal padding. */
    padded?: boolean
    /** Whatever the card groups — no slots. */
    children?: TextOrSnippet
  } & Omit<HTMLAttributes<HTMLDivElement>, 'children'>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  let {
    children,
    interactive = false,
    padded = false,
    class: className,
    ...rest
  }: CardProps = $props()
</script>

<div
  data-part="root"
  class={cx(
    'droppy-Card',
    interactive && 'droppy-Card--interactive',
    padded && 'droppy-Card--padded',
    className as string
  )}
  {...rest}
>
  {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
</div>
