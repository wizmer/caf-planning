<script>
	// Most of your app wide CSS should be put in this file
	import { dev, browser } from '$app/environment';
	import '../app.postcss';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { AppShell, AppBar, LightSwitch, Toast, initializeStores } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
 /* 	import favicon from '$lib/assets/favicon.png'; */
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	import { goto } from '$app/navigation';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

</script>

<Toast />

<AppShell>
	  <svelte:fragment slot="header">
        <AppBar>
	      		<h1 class="h1">Planning des créneaux libres</h1>
        </AppBar>
	  </svelte:fragment>
	  <slot />
</AppShell>
