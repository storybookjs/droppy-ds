<script lang="ts">
  import Input, { type InputProps } from '../Input.svelte'

  let args: InputProps = $props()
</script>

<Input {...args} label="Street" error="Enter a street" />
<Input {...args} label="City" />
