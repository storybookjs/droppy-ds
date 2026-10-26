<script module lang="ts">
  import type { AnatomyParameters } from '@component-anatomy/storybook'
  import { defineMeta, type Decorator } from '@storybook/svelte'
  import { expect } from 'storybook/test'

  import BorderedBox from '../../utils/BorderedBox.svelte'
  import { Badge } from '../Badge'
  import { Heading } from '../Heading'

  import Body, { type BodyProps } from './Body.svelte'

  /** Hides props that aren't a story's point, so its controls stay actionable. */
  const hide = (...props: Array<keyof BodyProps>) =>
    Object.fromEntries(props.map((prop) => [prop, { table: { disable: true } }]))

  /** Drops the `children` arg, so the template's own content renders instead. */
  const withoutChildren = ({ children: _children, ...rest }: BodyProps) => rest

  /** A bordered parent, so the margin the ClassName demo adds is actually visible. */
  const inBorderedBox: Decorator = () => ({ Component: BorderedBox })

  const { Story } = defineMeta({
    title: 'Typography/Body',
    component: Body,
    args: { children: 'The kitchen closes at 10pm, last orders 9:30.' },
    argTypes: {
      children: { control: 'text', description: 'The text, or any nodes to render inside.' },
      size: {
        control: 'radio',
        options: [undefined, 'S', 'XS', 'XXS'],
        description: 'Visual size step. Absent renders the base body size.',
      },
      fontWeight: {
        control: 'radio',
        options: ['regular', 'medium', 'bold', 'black'],
        description: 'Font weight, independent of `size` and `type`.',
      },
      type: {
        control: 'radio',
        options: ['p', 'span', 'label', 'figcaption'],
        description: 'The rendered element.',
      },
      color: {
        control: 'text',
        description: 'Overrides the text color inline. Unset, follows the primary text token.',
      },
      class: {
        control: 'text',
        description: 'Merged onto the root alongside the component’s own `droppy-Body` class.',
      },
    },
  })
</script>

<!--
  A line of body copy at the base size. Every prop that shapes the text is set
  below, so the controls start populated — change the size step, the weight, or
  the element it renders as.
-->
<Story
  name="Default"
  tags={['showcase']}
  args={{
    children: 'The kitchen closes at 10pm, last orders 9:30.',
    size: undefined,
    fontWeight: 'regular',
    type: 'p',
  }}
  argTypes={hide('color', 'class')}
/>

<!-- api-ref — one story per prop -->

