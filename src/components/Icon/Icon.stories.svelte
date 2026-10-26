<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Button } from '../Button'
  import { Heading } from '../Heading'

  import Icon, { type IconProps } from './Icon.svelte'
  import { iconNames } from './icons'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof IconProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const SIZES = ['1rem', '1.5rem', '2rem', '3rem']

  const toCurrency = (amount: number) =>
    amount.toLocaleString(undefined, { style: 'currency', currency: 'EUR' })

  const { Story } = defineMeta({
    title: 'Media & content/Icon',
    component: Icon,
    args: { name: 'cart' },
    argTypes: {
      name: { control: 'select', options: iconNames, description: 'Which icon to render.' },
      size: { control: 'text', description: 'Rendered width and height. Defaults to `1.5rem`.' },
      color: {
        control: 'text',
        description: 'Overrides the stroke colour. Defaults to the theme’s icon token.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Icon` class.',
      },
    },
  })
</script>

<!--
  One glyph from the set. Name and size are set below, so the controls start
  populated — pick another icon from the dropdown or change the size.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{ name: 'cart', size: '1.5rem' }}
  argTypes={hide('color', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `name` picks from the bundled set — every icon in it, below. -->
<Story name="Name" tags={['api-ref']} argTypes={hide('name', 'color', 'class')}>
  {#snippet template(args)}
    <div style="display: flex; gap: 1.5rem; flex-wrap: wrap">
      {#each iconNames as name (name)}
        <div style="text-align: center; font-size: 0.75rem; width: 5rem">
          <Icon {...args} {name} size="2rem" style="margin: 0 auto 0.5rem" />
          {name}
        </div>
      {/each}
    </div>
  {/snippet}
</Story>

<!-- `size` sets width and height together; numbers and CSS lengths both work. -->
<Story name="Size" tags={['api-ref']} argTypes={hide('size', 'color', 'class')}>
  {#snippet template(args)}
    <div style="display: flex; gap: 1rem; align-items: center">
      {#each SIZES as size (size)}
        <Icon {...args} {size} />
      {/each}
    </div>
  {/snippet}
</Story>

<!-- `color` overrides the stroke, for the cases the icon token doesn't cover. -->
<Story
  name="Color"
  tags={['api-ref']}
  argTypes={hide('class')}
  args={{ color: 'var(--ds-color-text-error)', size: '2rem' }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('color')}
  args={{ class: 'icon-demo-inset', size: '2rem' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  Icons are decorative by default: `aria-hidden` and `focusable="false"`, so
  they never reach the accessibility tree. The control an icon sits inside is
  what carries the accessible name — see `IconButton`'s `aria-label`.
-->
<Story
  exportName="DecorativeByDefault"
  name="Decorative By Default"
  tags={['highlight']}
  argTypes={hide('color', 'class')}
>
  {#snippet template(args)}
    <button type="button" aria-label="Add to cart" style="padding: 0.5rem">
      <Icon {...args} />
    </button>
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- A single part: one `<svg>`, its paths supplied by `name`. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('name', 'size', 'color', 'class')}
  args={{ size: '3rem' }}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The `aria-hidden` `<svg>` carrying the viewBox, the stroke colour, and the size.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!--
  Mealdrop's header, where every icon reaches the page through a control's
  `icon` prop rather than a bare `Icon`. Mealdrop's Header is styled-components
  with a `breakpoints.M` query; the same rules are inlined so the story is a
  port, not a lookalike.
-->
<Story
  exportName="MealdropHeader"
  name="Mealdrop Header"
  tags={['examples']}
  argTypes={hide('name', 'color', 'size')}
  parameters={{ layout: 'fullscreen' }}
>
  {#snippet template()}
    <header class="mealdrop-header">
      <Heading level={2} size={4}>Mealdrop</Heading>

      <div class="mealdrop-header-options">
        <span class="mealdrop-header-nav">
          <Button round clear icon="sun" aria-label="turn on dark mode" />
          <Button clear>Home</Button>
          <Button clear>All restaurants</Button>
        </span>
        <Button icon="cart" aria-label="food cart">
          <!-- Mealdrop colours these spans from the button's own text token;
               `inherit` is the same thing without naming a second token. -->
          <Body type="span" color="inherit">Order</Body>
          <Body type="span" color="inherit" fontWeight="bold">{toCurrency(24.75)}</Body>
        </Button>
      </div>
    </header>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestIsDecorative"
  name="Test Is Decorative"
  tags={['tests']}
  play={async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon')

    await expect(icon).toHaveAttribute('aria-hidden', 'true')
    await expect(icon).toHaveAttribute('focusable', 'false')
  }}
/>

<Story
  exportName="TestSizeAppliesToBothAxes"
  name="Test Size Applies To Both Axes"
  tags={['tests']}
  args={{ size: '2rem' }}
  play={async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon') as SVGElement

    // `minWidth` is what stops a flex parent squeezing the glyph.
    await expect(icon.style.width).toBe('2rem')
    await expect(icon.style.height).toBe('2rem')
    await expect(icon.style.minWidth).toBe('2rem')
  }}
/>

<Story
  exportName="TestColorOverridesStroke"
  name="Test Color Overrides Stroke"
  tags={['tests']}
  args={{ color: 'rgb(183, 28, 28)' }}
  play={async ({ canvasElement }) => {
    const icon = canvasElement.querySelector('.droppy-Icon') as SVGElement

    await expect(getComputedStyle(icon).stroke).toBe('rgb(183, 28, 28)')
  }}
/>

<Story name="Empty" tags={['empty']} args={{ name: 'cart' }} />

<style>
  :global(.icon-demo-inset) {
    margin: 1rem;
  }

  .mealdrop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 56px;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--ds-color-border-subtle);
    background: var(--ds-color-surface-page);
  }
  .mealdrop-header-options {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }
  .mealdrop-header-nav {
    display: none;
  }
  @media (min-width: 768px) {
    .mealdrop-header {
      height: 72px;
    }
    .mealdrop-header-nav {
      display: contents;
    }
  }
</style>
