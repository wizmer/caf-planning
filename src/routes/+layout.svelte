<script lang="ts">
	// Most of your app wide CSS should be put in this file
	import icon from '$lib/assets/big-icon.png';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import {
		AppShell,
		LightSwitch,
		Modal,
		Toast,
		getModalStore,
		initializeStores,
		storePopup,
		type ModalComponent
	} from '@skeletonlabs/skeleton';
	import '../app.postcss';

	import { user } from '$lib/stores';
	import ModalLogin from './ModalLogin.svelte';

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
			<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
				<img src={icon} class="h-8" alt="CAF Logo" />
				<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
					>Planning</span
				>
			</a>

			<div class="flex flex-row items-center gap-4">
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
				<LightSwitch />
			</div>
		</div>
	</nav>

	<slot />
	<svelte:fragment slot="pageFooter">
		<div class="flex flex-row justify-center">
			<div>
				Vous cherchez <a
					href="/admin"
					class="font-medium text-blue-600 dark:text-blue-500 hover:underline">l'espace admin ?</a
				>
			</div>
		</div>
	</svelte:fragment>
</AppShell>
