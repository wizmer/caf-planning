<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	// Stores
	import { last_user, user } from '$lib/stores';
	import { Segment } from '@skeletonlabs/skeleton-svelte';
	import { base } from '$app/paths';

	let new_user = $state('');


	interface Props {
		referents: any;
		parent: SvelteComponent;
	}

	let { referents, parent }: Props = $props();

	const modalStore = getModalStore();

	// Do not preselect $last_user if it no longer exists
	let current_user = $state(referents.map((item) => item[1]).includes($last_user) ? $last_user : '');

	let failed_login_text = $state('');

	let password = $state('');

	let radio = $state('existing');
	let toastStore = getToastStore();

	let login_enabled = $derived(radio === 'existing' ? current_user !== '' : new_user !== '');
	let connection_string =
		$derived('Se connecter' +
		(login_enabled ? ' en tant que: ' + (radio == 'existing' ? current_user : new_user) : ''));

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
		fetch(`${base}/api/referent`, {
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
	const cForm = 'p-2 space-y-4 rounded-container';
</script>

<!-- @component This example creates a simple form modal. -->

{#if $modalStore[0]}
	<div class={cBase}>
		user: {$user}
		last_user: {$last_user}
		<header class={cHeader}>Referent</header>

		<Segment active="preset-filled-primary-500" hover="hover:preset-tonal-primary">
			<Segment.Item bind:group={radio} name="justify" value="existing">Utilisateur existant</Segment.Item>
			<Segment.Item bind:group={radio} name="justify" value="new">Nouvel utilisateur</Segment.Item>
		</Segment>

		<form id="login-form" class="modal-form {cForm}">
			{#if radio === 'existing'}
				<ListBox class="border rounded-container">
					{#each referents as item}
						<ListBoxItem bind:group={current_user} name={item[0]} value={item[1]}
							>{item[1]}
						</ListBoxItem>
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
			<button class="btn {parent.buttonNeutral}" onclick={parent.onClose}>Annuler</button>
			<button
				class="btn {parent.buttonPositive}"
				onclick={onFormSubmit}
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
