<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, waitFor } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Button } from '../Button'
  import { Separator } from '../Separator'

  import ScrollArea, { type ScrollAreaProps } from './ScrollArea.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ScrollAreaProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const PARAGRAPHS = [
    `Vernacular architecture is building done outside any academic tradition, and without professional guidance. It is not a particular architectural movement or style, but rather a broad category encompassing a wide range of building types, with differing methods of construction, from around the world, both historical and modern.`,
    `This type of architecture usually serves immediate, local needs, is constrained by the materials available in its particular region and reflects local traditions and cultural practices. More recently it has been examined by designers and the building industry in an effort to be more energy conscious with contemporary design and construction.`,
    `Vernacular architecture constitutes the majority of the world's built environment, as measured against the small percentage of new buildings every year designed by architects and built by engineers.`,
  ]

  const LONG_ORDER = [
    { name: 'Cheeseburger', quantity: 2, price: 8.5 },
    { name: 'Fries', quantity: 2, price: 2.5 },
    { name: 'Coca-Cola', quantity: 3, price: 1.75 },
    { name: 'Sprite', quantity: 1, price: 1.5 },
    { name: 'Vanilla ice cream', quantity: 2, price: 2 },
    { name: 'Garlic bread', quantity: 1, price: 4 },
    { name: 'Sparkling water', quantity: 2, price: 2.5 },
    { name: 'Tiramisu', quantity: 1, price: 5.5 },
  ]

  const ORDER_TOTAL = LONG_ORDER.reduce((sum, line) => sum + line.price * line.quantity, 0)

  const cartEuros = (amount: number) =>
    amount.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR' })

  const { Story } = defineMeta({
    title: 'Layout & structure/ScrollArea',
    component: ScrollArea,
    args: { children: prose },
    argTypes: {
      children: { control: false, description: 'The content that overflows.' },
      orientation: {
        control: 'radio',
        options: ['vertical', 'horizontal', 'both'],
        description:
          '`vertical`/`horizontal` render one scrollbar; `both` renders one of each plus the corner.',
      },
      class: {
        control: 'text',
        description:
          'Merged onto the root alongside the component’s own `droppy-ScrollArea` class.',
      },
    },
  })
</script>

