<script module lang="ts">
  import type { HeadingProps } from '../Heading'

  export type TopBannerProps = {
    title?: string
    /** Heading level of the title. Defaults to 1: the banner sits at the top of the page and
     *  usually carries its primary title, so the outline starts here. Pass a deeper level when
     *  the page's `h1` lives elsewhere. */
    level?: HeadingProps['level']
    photoUrl?: string
    /** Accepted for call-site parity with Mealdrop's `TopBanner`, which passes this to a back
     *  button that's commented out in its own source. `TopBanner` renders no control of its
     *  own, so the callback is never invoked. */
    onBackClick?: () => void
    class?: string
  }
</script>

<script lang="ts">
  import { Heading } from '../Heading'
  import { cx } from '../../utils/cx'

  let {
    title,
    level = 1,
    photoUrl,
    onBackClick: _onBackClick,
    class: className,
  }: TopBannerProps = $props()
</script>

<div
  data-part="root"
  class={cx('droppy-TopBanner', className)}
  style:background-image={photoUrl ? `url("${photoUrl}")` : undefined}
>
  {#if title}
    <Heading
      data-part="title"
      {level}
      class={cx('droppy-TopBanner__heading', photoUrl && 'droppy-TopBanner__heading--onPhoto')}
    >
      {title}
    </Heading>
  {/if}
</div>
