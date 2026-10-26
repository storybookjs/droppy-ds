<script module lang="ts">
  import type { TextOrSnippet } from '../../utils/text'

  export type AccordionItem = {
    /** Identifies this item in `value`/`defaultValue`/`onValueChange`. Falls back to the item's index. */
    value?: string
    /** Rendered inside the header trigger, alongside the expand/collapse icon. */
    title: TextOrSnippet
    /** Rendered inside the panel when the item is open. */
    content: TextOrSnippet
    disabled?: boolean
  }

  export type AccordionProps = {
    items: AccordionItem[]
    /** Allows more than one item to stay open at once. */
    openMultiple?: boolean
    defaultValue?: string[]
    value?: string[]
    onValueChange?: (value: string[]) => void
    class?: string
  }
</script>

<script lang="ts">
  import { Accordion as BitsAccordion } from 'bits-ui'

  import theme from '../../theme'
  import { cx } from '../../utils/cx'

  /**
   * A stack of collapsible sections, each labelled by a header — an FAQ list,
   * a set of grouped filters, a details panel with several independent parts.
   *
   * Bits UI's `Accordion` supplies the expand/collapse behaviour, the measured
   * panel height and the `data-starting-style`/`data-ending-style` transition
   * hooks; this covers the common case of a static list of items with a title
   * and content each.
   */
  let {
    items,
    openMultiple = false,
    defaultValue,
    value,
    onValueChange,
    class: className,
  }: AccordionProps = $props()

  // svelte-ignore state_referenced_locally
  let internal = $state<string[]>(defaultValue ?? [])
  const open = $derived(value !== undefined ? value : internal)

  const setOpen = (next: string[]) => {
    if (next.length === open.length && next.every((v, i) => v === open[i])) return
    // Controlled: report only — the caller's state decides what is open.
    if (value === undefined) internal = next
    onValueChange?.(next)
  }

  /* Bits UI's single mode takes a string, multiple mode an array; the public
     API is always an array, as in the React build. */
  const getSingle = () => open[0] ?? ''
  const setSingle = (next: string) => setOpen(next ? [next] : [])
  const getMultiple = () => open
  const setMultiple = (next: string[]) => setOpen(next)

  const keyOf = (item: AccordionItem, index: number) => item.value ?? String(index)

  /* No arrow-key roving between headers (the current W3C APG pattern, as the
     React build had): cancelling these keys stops Bits UI's handler. */
  const ROVING_KEYS = new Set(['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'])

  /* A disabled trigger stays focusable but never toggles. */
  const keydownFor = (disabled: boolean | undefined) => (event: KeyboardEvent) => {
    if (ROVING_KEYS.has(event.key)) event.preventDefault()
    if (disabled && (event.key === 'Enter' || event.key === ' ')) event.preventDefault()
  }
  const blockClick = (event: MouseEvent) => event.preventDefault()

  /**
   * Each panel's natural height, measured from its content part (which is never
   * height-constrained) and written to `--accordion-panel-height` for the theme
   * to transition — the role Base UI's measured panel height played.
   */
  let contentHeights = $state<Record<string, number>>({})
  const panelHeight = (value: string) => {
    const height = contentHeights[value]
    return height ? `${height}px` : 'auto'
  }
</script>

{#snippet text(content: TextOrSnippet)}
  {#if typeof content === 'string'}{content}{:else}{@render content?.()}{/if}
{/snippet}

{#snippet itemList()}
  {#each items as item, index (keyOf(item, index))}
    {@const itemValue = keyOf(item, index)}
    {@const isOpen = open.includes(itemValue)}
    <BitsAccordion.Item
      data-part="item"
      value={itemValue}
      class={theme.AccordionItem}
      data-open={isOpen ? '' : undefined}
      data-panel-open={isOpen ? '' : undefined}
      data-disabled={item.disabled ? '' : undefined}
    >
      <BitsAccordion.Header level={3}>
        {#snippet child({ props })}
          <h3 {...props} data-part="header" class={theme.AccordionHeader}>
            <BitsAccordion.Trigger
              data-part="trigger"
              class={theme.AccordionTrigger}
              data-panel-open={isOpen ? '' : undefined}
              data-disabled={item.disabled ? '' : undefined}
              onclick={item.disabled ? blockClick : undefined}
              onkeydown={keydownFor(item.disabled)}
            >
              {#snippet child({ props: triggerProps })}
                <!-- Rendered by hand so `aria-disabled` survives: Bits UI writes
                     its own (false) after spread props, and a disabled trigger
                     stays focusable here, as Base UI's did. -->
                <button
                  {...triggerProps}
                  aria-disabled={item.disabled
                    ? 'true'
                    : (triggerProps['aria-disabled'] as 'true' | 'false' | undefined)}
                >
                  {@render text(item.title)}
                  <!-- Must stay a direct child of the trigger for the theme's
                   `[data-panel-open] > .AccordionIcon` rotation to match. -->
                  <svg
                    data-part="icon"
                    class={theme.AccordionIcon}
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="square"
                    stroke-linejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M1.5 8h13M8 14.5v-13" />
                  </svg>
                </button>
              {/snippet}
            </BitsAccordion.Trigger>
          </h3>
        {/snippet}
      </BitsAccordion.Header>
      <BitsAccordion.Content>
        {#snippet child({ props, open: panelOpen })}
          {#if panelOpen || props['data-ending-style'] !== undefined}
            <div
              {...props}
              data-part="panel"
              class={theme.AccordionPanel}
              data-open={panelOpen ? '' : undefined}
              data-closed={panelOpen ? undefined : ''}
              style="{props.style ?? ''}; --accordion-panel-height: {panelHeight(itemValue)}"
            >
              <div
                data-part="content"
                class={theme.AccordionContent}
                bind:offsetHeight={contentHeights[itemValue]}
              >
                {@render text(item.content)}
              </div>
            </div>
          {/if}
        {/snippet}
      </BitsAccordion.Content>
    </BitsAccordion.Item>
  {/each}
{/snippet}

{#if openMultiple}
  <BitsAccordion.Root
    type="multiple"
    data-part="root"
    class={cx(theme.AccordionRoot, 'droppy-Accordion', className)}
    bind:value={getMultiple, setMultiple}
  >
    {@render itemList()}
  </BitsAccordion.Root>
{:else}
  <BitsAccordion.Root
    type="single"
    data-part="root"
    class={cx(theme.AccordionRoot, 'droppy-Accordion', className)}
    bind:value={getSingle, setSingle}
  >
    {@render itemList()}
  </BitsAccordion.Root>
{/if}
