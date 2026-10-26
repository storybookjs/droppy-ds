<script module lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'
  import type { TextOrSnippet } from '../../utils/text'

  export type BodySize = 'S' | 'XS' | 'XXS'
  export type BodyWeight = 'regular' | 'medium' | 'bold' | 'black'
  export type BodyElement = 'span' | 'p' | 'label' | 'figcaption'

  export type BodyProps = {
    /** Visual size step. Absent renders the base body size. */
    size?: BodySize
    /** Font weight. */
    fontWeight?: BodyWeight
    /** Rendered element. */
    type?: BodyElement
    /** Overrides the text color inline. Unset, follows the theme's primary text token. */
    color?: string
    /** The text, or a snippet of inline markup. */
    children?: TextOrSnippet
    /** Associates a `label` with its control (only meaningful when `type="label"`). */
    for?: string
  } & Omit<HTMLAttributes<HTMLElement>, 'children' | 'color'>

  const sizeClassName: Record<BodySize, string> = {
    S: 'droppy-Body--size-s',
    XS: 'droppy-Body--size-xs',
    XXS: 'droppy-Body--size-xxs',
  }

  const weightClassName: Record<BodyWeight, string> = {
    regular: '',
    medium: 'droppy-Body--weight-medium',
    bold: 'droppy-Body--weight-bold',
    black: 'droppy-Body--weight-black',
  }
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  /**
   * Plain-text typography — the body-copy counterpart to `Heading`.
   *
   * `type` picks the rendered element (`p` by default, or `span`, `label`,
   * `figcaption`); `size` and `fontWeight` pick the type-scale step and weight
   * independently of it.
   */
  let {
    size,
    fontWeight = 'regular',
    type = 'p',
    color,
    children,
    class: className,
    ...rest
  }: BodyProps = $props()
</script>

<!-- `style:color` beats any inline `style` color, matching React's `{ color, ...style }` closely enough. -->
<svelte:element
  this={type}
  data-part="root"
  class={cx(
    'droppy-Body',
    size && sizeClassName[size],
    weightClassName[fontWeight],
    className as string
  )}
  {...rest}
  style:color
>
  {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
</svelte:element>