<!-- Three paragraphs of prose — overflows vertically. -->
{#snippet prose()}
  <div>
    {#each PARAGRAPHS as text (text)}
      <p>{text}</p>
    {/each}
  </div>
{/snippet}

<!-- A 20-column grid of 100 cells — overflows both axes. -->
{#snippet wideGrid()}
  <ul style="display: grid; grid-template-columns: repeat(20, 4rem); margin: 0; padding: 0">
    {#each { length: 100 }, index (index)}
      <li style="list-style: none; padding: 0.5rem">{index + 1}</li>
    {/each}
  </ul>
{/snippet}

<!-- A row of twelve cards — overflows horizontally only. -->
{#snippet cards(bordered: boolean)}
  <div style="display: flex; gap: 1rem">
    {#each { length: 12 }, index (index)}
      <div
        style="flex: 0 0 auto; width: 8rem{bordered
          ? '; height: 4rem; display: flex; align-items: center; justify-content: center; border: 1px solid var(--ds-color-border-subtle)'
          : ''}"
      >
        Card {index + 1}
      </div>
    {/each}
  </div>
{/snippet}

{#snippet cardRow()}{@render cards(true)}{/snippet}
{#snippet plainCardRow()}{@render cards(false)}{/snippet}

<!--
  A fixed-height panel of long text, with a themed scrollbar revealed on hover
  or while scrolling. `orientation` is set below, so the controls start
  populated.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ orientation: 'vertical' }}
  argTypes={hide('class')}
/>

<!-- api-ref — one story per prop -->

<!-- `children` are whatever overflows; sizing comes from the theme layer. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('orientation', 'class')}
  args={{ children: prose }}
/>

<!-- `orientation` picks which axes get a scrollbar. -->
<Story name="Orientation" tags={['api-ref']} argTypes={hide('orientation', 'class')}>
  {#snippet template(args)}
    <div style="display: grid; gap: 1rem">
      <ScrollArea {...args} orientation="vertical" />
      <ScrollArea {...args} orientation="horizontal" children={cardRow} />
      <ScrollArea {...args} orientation="both" children={wideGrid} />
    </div>
  {/snippet}
</Story>

<!--
  `className` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  name="ClassName"
  tags={['api-ref']}
  argTypes={hide('orientation')}
  args={{ class: 'scrollarea-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  Content overflowing both axes renders a scrollbar on each, plus the corner
  where the two tracks would otherwise intersect — the part that stops them
  overlapping at the meeting point.
-->
<Story
  name="BothAxes"
  tags={['highlight']}
  argTypes={hide('class')}
  args={{ orientation: 'both', children: wideGrid }}
/>

<!-- anatomy — the rendered part tree -->

<!-- Root, viewport, content, and a scrollbar with its thumb per axis. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('children', 'orientation', 'class')}
  args={{ orientation: 'both', children: wideGrid }}
  parameters={{
    anatomy: {
      parts: [
        { id: 'root', name: 'Root', description: 'The clipped box; sizing comes from the theme.' },
        { id: 'viewport', name: 'Viewport', description: 'The scrolling window.' },
        { id: 'content', name: 'Content', description: 'The wrapper the viewport scrolls.' },
        {
          id: 'scrollbar',
          name: 'Scrollbar',
          description: 'One per axis; only mounted once the content actually overflows.',
        },
        { id: 'thumb', name: 'Thumb', description: 'The draggable handle inside each scrollbar.' },
        {
          id: 'corner',
          name: 'Corner',
          description: 'Only with `orientation="both"` — where the two tracks meet.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- A long Mealdrop order scrolling above a pinned total. -->
<Story
  name="MealdropCartScroll"
  tags={['examples']}
  argTypes={hide('children', 'orientation', 'class')}
>
  {#snippet template()}
    <div
      style="display: flex; flex-direction: column; width: 22rem; border: 1px solid var(--ds-color-border-subtle); border-radius: 8px; overflow: hidden"
    >
      <div style="padding: 1rem">
        <Body fontWeight="bold">Your order</Body>
      </div>
      <Separator />

      <ScrollArea class="mealdrop-cart-scroll">
        <div style="display: grid; gap: 0.75rem">
          {#each LONG_ORDER as line (line.name)}
            <div style="display: flex; justify-content: space-between; gap: 1rem">
              <Body size="S">{line.quantity}× {line.name}</Body>
              <Body size="S" fontWeight="bold">{cartEuros(line.price * line.quantity)}</Body>
            </div>
          {/each}
        </div>
      </ScrollArea>

      <Separator />
      <div style="display: grid; gap: 0.75rem; padding: 1rem">
        <div style="display: flex; justify-content: space-between">
          <Body fontWeight="bold">Total</Body>
          <Body fontWeight="bold">{cartEuros(ORDER_TOTAL)}</Body>
        </div>
        <Button large>Checkout</Button>
      </div>
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestVerticalScrollbarAppears"
  tags={['tests']}
  play={async ({ canvasElement }) => {
    // The scrollbar mounts after Bits UI's overflow measurement effect runs,
    // so it isn't there on first paint — re-query inside waitFor.
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="vertical"]')).not.toBeNull()
    })
  }}
/>

<Story
  name="TestBothAxesRenderTwoScrollbars"
  tags={['tests']}
  args={{ orientation: 'both', children: wideGrid }}
  play={async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="vertical"]')).not.toBeNull()
    })
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
    })
  }}
/>

<Story
  name="TestHorizontalOnlyOmitsVertical"
  tags={['tests']}
  args={{ orientation: 'horizontal', children: plainCardRow }}
  play={async ({ canvasElement }) => {
    await waitFor(() => {
      expect(canvasElement.querySelector('[data-orientation="horizontal"]')).not.toBeNull()
    })
    await expect(canvasElement.querySelector('[data-orientation="vertical"]')).toBeNull()
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.scrollarea-demo-inset) {
    margin: 1rem;
  }

  /* The theme layer hard-codes the root at 24rem x 8.5rem, so the panel sizes
     it rather than being clipped by it. */
  :global(.mealdrop-cart-scroll) {
    width: 100%;
    height: 14rem;
    background: transparent;
  }
</style>
