<script lang="ts">
	import type { SvelteComponent } from 'svelte';
	// Stores
	import { base } from '$app/paths';
	import { last_user, user } from '$lib/stores';
	import {
		createToaster,
		Dialog,
		Listbox,
		Portal,
		SegmentedControl,
		useListCollection
	} from '@skeletonlabs/skeleton-svelte';
	let new_user = $state('');

	let { referents, parent }: Props = $props();

	interface Props {
		referents: any;
		parent: SvelteComponent;
	}

	// Do not preselect $last_user if it no longer exists
	let current_user = $state(
		referents.map((item) => item[1]).includes($last_user) ? $last_user : ''
	);

	let open = $state(true);

	let failed_login_text = $state('');

	let password = $state('');

	let radio = $state('existing');
	let toastStore = createToaster();

	let login_enabled = $derived(radio === 'existing' ? current_user !== '' : new_user !== '');
	let connection_string = $derived(
		'Se connecter' +
			(login_enabled ? ' en tant que: ' + (radio == 'existing' ? current_user : new_user) : '')
	);

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
		open = false;
	}

	const collection = useListCollection({
		items: referents,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value
	});

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
<Dialog {open} onOpenChange={(e) => (open = e.open)}>
	<Dialog.Trigger class="btn preset-filled">Espace Staff</Dialog.Trigger>

	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
			<Dialog.Content class="card bg-surface-100-900 w-full max-w-xl p-4 space-y-4 shadow-xl ">
				<div class={cBase}>
					user: {$user}
					last_user: {$last_user}
					<header class={cHeader}>Referent</header>

					<SegmentedControl active="preset-filled-primary-500" hover="hover:preset-tonal-primary">
						<SegmentedControl.Item bind:group={radio} name="justify" value="existing"
							>Utilisateur existant</SegmentedControl.Item
						>
						<SegmentedControl.Item bind:group={radio} name="justify" value="new"
							>Nouvel utilisateur</SegmentedControl.Item
						>
					</SegmentedControl>

					<form id="login-form" class="modal-form {cForm}">
						{#if radio === 'existing'}
							<Listbox class="border rounded-container">
								<Listbox.Content>
									{#each collection.items as item (item.value)}
										<Listbox.ItemText>{item.label}</Listbox.ItemText>
										<Listbox.ItemIndicator />
										<Listbox.item bind:group={current_user} name={item[0]} value={item[1]}
											>{item[1]}
										</Listbox.item>
									{/each}
								</Listbox.Content>
							</Listbox>
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

					<footer class="modal-footer">
						<Dialog.CloseTrigger class="btn preset-tonal">Annuler</Dialog.CloseTrigger>
						<button
							class="btn"
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
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
