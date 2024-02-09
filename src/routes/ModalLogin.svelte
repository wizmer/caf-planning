<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	// Stores
	import { last_user, user } from '$lib/stores';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	// Props
	/** Exposes parent props to this component. */
	export let parent: SvelteComponent;

	const modalStore = getModalStore();
	let showPassword = false;

	let current_user = $last_user;

	let failed_login_text = '';

	let password = '';

	let radio = 'existing';

	$: login_enabled = radio === 'existing' ? current_user !== '' : new_user !== '';
	$: connection_string =
		'Se connecter' +
		(login_enabled ? ' en tant que: ' + (radio == 'existing' ? current_user : new_user) : '');

	// We've created a custom submit function to pass the response and close the modal.
	function onFormSubmit(): void {
		//         if ($modalStore[0].response) $modalStore[0].response(formData);
		if (password != 'robert') {
			failed_login_text = 'Mot de passe incorrect';
			return;
		}

		failed_login_text = '';
		if (radio === 'new') {
			create_ref(new_user);
		}
		$user = radio === 'existing' ? current_user : new_user;
		modalStore.close();
	}

	function create_ref(ref) {
		fetch('/api/referent', {
			method: 'POST',
			body: JSON.stringify({ name: ref }),
			headers: {
				'content-type': 'application/json'
			}
		}).then((response) => {
			if (!response.ok) {
				toastStore.trigger({
					message: 'Une erreur est survenue. La page va être rechargée.',
					classes: 'bg-error-500',
					timeout: 10000
				});

				setTimeout(function () {
					window.location.reload(true);
				}, 4000);
			}
		});
	}

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'p-2 space-y-4 rounded-container-token';

	let new_user = '';

	export let referents;
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class={cBase}>
		user: {$user}
		last_user: {$last_user}
		<header class={cHeader}>Referent</header>

		<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
			<RadioItem bind:group={radio} name="justify" value="existing">Utilisateur existant</RadioItem>
			<RadioItem bind:group={radio} name="justify" value="new">Nouvel utilisateur</RadioItem>
		</RadioGroup>

		<form id="login-form" class="modal-form {cForm}">
			{#if radio === 'existing'}
				<ListBox class="border rounded-container-token">
					{#each referents as item}
						<ListBoxItem bind:group={current_user} name={item[0]} value={item[1]}
							>{item[1]}</ListBoxItem
						>
					{/each}
				</ListBox>
			{:else}
				<input
					id="new-user"
					class="input"
					type="text"
					name="new-user"
					bind:value={new_user}
					autocomplete="off"
					placeholder="Valentine S."
				/>
			{/if}

			<label class="space-x-2">
				<p>Mot de passe</p>
				<input
					id="current-password"
					class="input"
					type="password"
					name="password"
					bind:value={password}
					autocomplete="current-password"
					placeholder="Mot de passe"
					required
				/>
			</label>
		</form>

		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>Annuler</button>
			<button
				class="btn {parent.buttonPositive}"
				on:click={onFormSubmit}
				disabled={!login_enabled}
				type="submit"
				form="login-form">{connection_string}</button
			>
			{#if failed_login_text}
				<div class="text-red">{failed_login_text}</div>
			{/if}
		</footer>
	</div>
{/if}
