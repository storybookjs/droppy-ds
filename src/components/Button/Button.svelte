<script module lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { IconName } from '../Icon'
  import type { TextOrSnippet } from '../../utils/text'

  export type ButtonProps = {
    /** Strips the fill, leaving just the label — for secondary actions. */
    clear?: boolean
    /** Fully rounded, for icon-only affordances like a close button. */
    round?: boolean
    /** Taller padding, for primary calls to action. */
    large?: boolean
    /** Renders an icon before the label. */
    icon?: IconName
    /** Overrides the icon's rendered size. */
    iconSize?: number
    disabled?: boolean
    /** The label. Omit it for an icon-only button. */
    children?: TextOrSnippet
  } & Omit<HTMLButtonAttributes, 'children'>
</script>

<script lang="ts">
  import theme from '../../theme'
  import { cx } from '../../utils/cx'
  import { Icon } from '../Icon'

  /**
   * The primary action control.
   *
   * Chrome (fill, radius, focus ring, typeface, disabled state) comes from
   * the theme layer; Droppy layers the variants and the icon slot on top.
   */
  let {
    children,
    large = false,
    clear = false,
    round = false,
    icon,
    iconSize,
    class: className,
    type = 'button',
    disabled = false,
    ...rest
  }: ButtonProps = $props()
</script>

<button
  data-part="root"
  {type}
  {disabled}
  data-disabled={disabled ? '' : undefined}
  class={cx(
    theme.Button,
    'droppy-Button',
    clear && 'droppy-Button--clear',
    large && 'droppy-Button--large',
    round && 'droppy-Button--round',
    icon && 'droppy-Button--withIcon',
    className as string
  )}
  {...rest}
>
  {#if icon}<Icon data-part="icon" name={icon} size={iconSize} />{/if}
  {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
</button>
