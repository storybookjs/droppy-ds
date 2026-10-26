<script module lang="ts">
  export type SkeletonProps = {
    /** Numbers are treated as pixels; strings pass through unchanged. Defaults to `100%`. */
    width?: string | number
    /** Numbers are treated as pixels; strings pass through unchanged. Defaults to `1em`. */
    height?: string | number
    class?: string
    /** Inline CSS string, applied after the computed width and height. */
    style?: string
  }

  const toDimension = (value: string | number | undefined): string | undefined =>
    typeof value === 'number' ? `${value}px` : value
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'

  /**
   * Loading placeholder for content whose text or final size isn't known yet.
   *
   * Renders a `span` so it can sit inline inside a `Heading` or a line of text
   * and take on the surrounding font size. `aria-hidden` because a placeholder
   * announces nothing.
   */
  let { width, height, class: className, style }: SkeletonProps = $props()

  const computed = $derived(
    `width: ${toDimension(width) ?? '100%'}; height: ${toDimension(height) ?? '1em'};${style ? ` ${style}` : ''}`
  )
</script>

<span data-part="root" class={cx('droppy-Skeleton', className)} aria-hidden="true" style={computed}
></span>
