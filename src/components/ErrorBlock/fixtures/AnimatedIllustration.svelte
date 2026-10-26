<!--
  Mealdrop's own Lottie illustrations, copied from the app — the player and the
  JSON are application assets, so they live with these stories rather than
  shipping in the package. `chromatic-ignore` keeps the animation out of
  visual regression, since a looping frame is never the same twice.
-->
<script lang="ts">
  import lottie from 'lottie-web'

  let { animation }: { animation: object } = $props()

  let host = $state<HTMLElement | null>(null)

  $effect(() => {
    if (!host) return
    const player = lottie.loadAnimation({
      container: host,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: animation,
    })
    return () => player.destroy()
  })
</script>

<span class="chromatic-ignore">
  <span bind:this={host} style="display: block; width: 320px; height: 240px"></span>
</span>
