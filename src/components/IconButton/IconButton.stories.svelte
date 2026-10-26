<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Card } from '../Card'
  import { Heading } from '../Heading'
  import { iconNames } from '../Icon'

  import IconButton, { type IconButtonProps } from './IconButton.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof IconButtonProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const RAIL_TILES = [
    {
      name: 'Burger Kingdom',
      photoUrl:
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1003&q=20',
    },
    {
      name: 'Kara Fin',
      photoUrl:
        'https://images.pexels.com/photos/1058277/pexels-photo-1058277.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
    {
      name: 'Ciao Bella',
      photoUrl:
        'https://images.pexels.com/photos/6267/menu-restaurant-vintage-table.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
    },
  ]

  const { Story } = defineMeta({
    title: 'Actions/IconButton',
    component: IconButton,
    args: { name: 'arrow-right', 'aria-label': 'next', onclick: fn() },
    argTypes: {
      name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
      small: { control: 'boolean', description: 'Renders the 3rem variant instead of 4rem.' },
      onclick: { description: 'Fired on click.' },
      class: {
        control: 'text',
        description:
          'Merged onto the root alongside the component’s own `droppy-IconButton` class.',
      },
    },
  })
</script>

<!--
  A floating circular affordance — a carousel arrow, an overlay dismissal.
  Both props are set below, so the controls start populated.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ name: 'arrow-right', small: false }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `name` picks the glyph; the button is icon-only, so pass `aria-label` too. -->
<Story
  name="Name"
  tags={['api-ref']}
  argTypes={hide('small', 'class')}
  args={{ name: 'cross', 'aria-label': 'close' }}
/>

<!-- `small` swaps the 4rem control for the 3rem one, glyph included. -->
<Story name="Small" tags={['api-ref']} argTypes={hide('name', 'class')}>
  {#snippet template(args)}
    <div style="display: flex; gap: 1rem; align-items: center">
      <IconButton {...args} name="arrow-left" aria-label="previous" />
      <IconButton {...args} name="arrow-left" small aria-label="previous, small" />
    </div>
  {/snippet}
</Story>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('small')}
  args={{ class: 'iconbutton-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  Deliberately not theme-reactive: it stays a light pill in dark mode so it
  reads against arbitrary imagery. Only the radius and focus ring are tokens,
  and the glyph colour is hard-coded rather than following the icon token.
-->
<Story
  exportName="StaysLightOnAnySurface"
  name="Stays Light On Any Surface"
  tags={['highlight']}
  argTypes={hide('small', 'class')}
>
  {#snippet template(args)}
    <div
      style="display: flex; gap: 1rem; padding: 1.5rem; background: linear-gradient(135deg, #1a1a1a, #4cc8c0); border-radius: 0.5rem"
    >
      <IconButton {...args} name="arrow-left" aria-label="previous" />
      <IconButton {...args} name="arrow-right" aria-label="next" />
    </div>
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- The circular control and the glyph it centres. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('name', 'small', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The circular `<button>`: fixed size, radius, and focus ring.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The glyph, sized from `small` and coloured independently of the theme.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- Carousel arrows floating over restaurant photos. -->
<Story
  exportName="MealdropCarouselArrows"
  name="Mealdrop Carousel Arrows"
  tags={['examples']}
  argTypes={hide('name', 'small', 'onclick')}
>
  {#snippet template()}
    <div style="position: relative; max-width: 34rem">
      <div style="display: flex; gap: 1rem; overflow: hidden">
        {#each RAIL_TILES as tile (tile.name)}
          <Card interactive style="min-width: 16rem">
            <img
              src={tile.photoUrl}
              alt=""
              style="display: block; height: 140px; width: 100%; object-fit: cover"
            />
            <div style="padding: 1rem">
              <Heading level={3} size={5}>{tile.name}</Heading>
              <Body size="XS">Delivers in 25–35 min</Body>
            </div>
          </Card>
        {/each}
      </div>

      <div style="position: absolute; top: 3rem; left: -1rem">
        <IconButton name="arrow-left" aria-label="Previous restaurants" />
      </div>
      <div style="position: absolute; top: 3rem; right: -1rem">
        <IconButton name="arrow-right" aria-label="Next restaurants" />
      </div>
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestClickHandling"
  name="Test Click Handling"
  tags={['tests']}
  play={async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'next' }))

    await expect(args.onclick).toHaveBeenCalledOnce()
  }}
/>

<Story
  exportName="TestNamedByAriaLabel"
  name="Test Named By Aria Label"
  tags={['tests']}
  play={async ({ canvas }) => {
    // Icon-only: the glyph is aria-hidden, so the label is the only name.
    await expect(canvas.getByRole('button', { name: 'next' })).toHaveTextContent('')
  }}
/>

<Story
  exportName="TestSmallShrinksGlyph"
  name="Test Small Shrinks Glyph"
  tags={['tests']}
  play={async ({ canvas }) => {
    const regular = canvas.getByRole('button', { name: 'regular' }).querySelector('svg')
    const small = canvas.getByRole('button', { name: 'small' }).querySelector('svg')

    await expect(regular?.getAttribute('width')).toBe('24')
    await expect(small?.getAttribute('width')).toBe('15')
  }}
>
  {#snippet template(args)}
    <IconButton {...args} aria-label="regular" />
    <IconButton {...args} small aria-label="small" />
  {/snippet}
</Story>

<Story name="Empty" tags={['empty']} args={{ name: 'arrow-right' }} />

<style>
  :global(.iconbutton-demo-inset) {
    margin: 1rem;
  }
</style>
