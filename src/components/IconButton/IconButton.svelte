<script module lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { IconName } from '../Icon'

  export type IconButtonProps = {
    /** Which icon to render. The button is icon-only, so pass `aria-label` too. */
    name: IconName
    /** Renders the 3rem variant instead of 4rem. */
    small?: boolean
  } & Omit<HTMLButtonAttributes, 'children' | 'name'>
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'
  import { Icon } from '../Icon'

  /**
   * A circular icon-only control for floating affordances — carousel arrows,
   * overlay dismissals.
   *
   * Deliberately not theme-reactive: it stays a light pill in dark mode so it
   * reads against arbitrary imagery. Only the radius and focus ring are tokens.
   */
  let {
    small = false,
    name,
    class: className,
    type = 'button',
    ...rest
  }: IconButtonProps = $props()
</script>

<button
  data-part="root"
  {type}
  data-disabled={rest.disabled ? '' : undefined}
  class={cx('droppy-IconButton', small && 'droppy-IconButton--small', className as string)}
  {...rest}
>
  <Icon data-part="icon" {name} size={small ? 15 : 24} />
</button>
