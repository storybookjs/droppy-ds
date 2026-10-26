<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta } from '@storybook/svelte'
  import { expect, waitFor } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Badge } from '../Badge'
  import { Body } from '../Body'
  import { Card } from '../Card'
  import { Heading } from '../Heading'
  import { PageSection } from '../PageSection'
  import { Review } from '../Review'

  import Carousel, { type CarouselProps } from './Carousel.svelte'

  type Restaurant = {
    name: string
    specialty: string
    rating?: number
    categories: string[]
    photoUrl: string
  }

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof CarouselProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox = () => ({ Component: BorderedBox })

  const TILES = Array.from({ length: 8 }, (_, index) => `Item ${index + 1}`)

  const NEARBY_RESTAURANTS: Restaurant[] = [
    {
      name: 'Burger Kingdom',
      specialty: 'Nicest place for burgers',
      rating: 4.2,
      categories: ['burgers'],
      photoUrl:
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20',
    },
    {
      name: 'Kara Fin',
      specialty: 'Sarma (wine leafs with rice)',
      rating: undefined,
      categories: ['pizza'],
      photoUrl:
        'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      name: 'Ciao Bella',
      specialty: 'Takeaway lasagna',
      rating: 4.7,
      categories: ['pizza'],
      photoUrl:
        'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      name: 'Warung Atika',
      specialty: '€6 meals',
      rating: 4.4,
      categories: ['asian'],
      photoUrl: 'https://duyt4h9nfnj50.cloudfront.net/search_home/FastFood.jpg',
    },
    {
      name: "Yuan's Hot Pot",
      specialty: 'Cheap and fun evening meals',
      rating: 3.9,
      categories: ['thai'],
      photoUrl: 'https://duyt4h9nfnj50.cloudfront.net/search_home/FastFood.jpg',
    },
  ]

  const { Story } = defineMeta({
    title: 'Media & content/Carousel',
    component: Carousel,
    args: { itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 }, items: TILES },
    argTypes: {
      items: {
        control: 'object',
        description: 'The data for each slide. One wrapper is added per item.',
      },
      slide: {
        control: false,
        description: 'Renders one slide’s content from its item and index.',
      },
      itemsPerView: {
        control: 'object',
        description:
          'How many items are visible per breakpoint (mobile-first). Fractions are fine.',
      },
      slidesToScroll: {
        control: 'object',
        description: 'How many items each arrow click advances, per breakpoint. Defaults to 1.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Carousel` class.',
      },
    },
    parameters: {
      // Off-screen slides render at opacity 0.5 by design, to signal there's
      // more to scroll to — the a11y addon's color-contrast check flags that
      // reduced contrast on stub story content, but it's the intended dimmed
      // state, not a real content-legibility issue.
      a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
    },
    render: tileCarousel,
  })
</script>

<!-- Story harness: a Carousel of plain tiles, driven from a plain-data `items` arg. -->
{#snippet tileCarousel({ slide: _slide, ...args }: CarouselProps<string>)}
  <Carousel {...args}>
    {#snippet slide(label: string)}
      <Card padded style="height: 8rem; display: flex; align-items: center">{label}</Card>
    {/snippet}
  </Carousel>
{/snippet}

<!--
  A scrolling row of tiles. `itemsPerView` is set below, so the controls start
  populated — the fractional mobile value is deliberate, so a sliver of the
  next tile shows and the row reads as scrollable.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 } }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `items` and `slide` make the slides — one wrapper is added per item. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('slidesToScroll', 'class')}
  args={{ items: Array.from({ length: 4 }, (_, i) => `Card ${i + 1}`) }}
/>

<!-- `itemsPerView` sets how many fit per breakpoint. Fractions show a sliver of the next. -->
<Story
  exportName="ItemsPerView"
  name="Items Per View"
  tags={['api-ref']}
  argTypes={hide('slidesToScroll', 'class')}
  args={{ itemsPerView: { mobile: 1, tablet: 2, desktop: 3 } }}
/>

<!-- `slidesToScroll` advances more than one item per arrow click. -->
<Story
  exportName="SlidesToScroll"
  name="Slides To Scroll"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ slidesToScroll: { desktop: 4 } }}
/>

