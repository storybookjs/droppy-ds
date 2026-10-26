<script module lang="ts">
  import type { TextOrSnippet } from '../../utils/text'

  export type PageSectionProps = {
    title: string
    topButtonLabel?: string
    onTopButtonClick?: () => void
    class?: string
    children?: TextOrSnippet
  }
</script>

<script lang="ts">
  import { cx } from '../../utils/cx'
  import { Button } from '../Button'
  import { Heading } from '../Heading'

  let {
    title,
    topButtonLabel,
    onTopButtonClick,
    class: className,
    children,
  }: PageSectionProps = $props()
</script>

<div data-part="root" class={cx('droppy-PageSection', className)}>
  <div data-part="top" class="droppy-PageSection__top">
    <Heading data-part="title" level={2}>{title}</Heading>
    {#if topButtonLabel}
      <Button data-part="action" clear onclick={onTopButtonClick}>{topButtonLabel}</Button>
    {/if}
  </div>
  {#if typeof children === 'string'}{children}{:else}{@render children?.()}{/if}
</div>
