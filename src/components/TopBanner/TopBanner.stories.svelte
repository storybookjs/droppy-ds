<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Badge } from '../Badge'
  import { Review } from '../Review'

  import TopBanner, { type TopBannerProps } from './TopBanner.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof TopBannerProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  // A tiny inline gradient standing in for a restaurant photo, so the story has
  // no network dependency.
  const PHOTO_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="240">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#4cc8c0"/><stop offset="1" stop-color="#22aca7"/>' +
      '</linearGradient></defs>' +
      '<rect width="800" height="240" fill="url(#g)"/></svg>'
  )}`

  const { Story } = defineMeta({
    title: 'Media & content/TopBanner',
    component: TopBanner,
    args: { title: 'Categories' },
    argTypes: {
      title: {
        control: 'text',
        description: 'Rendered as a heading at `level`. Omitted, the banner is bare.',
      },
      level: {
        control: { type: 'select' },
        options: [1, 2, 3, 4, 5],
        description:
          'Heading level of the title. Defaults to 1, for the common case where the banner carries the page’s primary title.',
      },
      photoUrl: {
        control: 'text',
        description: 'Background image. Present, the heading switches to its on-photo treatment.',
      },
      onBackClick: {
        control: false,
        description:
          'Accepted for call-site parity with Mealdrop’s `TopBanner`. No control is rendered, so it is never invoked.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-TopBanner` class.',
      },
    },
    parameters: { layout: 'fullscreen' },
  })
</script>

<!--
  The page header band. Title and photo are both set below, so the controls
  start populated — clear the photo to see the plain treatment.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ title: 'Categories', photoUrl: PHOTO_DATA_URI }}
  argTypes={hide('level', 'onBackClick', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `title` renders as a heading at `level` inside the band. -->
<Story
  name="Title"
  tags={['api-ref']}
  argTypes={hide('level', 'photoUrl', 'onBackClick', 'class')}
  args={{ title: 'Sushi places near you', photoUrl: undefined }}
/>

<!--
  `level` sets the heading level without changing the visual treatment's role:
  the default `h1` fits a page whose primary title the banner carries; pass a
  deeper level when the page's `h1` lives elsewhere.
-->
<Story
  name="Level"
  tags={['api-ref']}
  argTypes={hide('photoUrl', 'onBackClick', 'class')}
  args={{ title: 'Categories', level: 2, photoUrl: undefined }}
/>

<!-- `photoUrl` sets the background and switches the heading to its on-photo treatment. -->
<Story
  name="PhotoUrl"
  tags={['api-ref']}
  argTypes={hide('level', 'onBackClick', 'class')}
  args={{ photoUrl: PHOTO_DATA_URI }}
/>

<!--
  `onBackClick` is accepted for call-site parity with Mealdrop's own
  `TopBanner`, whose back button is commented out in its source. Nothing here
  renders a control, so the callback never fires.
-->
<Story
  name="OnBackClick"
  tags={['api-ref']}
  argTypes={hide('level', 'photoUrl', 'class')}
  args={{ onBackClick: () => {}, photoUrl: undefined }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  name="ClassName"
  tags={['api-ref']}
  argTypes={hide('level', 'onBackClick')}
  args={{ class: 'topbanner-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  With a photo behind it the heading takes its on-photo treatment, so the text
  holds contrast against arbitrary imagery rather than trusting the surface
  token underneath.
-->
<Story
  name="HeadingOverPhoto"
  tags={['highlight']}
  argTypes={hide('level', 'onBackClick', 'class')}
>
  {#snippet template(args)}
    <TopBanner {...args} title="Without a photo" photoUrl={undefined} />
    <TopBanner {...args} title="Over a photo" photoUrl={PHOTO_DATA_URI} />
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- The band and its optional heading. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('title', 'level', 'photoUrl', 'onBackClick', 'class')}
  args={{ photoUrl: PHOTO_DATA_URI }}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The band, carrying the background image when `photoUrl` is set.',
        },
        {
          id: 'title',
          name: 'Title',
          description:
            'The heading (`h1` by default), switched to its on-photo treatment when there is a photo.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- The restaurant detail page header. -->
<Story
  name="MealdropRestaurantHeader"
  tags={['examples']}
  argTypes={hide('title', 'level', 'photoUrl', 'onBackClick', 'class')}
  parameters={{ layout: 'fullscreen' }}
>
  {#snippet template()}
    <div>
      <TopBanner
        title="Burger Kingdom"
        photoUrl="https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20"
      />
      <div style="display: grid; gap: 0.75rem; padding: 1.5rem">
        <Review rating={4.2} />
        <div style="display: flex; gap: 0.5rem">
          <Badge text="burgers" />
          <Badge text="comfort food" />
        </div>
      </div>
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestRendersTitleAsHeading"
  tags={['tests']}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Categories' })).toBeInTheDocument()
  }}
/>

<Story
  name="TestLevelSetsHeadingLevel"
  tags={['tests']}
  args={{ level: 3 }}
  play={async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: 'Categories' })).toBeInTheDocument()
  }}
/>

<Story
  name="TestPhotoBecomesBackground"
  tags={['tests']}
  args={{ photoUrl: PHOTO_DATA_URI }}
  play={async ({ canvas }) => {
    const banner = canvas.getByRole('heading', { level: 1 }).parentElement as HTMLElement

    await expect(getComputedStyle(banner).backgroundImage).toContain('url(')
  }}
/>

<Story
  name="TestTitleIsOptional"
  tags={['tests']}
  args={{ title: undefined }}
  play={async ({ canvas }) => {
    await expect(canvas.queryByRole('heading')).not.toBeInTheDocument()
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.topbanner-demo-inset) {
    margin: 1rem;
  }
</style>
