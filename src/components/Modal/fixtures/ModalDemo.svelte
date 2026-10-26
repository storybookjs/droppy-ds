<!-- A trigger plus a Modal whose open state starts at the `isOpen` arg. -->
<script lang="ts">
  import { Button } from '../../Button'
  import Modal, { type ModalProps } from '../Modal.svelte'

  let { isOpen: initialOpen, onClose, ...args }: ModalProps = $props()

  // Writable derived: follows the arg when the control changes, and can
  // still be set locally by the demo's own interactions.
  let isOpen = $derived(initialOpen)
</script>

<div style="padding: 1rem">
  <Button onclick={() => (isOpen = true)}>Open modal</Button>
  <Modal
    {...args}
    {isOpen}
    onClose={() => {
      isOpen = false
      onClose()
    }}
  />
</div>
