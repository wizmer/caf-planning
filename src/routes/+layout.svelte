<script>
	// Most of your app wide CSS should be put in this file
	import { dev, browser } from '$app/environment';
	import '../app.postcss';
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import { AppShell, AppBar, LightSwitch, Toast, initializeStores } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import icon from '$lib/assets/big-icon.png';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	import { goto } from '$app/navigation';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

</script>

<Toast />
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
	<svelte:fragment slot="header">
		<AppBar background="variant-filled-primary">
			<svelte:fragment slot="lead">
					<img src={icon} alt="icon-caf" class="w-12" />
					<h1 class="h1">Planning des creneaux libres</h1>
			</svelte:fragment>
			<LightSwitch />

		</AppBar>
	</svelte:fragment>

	<slot />
</AppShell>
