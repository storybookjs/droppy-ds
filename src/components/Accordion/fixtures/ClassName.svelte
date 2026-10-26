<script lang="ts">
  import Accordion, { type AccordionProps } from '../Accordion.svelte'

  let args: AccordionProps = $props()
</script>

<Accordion {...args} />

<style>
  :global(.accordion-demo-inset) {
    margin: 1rem;
  }
</style>
