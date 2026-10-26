<script lang="ts">
  import Badge, { type BadgeProps } from '../Badge.svelte'

  let args: BadgeProps = $props()
</script>

<Badge {...args} />

<style>
  :global(.badge-demo-inset) {
    margin: 1rem;
  }
</style>
