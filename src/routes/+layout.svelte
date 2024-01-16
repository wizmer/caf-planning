<script>
	// Most of your app wide CSS should be put in this file
	import { dev, browser } from '$app/environment';
	import '../app.postcss';
	import { AppShell, AppBar, LightSwitch, Toast, initializeStores } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import '../app.postcss';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

</script>

<Toast />

<AppShell>
	  <svelte:fragment slot="header">
        <AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
	          <!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
	      		<h1 class="h1 text-center">Planning des créneaux libres</h1>
			     	<svelte:fragment slot="trail">
                <LightSwitch />
            </svelte:fragment>
        </AppBar>
	  </svelte:fragment>
	  <slot />
</AppShell>
