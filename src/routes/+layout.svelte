<script lang="ts">
	// Most of your app wide CSS should be put in this file
	import icon from '$lib/assets/big-icon.png';
	import { createToaster, Toast } from '@skeletonlabs/skeleton-svelte';
	import '../app.css';

	import { page } from '$app/state';
	import LightSwitch from '$lib/components/LightSwitch.svelte';
	import { user } from '$lib/stores.svelte';
	import { Calendar, Library } from '@lucide/svelte';
	import ModalLogin from './ModalLogin.svelte';
	import { routes } from './routes';

	let { data, children } = $props();
	const toaster = createToaster();
</script>

<nav class="bg-primary-100-900">
	<div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
		<a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img src={icon} class="h-8" alt="CAF Logo" />
			<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"
				>Planning</span
			>
		</a>

		<div class="flex flex-row items-stretch gap-4 flex-wrap">
			<a
				href={routes.planning}
				class="hover:underline p-2 rounded"
				class:active={page.url.pathname.startsWith(routes.planning)}
			>
				<Calendar class="inline" />
				Planning</a
			>
			<a
				href={routes.gym + '/2'}
				class="hover:underline p-2 rounded"
				class:active={page.url.pathname.startsWith(routes.gym)}
			>
				<Library class="inline" />
				Espace Pan</a
			>
			{#if $user}
				<button
					class="btn border"
					onclick={() => {
						$user = '';
					}}
				>
					{$user}: Se deconnecter
				</button>
			{:else}
				<ModalLogin referents={data.referents} />
			{/if}
			<LightSwitch />
		</div>
	</div>
</nav>

<div class="container">
	{@render children?.()}
</div>

<div class="flex flex-row justify-center">
	<div>
		Vous cherchez <a href="/admin" class="font-medium hover:underline">l'espace admin ?</a>
	</div>
</div>

<Toast.Group {toaster}>
	{#snippet children(toast)}
		<Toast {toast}>
			<Toast.Message>
				<Toast.Title>{toast.title}</Toast.Title>
				<Toast.Description>{toast.description}</Toast.Description>
			</Toast.Message>
			<Toast.CloseTrigger />
		</Toast>
	{/snippet}
</Toast.Group>

<style>
	.container {
		max-width: 1200px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.active {
		border-bottom: 1px solid currentColor;
	}
</style>
