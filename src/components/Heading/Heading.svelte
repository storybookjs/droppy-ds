<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TextOrSnippet } from '../../utils/text'

  export type HeadingProps = {
    /** The rendered tag (`h1`–`h5`). Also the size step when `size` is unset. */
    level?: 1 | 2 | 3 | 4 | 5
    /** Visual size step. Defaults to `level`, so setting `level` alone keeps
     *  the tag and the size together. Pass `size` to pick the visual size
     *  independently of the semantic level — the tag still follows `level`. */
    size?: 1 | 2 | 3 | 4 | 5
    /** The heading text. */
    children?: TextOrSnippet
    /** Bindable reference to the rendered heading element. */
    ref?: HTMLHeadingElement | null
  } & Omit<HTMLAttributes<HTMLHeadingElement>, 'children'>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  /**
   * Display type.
   *
   * Spreads the rest of its props (and exposes a bindable `ref`) so composition
   * wrappers — Bits UI's `Dialog.Title` — can wire `aria-labelledby` to the real
   * heading element.
   */
  let {
    level = 1,
    size,
    children,
    class: className,
    ref = $bindable(null),
    ...rest
  }: HeadingProps = $props()

  const visualSize = $derived(size ?? level)
</script>

<svelte:element
  this={`h${level}`}
  bind:this={ref}
  data-part="root"
  class={cx('droppy-Heading', `droppy-Heading--${visualSize}`, className as string)}
  {...rest}
>
  {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
</svelte:element>