<!--
  `className` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('slidesToScroll')}
  args={{ class: 'carousel-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  Arrows only render once there is somewhere to go in that direction — with
  fewer items than fit, neither appears. They are desktop-only besides;
  smaller screens scroll by dragging or by horizontal wheel gesture.
-->
<Story
  exportName="ArrowsOnlyWhenThereIsSomewhereToGo"
  name="Arrows Only When There Is Somewhere To Go"
  tags={['highlight']}
  argTypes={hide('slidesToScroll', 'class')}
  args={{ items: TILES.slice(0, 2) }}
/>

<!--
  Slides that aren't almost fully visible dim to 0.5, so a partially scrolled
  row signals there is more to reach rather than looking clipped.
-->
<Story
  exportName="OffscreenSlidesDim"
  name="Offscreen Slides Dim"
  tags={['highlight']}
  argTypes={hide('slidesToScroll', 'class')}
  args={{ itemsPerView: { mobile: 1.2, tablet: 2.5, desktop: 3.5 } }}
/>

<!-- anatomy — the rendered part tree -->

<!-- The rail, its viewport and track, one wrapper per slide, and the arrows. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('items', 'slide', 'itemsPerView', 'slidesToScroll', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'Carries the per-breakpoint item counts as CSS custom properties.',
        },
        { id: 'viewport', name: 'Viewport', description: 'The clipped window Embla drives.' },
        { id: 'container', name: 'Container', description: 'The track that slides horizontally.' },
        {
          id: 'slide',
          name: 'Slide',
          description: 'One wrapper per child; dims when not almost fully in view.',
        },
        {
          id: 'nav',
          name: 'Nav',
          description: 'Previous/next arrows. Only mounted when that direction can scroll.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- The 'Restaurants near you' rail. -->
<Story
  exportName="MealdropRestaurantRail"
  name="Mealdrop Restaurant Rail"
  tags={['examples']}
  argTypes={hide('items', 'slide', 'itemsPerView', 'slidesToScroll', 'class')}
>
  {#snippet template()}
    <PageSection title="Restaurants near you" topButtonLabel="View all" onTopButtonClick={() => {}}>
      <Carousel items={NEARBY_RESTAURANTS} itemsPerView={{ mobile: 1.2, tablet: 2, desktop: 3 }}>
        {#snippet slide(restaurant: Restaurant)}
          <Card interactive>
            <img
              src={restaurant.photoUrl}
              alt=""
              style="display: block; height: 140px; width: 100%; object-fit: cover"
            />
            <div style="display: grid; gap: 0.5rem; padding: 1rem">
              <Heading level={3} size={4}>{restaurant.name}</Heading>
              <Review rating={restaurant.rating} />
              <Body size="S">{restaurant.specialty}</Body>
              <div style="display: flex; gap: 0.5rem">
                {#each restaurant.categories as category (category)}
                  <Badge text={category} />
                {/each}
              </div>
            </div>
          </Card>
        {/snippet}
      </Carousel>
    </PageSection>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestRendersEverySlide"
  name="Test Renders Every Slide"
  tags={['tests']}
  play={async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText('Item 1')).toBeInTheDocument()
    // Every item gets a wrapper, whether or not it is currently in view.
    await expect(canvasElement.querySelectorAll('[data-part="slide"]')).toHaveLength(8)
  }}
/>

<!--
  One slide, so there is nothing to scroll at any breakpoint — two would
  still scroll in a narrow canvas, where only ~1 item fits.
-->
<Story
  exportName="TestNoArrowsWithNothingToScroll"
  name="Test No Arrows With Nothing To Scroll"
  tags={['tests']}
  args={{ items: TILES.slice(0, 1), itemsPerView: { mobile: 1, tablet: 2, desktop: 2 } }}
  play={async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    )
    await expect(canvas.queryByRole('button', { name: 'Previous' })).not.toBeInTheDocument()
  }}
/>

<Story
  exportName="TestItemsPerViewReachesCss"
  name="Test Items Per View Reaches Css"
  tags={['tests']}
  play={async ({ canvasElement }) => {
    const root = canvasElement.querySelector('.droppy-Carousel') as HTMLElement

    // The counts drive the slide widths through custom properties rather than
    // inline widths, so the CSS owns the breakpoints.
    await expect(root.style.getPropertyValue('--droppy-Carousel-items-desktop')).toBe('4')
    await expect(root.style.getPropertyValue('--droppy-Carousel-items-mobile')).toBe('1.2')
  }}
/>

<Story
  name="Empty"
  tags={['empty']}
  args={{ itemsPerView: { mobile: 1.2, tablet: 3, desktop: 4 }, items: TILES }}
/>

<style>
  :global(.carousel-demo-inset) {
    margin: 1rem;
  }
</style>