<!-- `children` takes nodes as well as strings, so inline markup composes. -->
<Story name="Children" tags={['api-ref']} argTypes={hide('size', 'fontWeight', 'color', 'class')}>
  {#snippet template(args)}
    <Body {...withoutChildren(args)}
      >Delivery is <strong>free</strong> over €20 — <em>today only</em>.</Body
    >
  {/snippet}
</Story>

<!-- `size` picks the type-scale step, leaving the element and weight alone. -->
<Story name="Sizes" tags={['api-ref']} argTypes={hide('size', 'color', 'class')}>
  {#snippet template(args)}
    {@const rest = withoutChildren(args)}
    <Body {...rest}>Base</Body>
    <Body {...rest} size="S">S</Body>
    <Body {...rest} size="XS">XS</Body>
    <Body {...rest} size="XXS">XXS</Body>
  {/snippet}
</Story>

<!-- `fontWeight` is independent of both size and element. -->
<Story name="Weights" tags={['api-ref']} argTypes={hide('fontWeight', 'color', 'class')}>
  {#snippet template(args)}
    {@const rest = withoutChildren(args)}
    <Body {...rest} fontWeight="regular">Regular</Body>
    <Body {...rest} fontWeight="medium">Medium</Body>
    <Body {...rest} fontWeight="bold">Bold</Body>
    <Body {...rest} fontWeight="black">Black</Body>
  {/snippet}
</Story>

<!-- `type` picks which element is rendered — all four share the same styling. -->
<Story
  exportName="ElementChoice"
  name="Element Choice"
  tags={['api-ref']}
  argTypes={hide('type', 'color', 'class')}
>
  {#snippet template(args)}
    {@const rest = withoutChildren(args)}
    <Body {...rest} type="p">p</Body>
    <Body {...rest} type="span">span</Body>
    <Body {...rest} type="label">label</Body>
    <Body {...rest} type="figcaption">figcaption</Body>
  {/snippet}
</Story>

<!-- `color` overrides the text token inline, for the cases the scale doesn't cover. -->
<Story
  exportName="ColorOverride"
  name="Color Override"
  tags={['api-ref']}
  argTypes={hide('size', 'fontWeight', 'class')}
  args={{ color: 'var(--ds-color-text-error)', children: 'Delivery unavailable at this address.' }}
/>

<!--
  `class` merges with the component's own class rather than replacing it.
  The demo class adds a margin, visible as the gap inside the bordered parent.
-->
<Story
  exportName="ClassName"
  name="Class Name"
  tags={['api-ref']}
  argTypes={hide('size', 'fontWeight', 'color')}
  args={{ class: 'body-demo-inset' }}
  decorators={[inBorderedBox]}
/>

<!-- highlight — features and behaviours worth calling out -->

<!--
  `type` renders a real element, not a styled `span` — `label` gives you a
  `<label>` that can be associated with a control.
-->
<Story
  exportName="RendersMatchingTag"
  name="Renders Matching Tag"
  tags={['highlight']}
  argTypes={hide('size', 'fontWeight', 'color', 'class')}
  args={{ type: 'label', children: 'Delivery address' }}
/>

<!-- anatomy — the rendered part tree -->

<!-- A single part, whose tag follows `type`. -->
<Story
  name="Anatomy"
  tags={['anatomy']}
  argTypes={hide('size', 'fontWeight', 'type', 'color', 'class')}
  parameters={{
    anatomy: {
      parts: [
        {
          id: 'root',
          name: 'Root',
          description:
            'The rendered element — `<p>`, `<span>`, `<label>`, or `<figcaption>` per `type`.',
        },
      ],
    } satisfies AnatomyParameters,
  }}
/>

<!-- examples — Mealdrop / DropBoard compositions -->

<!-- The text column of a restaurant tile. -->
<Story
  exportName="MealdropRestaurantCardText"
  name="Mealdrop Restaurant Card Text"
  tags={['examples']}
  argTypes={hide('children', 'size', 'fontWeight', 'type', 'color', 'class')}
>
  {#snippet template()}
    <div style="display: grid; gap: 0.5rem; max-width: 18rem">
      <Heading level={2} size={4}>Burger Kingdom</Heading>
      <Body size="S">Nicest place for burgers</Body>
      <div style="display: flex; align-items: center; gap: 0.5rem">
        <Body size="XS" fontWeight="medium">Serves</Body>
        <Badge text="burgers" />
        <Badge text="comfort food" />
      </div>
      <Body size="XXS">Delivers in 25–35 min · €2.50 delivery · Staalstraat 12, Amsterdam</Body>
    </div>
  {/snippet}
</Story>

<!-- tests — assertions only, one behaviour each -->

<Story
  exportName="TestRendersMatchingTag"
  name="Test Renders Matching Tag"
  tags={['tests']}
  args={{ type: 'label', children: 'Delivery address' }}
  play={async ({ canvas }) => {
    await expect(canvas.getByText('Delivery address').tagName).toBe('LABEL')
  }}
/>

<Story
  exportName="TestSizeAndWeightAreIndependent"
  name="Test Size And Weight Are Independent"
  tags={['tests']}
  play={async ({ canvas }) => {
    const regular = canvas.getByText('Small regular')
    const bold = canvas.getByText('Small bold')

    await expect(getComputedStyle(regular).fontSize).toBe(getComputedStyle(bold).fontSize)
    await expect(getComputedStyle(regular).fontWeight).not.toBe(getComputedStyle(bold).fontWeight)
  }}
>
  {#snippet template()}
    <Body size="XS">Small regular</Body>
    <Body size="XS" fontWeight="bold">Small bold</Body>
  {/snippet}
</Story>

<Story
  exportName="TestColorOverridesToken"
  name="Test Color Overrides Token"
  tags={['tests']}
  args={{ color: 'rgb(10, 125, 50)', children: 'Delivered' }}
  play={async ({ canvas }) => {
    await expect(getComputedStyle(canvas.getByText('Delivered')).color).toBe('rgb(10, 125, 50)')
  }}
/>

<Story name="Empty" tags={['empty']} args={{ children: 'Body text' }} />

<style>
  :global(.body-demo-inset) {
    margin: 1rem;
  }
</style>
