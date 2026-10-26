<script lang="ts">
  import type { ModalProps } from '../Modal.svelte'
  import ModalDemo from './ModalDemo.svelte'

  let args: ModalProps = $props()
</script>

<div id="modal-container-demo"></div>
<ModalDemo {...args} />
