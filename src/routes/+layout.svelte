<script lang="ts">
	// Most of your app wide CSS should be put in this file
	import '../app.postcss';
	import { AppShell, Toast, initializeStores } from '@skeletonlabs/skeleton';
	import icon from '$lib/assets/big-icon.png';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import '../app.postcss';
	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';

	import ModalLogin from './ModalLogin.svelte';
	import { user } from '$lib/stores';

	initializeStores();
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let data;

	const modalStore = getModalStore();
	const modalRegistry: Record<string, ModalComponent> = {
		modalLogin: { ref: ModalLogin, props: { referents: data.referents } }
	};
</script>

<Toast />
<Modal components={modalRegistry} />

<AppShell>
	<nav class="bg-primary border-gray-200 dark:bg-gray-900">
		<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
			<a href="https://flowbite.com" class="flex items-center space-x-3 rtl:space-x-reverse">
				<img src={icon} class="h-8" alt="CAF Logo" />
				<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
					>Planning</span
				>
			</a>

			{#if $user}
				<button
					class="btn border"
					on:click={() => {
						$user = '';
					}}
				>
					{$user}: Se deconnecter
				</button>
			{:else}
				<button
					class="btn border"
					on:click={() =>
						modalStore.trigger({
							type: 'component',
							component: 'modalLogin'
						})}
				>
					Espace staff
				</button>
			{/if}
		</div>
	</nav>

	<slot />
</AppShell>
