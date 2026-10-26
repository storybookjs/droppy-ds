<script lang="ts">
  import type { ModalProps } from '../Modal.svelte'
  import ModalDemo from './ModalDemo.svelte'

  let args: ModalProps = $props()
</script>

<div id="modal-classname-demo"></div>
<ModalDemo {...args} />

<style>
  :global(.modal-demo-inset) {
    margin: 1rem;
  }
</style>
