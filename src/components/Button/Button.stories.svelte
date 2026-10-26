<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect, fn, userEvent } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Body } from '../Body'
  import { Card } from '../Card'
  import { Heading } from '../Heading'
  import { iconNames } from '../Icon'
  import { Separator } from '../Separator'

  import Button, { type ButtonProps } from './Button.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof ButtonProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Actions/Button',
    component: Button,
    args: { children: 'Order now', onclick: fn() },
    argTypes: {
      children: { control: 'text', description: 'The label. Omit it for an icon-only button.' },
      clear: { control: 'boolean', description: 'Strips the fill, leaving just the label.' },
      large: { control: 'boolean', description: 'Taller padding, for primary calls to action.' },
      round: {
        control: 'boolean',
        description: 'Fully rounded, for icon-only affordances like a close button.',
      },
      icon: {
        control: 'select',
        options: [undefined, ...iconNames],
        description: 'Renders an icon before the label.',
      },
      iconSize: { control: 'number', description: 'Overrides the icon’s rendered size.' },
      disabled: { control: 'boolean', description: 'Blocks the click and dims the control.' },
      onclick: { description: 'Fired on click. Never fires while `disabled`.' },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Button` class.',
      },
    },
  })
</script>

<!--
  The primary call to action. Every variant prop is set below, so the controls
  start populated — flip `clear`, `large`, or `round`, or pick an icon.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{
    children: 'Order now',
    clear: false,
    large: false,
    round: false,
    icon: undefined,
    disabled: false,
  }}
  argTypes={hide('iconSize', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `children` is the label. Omitted, the button is icon-only and needs an `aria-label`. -->
<Story
  name="Children"
  tags={['api-ref']}
  argTypes={hide('clear', 'large', 'round', 'iconSize', 'class')}
  args={{ children: 'Add to basket' }}
/>

<!-- `clear` strips the fill, for the secondary action beside a primary one. -->
<Story
  name="Clear"
  tags={['api-ref']}
  argTypes={hide('large', 'round', 'icon', 'iconSize', 'class')}
  args={{ clear: true, children: 'Not now' }}
/>

<!-- `large` adds height, for the one action a screen is really about. -->
<Story
  name="Large"
  tags={['api-ref']}
  argTypes={hide('clear', 'round', 'icon', 'iconSize', 'class')}
  args={{ large: true }}
/>

<!-- `round` fully rounds the control — pair it with an icon and no label. -->
<Story
  name="Round"
  tags={['api-ref']}
  argTypes={hide('clear', 'large', 'iconSize', 'class')}
  args={{ round: true, clear: true, icon: 'cross', children: undefined, 'aria-label': 'close' }}
/>

<!-- `icon` renders a glyph before the label, spaced with `gap` rather than a spacer node. -->
<Story
  name="Icon"
  exportName="IconProp"
  tags={['api-ref']}
  argTypes={hide('clear', 'large', 'round', 'iconSize', 'class')}
  args={{ icon: 'cart' }}
/>

<!-- `iconSize` overrides the glyph size without touching the button's padding. -->
<Story name="IconSize" tags={['api-ref']} argTypes={hide('clear', 'large', 'round', 'class')}>
  {#snippet template(args)}
    <div style="display: flex; gap: 1rem; align-items: center">
      <Button {...args} icon="cart" />
      <Button {...args} icon="cart" iconSize={32} />
    </div>
  {/snippet}
</Story>

<!-- `disabled` dims the control and stops it firing `onClick`. -->
<Story
  name="Disabled"
  tags={['api-ref']}
  argTypes={hide('clear', 'large', 'round', 'icon', 'iconSize', 'class')}
  args={{ disabled: true }}
/>

<!--
  `className` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  name="ClassName"
  tags={['api-ref']}
  argTypes={hide('clear', 'large', 'round', 'icon', 'iconSize')}
  args={{ class: 'button-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  An icon-only button has no text to read, so its accessible name has to come
  from `aria-label`. Drop the label without one and the control is unnamed.
-->
<Story
  name="IconOnlyNeedsALabel"
  tags={['highlight']}
  argTypes={hide('iconSize', 'class')}
  args={{ icon: 'cross', round: true, clear: true, children: undefined, 'aria-label': 'close' }}
/>

<!-- The variants side by side — the vocabulary a screen picks from. -->
<Story
  name="Variants"
  tags={['highlight']}
  argTypes={hide('clear', 'large', 'round', 'icon', 'iconSize', 'class')}
>
  {#snippet template(args)}
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center">
      <Button {...args}>Default</Button>
      <Button {...args} large>Large</Button>
      <Button {...args} clear>Clear</Button>
      <Button {...args} icon="cart">With icon</Button>
      <Button {...args} icon="cross" round clear aria-label="close" children={undefined} />
      <Button {...args} disabled>Disabled</Button>
    </div>
  {/snippet}
</Story>

<!-- anatomy — the rendered part tree -->

<!-- The control and its optional leading glyph. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('children', 'clear', 'large', 'round', 'icon', 'iconSize', 'class')}
  args={{ icon: 'cart', children: 'Order now' }}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description: 'The `<button>`: fill, radius, focus ring, and the disabled state.',
        },
        {
          id: 'icon',
          name: 'Icon',
          description: 'The optional leading glyph, spaced from the label with `gap`.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- The action stack in Mealdrop's cart panel. -->
<Story
  name="MealdropCheckoutActions"
  tags={['examples']}
  argTypes={hide('children', 'clear', 'round', 'large', 'icon', 'iconSize', 'disabled', 'onclick')}
>
  {#snippet template()}
    <Card padded style="max-width: 24rem">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <Heading level={3} size={4}>Your order</Heading>
        <Button round clear icon="cross" aria-label="Close cart" />
      </div>

      <div style="display: grid; gap: 0.5rem; margin: 1rem 0">
        <Body size="S">Cheeseburger ×2 — €17.00</Body>
        <Body size="S">Fries ×1 — €2.50</Body>
      </div>

      <Separator />

      <div style="display: flex; justify-content: space-between; margin: 1rem 0">
        <Body fontWeight="bold">Total</Body>
        <Body fontWeight="bold">€19.50</Body>
      </div>

      <div style="display: grid; gap: 0.5rem">
        <Button large icon="cart">Go to checkout</Button>
        <Button clear>Continue shopping</Button>
      </div>
    </Card>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  name="TestClickHandling"
  tags={['tests']}
  play={async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Order now' }))

    await expect(args.onclick).toHaveBeenCalledOnce()
  }}
/>

<Story
  name="TestDisabledSwallowsClicks"
  tags={['tests']}
  args={{ disabled: true }}
  play={async ({ args, canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Order now' }), {
      pointerEventsCheck: 0,
    })

    await expect(args.onclick).not.toHaveBeenCalled()
  }}
/>

<Story
  name="TestIconOnlyIsNamedByAriaLabel"
  tags={['tests']}
  args={{ icon: 'cross', round: true, clear: true, children: undefined, 'aria-label': 'close' }}
  play={async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: 'close' })

    await expect(button).toHaveTextContent('')
  }}
/>

<Story
  name="TestDefaultsToTypeButton"
  tags={['tests']}
  play={async ({ canvas }) => {
    // Without this a button inside a form would submit it by default.
    await expect(canvas.getByRole('button', { name: 'Order now' })).toHaveAttribute(
      'type',
      'button'
    )
  }}
/>

<Story name="Empty" tags={['empty']} />

<style>
  :global(.button-demo-inset) {
    margin: 1rem;
  }
</style>
