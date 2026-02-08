<script lang="ts">
	// Stores
	import { base } from '$app/paths';
	import { last_user, user } from '$lib/stores.svelte';
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

	let preselected_user = referents.find((item) => item[1] === $last_user) ? $last_user : '';

	let selected_user = $state(preselected_user);

	let open = $state(false);

	let failed_login_text = $state('');

	let password = $state('');

	let radio = $state('existing');
	let toastStore = createToaster();

	let login_enabled = $derived(radio === 'existing' ? selected_user !== '' : new_user !== '');
	let connection_string = $derived(
		'Se connecter' +
			(login_enabled ? ' en tant que: ' + (radio == 'existing' ? selected_user : new_user) : '')
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
		$user = radio === 'existing' ? selected_user : new_user;
		open = false;
	}

	const collection = useListCollection({
		items: referents.map((ref) => ({
			label: ref[1],
			value: ref[1]
		})),
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

<Dialog {open} onOpenChange={(e) => (open = e.open)}>
	<Dialog.Trigger class="btn preset-filled">Espace Staff</Dialog.Trigger>

	<Portal>
		<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
		<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
			<Dialog.Content class="card bg-surface-100-900 w-full max-w-xl p-4 space-y-4 shadow-xl ">
				<header class={cHeader}>Referent</header>

				<SegmentedControl
					defaultValue="existing"
					value={radio}
					onValueChange={(e) => (radio = e.value)}
				>
					<SegmentedControl.Control>
						<SegmentedControl.Indicator />
						<SegmentedControl.Item value="existing" title="existing" aria-label="existing">
							<SegmentedControl.ItemText>Utilisateur existant</SegmentedControl.ItemText>
							<SegmentedControl.ItemHiddenInput />
						</SegmentedControl.Item>
						<SegmentedControl.Item value="new" title="new" aria-label="new">
							<SegmentedControl.ItemText>Utilisateur nouveau</SegmentedControl.ItemText>
							<SegmentedControl.ItemHiddenInput />
						</SegmentedControl.Item>
					</SegmentedControl.Control>
				</SegmentedControl>

				<form id="login-form" class="modal-form {cForm}">
					{#if radio === 'existing'}
						<Listbox
							class="w-full max-w-md "
							{collection}
							defaultValue={[preselected_user]}
							onValueChange={(e) => {
								selected_user = e.value[0];
							}}
						>
							<Listbox.Content class="overflow-y-auto max-h-[50vh]">
								{#each collection.items as item (item.value)}
									<Listbox.Item {item}>
										<Listbox.ItemText>{item.label}</Listbox.ItemText>
										<Listbox.ItemIndicator />
									</Listbox.Item>
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
			</Dialog.Content>
		</Dialog.Positioner>
	</Portal>
</Dialog>
