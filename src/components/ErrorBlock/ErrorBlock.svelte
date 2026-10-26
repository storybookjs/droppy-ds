<script module lang="ts">
  import type { Snippet } from 'svelte'

  export type ErrorBlockProps = {
    title: string
    /** Illustration slot — an inline SVG, an image, or an animation the caller drives itself.
     *  Omitted, the block renders with no illustration at all. */
    illustration?: Snippet
    body: string
    buttonText: string
    onButtonClick: () => void
    class?: string
  }
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'
  import { Body } from '../Body'
  import { Button } from '../Button'
  import { Heading } from '../Heading'

  /**
   * A titled message with an optional illustration and a single recovery action —
   * an empty category, a 404, a failed request.
   */
  let {
    title,
    illustration,
    body,
    buttonText,
    onButtonClick,
    class: className,
  }: ErrorBlockProps = $props()
</script>

<div data-part="root" class={cx('droppy-ErrorBlock', className)}>
  <Heading data-part="title" level={2}>{title}</Heading>
  {#if illustration}
    <div data-part="illustration" class="droppy-ErrorBlock-illustration">
      {@render illustration()}
    </div>
  {/if}
  <Body data-part="body">{body}</Body>
  <Button data-part="action" onclick={onButtonClick}>{buttonText}</Button>
</div>
