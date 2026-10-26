<script lang="ts">
  import Select, { type SelectProps } from '../Select.svelte'

  let args: SelectProps = $props()
</script>

<div style="display: grid; gap: 1rem">
  <Select {...args} label="servings" options={[1, 2, 3]} value={2} />
  <Select {...args} label="delivery window" options={['ASAP', 'Tonight']} value="ASAP" />
</div>
