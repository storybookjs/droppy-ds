<script module lang="ts">
  import type { Snippet } from 'svelte'

  export type ItemsPerView = {
    mobile: number
    tablet: number
    desktop: number
  }

  export type CarouselProps<T = unknown> = {
    /** The data for each slide, in order. */
    items: T[]
    /** Renders one slide's content from its item and index. Each call is
     *  wrapped in its own slide element. */
    slide: Snippet<[T, number]>
    /** Number of items visible per breakpoint (mobile-first). */
    itemsPerView: ItemsPerView
    /** How many items each arrow click advances, per breakpoint (defaults to 1). */
    slidesToScroll?: Partial<ItemsPerView>
    class?: string
  }

  // Matches --ds-breakpoint-sm and --ds-breakpoint-lg; media queries (used by
  // `matchMedia` below, same as in the component's CSS) can't read custom
  // properties.
  const TABLET_QUERY = '(min-width: 640px)'
  const DESKTOP_QUERY = '(min-width: 1024px)'
</script>

<script lang="ts" generics="T">
  import EmblaCarousel, { type EmblaCarouselType } from 'embla-carousel'
  import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
  import { cx } from '../../utils/cx'
  import { IconButton } from '../IconButton'

  /**
   * A horizontally scrolling row of items — restaurant cards, category tiles —
   * showing a fixed number per breakpoint with drag, wheel-gesture, and arrow
   * navigation.
   *
   * Non-visible or partially scrolled slides dim to signal there's more to
   * scroll to. Arrows only render once there's somewhere to go in that
   * direction, and only appear on desktop; smaller screens scroll by dragging.
   */
  let { items, slide, itemsPerView, slidesToScroll, class: className }: CarouselProps<T> = $props()

  let viewport = $state<HTMLElement | null>(null)
  let embla = $state<EmblaCarouselType | null>(null)
  let canScrollPrev = $state(false)
  let canScrollNext = $state(false)
  let slidesInView = $state<number[]>([])

  const step = $derived({ mobile: 1, tablet: 1, desktop: 1, ...slidesToScroll })

  // How many slides an arrow click advances at the current breakpoint.
  const stepForViewport = () => {
    if (typeof globalThis.matchMedia === 'function') {
      if (globalThis.matchMedia(DESKTOP_QUERY).matches) return step.desktop
      if (globalThis.matchMedia(TABLET_QUERY).matches) return step.tablet
    }
    return step.mobile
  }

  const scrollPrev = () => {
    if (!embla) return
    embla.scrollTo(Math.max(embla.selectedScrollSnap() - stepForViewport(), 0))
  }

  const scrollNext = () => {
    if (!embla) return
    const lastSnap = embla.scrollSnapList().length - 1
    embla.scrollTo(Math.min(embla.selectedScrollSnap() + stepForViewport(), lastSnap))
  }

  $effect(() => {
    if (!viewport) return
    const api = EmblaCarousel(
      viewport,
      {
        align: 'start',
        containScroll: 'trimSnaps',
        // watchDrag defaults to true, so both mouse and touch dragging work.
        // A slide counts as "in view" only when almost fully visible, so
        // partially scrolled slides are dimmed (see below).
        inViewThreshold: 0.95,
      },
      // Horizontal wheel / trackpad and shift+scroll move the carousel;
      // vertical scrolling still scrolls the page.
      [WheelGesturesPlugin()]
    )
    const onSelect = () => {
      canScrollPrev = api.canScrollPrev()
      canScrollNext = api.canScrollNext()
    }
    const onSlidesInView = () => {
      slidesInView = api.slidesInView()
    }
    onSelect()
    onSlidesInView()
    api
      .on('select', onSelect)
      .on('slidesInView', onSlidesInView)
      .on('reInit', onSelect)
      .on('reInit', onSlidesInView)
    embla = api
    return () => {
      api.destroy()
      embla = null
    }
  })

  // Re-measure when the set of slides changes (e.g. loading skeletons swapped
  // for the real content), otherwise Embla keeps stale sizes and can't scroll.
  $effect(() => {
    void items.length
    embla?.reInit()
  })
</script>

<div
  data-part="root"
  class={cx('droppy-Carousel', className)}
  style:--droppy-Carousel-items-mobile={itemsPerView.mobile}
  style:--droppy-Carousel-items-tablet={itemsPerView.tablet}
  style:--droppy-Carousel-items-desktop={itemsPerView.desktop}
>
  {#if canScrollPrev}
    <IconButton
      data-part="nav"
      name="arrow-left"
      aria-label="Previous"
      onclick={scrollPrev}
      class="droppy-Carousel-nav droppy-Carousel-nav--prev"
    />
  {/if}
  <div data-part="viewport" class="droppy-Carousel-viewport" bind:this={viewport}>
    <div data-part="container" class="droppy-Carousel-container">
      {#each items as item, index (index)}
        <div
          data-part="slide"
          class={cx(
            'droppy-Carousel-slide',
            slidesInView.length > 0 &&
              !slidesInView.includes(index) &&
              'droppy-Carousel-slide--dimmed'
          )}
        >
          {@render slide(item, index)}
        </div>
      {/each}
    </div>
  </div>
  {#if canScrollNext}
    <IconButton
      data-part="nav"
      name="arrow-right"
      aria-label="Next"
      onclick={scrollNext}
      class="droppy-Carousel-nav droppy-Carousel-nav--next"
    />
  {/if}
</div>
