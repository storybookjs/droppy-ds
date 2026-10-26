<script module lang="ts">
  import type { SVGAttributes } from 'svelte/elements'
  import type { IconName } from './icons'

  export type IconProps = {
    /** Which icon to render. */
    name: IconName
    /** Overrides the stroke colour. Defaults to the theme's icon token. */
    color?: string
    /** Rendered width and height. */
    size?: number | string
  } & Omit<SVGAttributes<SVGSVGElement>, 'color'>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'
  import { icons } from './icons'

  let { name, color, size = '1.5rem', class: className, ...rest }: IconProps = $props()

  const icon = $derived(icons[name])
  const length = $derived(typeof size === 'number' ? `${size}px` : size)
</script>

<!--
  `min-width` keeps the icon from being squeezed by a flex parent, and the
  inline stroke has to beat the class rule when `color` is given.
-->
<svg
  data-part="root"
  class={cx('droppy-Icon', className as string)}
  viewBox={icon.viewBox}
  fill="none"
  width={size}
  height={size}
  aria-hidden="true"
  focusable="false"
  style:width={length}
  style:height={length}
  style:min-width={length}
  style:stroke={color}
  {...rest}
>
  {@html icon.content}
</svg>
