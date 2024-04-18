<script lang="ts">
	import { admin, REFERENT } from '$lib/stores';
	import { getToastStore, getModalStore } from '@skeletonlabs/skeleton';

	import type { PageData } from './$types';
	export let data: PageData;
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';
	let password;

	import { dev } from '$app/environment';
	import { base } from '$app/paths';

	if (dev) {
		// to make development easier
		//      $admin = true;
	}

	let referents_to_remove = [];
	const modalStore = getModalStore();
	const toastStore = getToastStore();

	let referents = data.referents;
	function enter_admin() {
		if (password == 'AdminSallaz') {
			goto('/admin');
			$admin = true;
		}
	}

	function trigger_modal() {
		const modal = {
			type: 'confirm',
			// Data
			title: `Suppression des ${REFERENT}s`,
			body: `Ceci supprimera tous les creneaux des ${REFERENT}s. Cette action ne peut pas etre annulee.`,
			response: (is_confirmed: boolean) => {
				if (is_confirmed) {
					delete_users();
				}
			}
		};
		modalStore.trigger(modal);
	}

	function delete_users() {
		for (let user of referents_to_remove) {
			for (let i = 0; i < referents.length; i++) {
				if (referents[i][1] === user) {
					fetch(`${base}/api/slot`, {
						method: 'DELETE',
						body: JSON.stringify({ ref_id: referents[i][0] }),
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
					break;
				}
			}
		}
		referents = referents.filter((item) => !referents_to_remove.includes(item[1]));
	}
</script>

{#if !$admin}
	<div class="flex flex-col items-center gap-4">
		<input
			id="new-user"
			class="input"
			type="password"
			name="password"
			bind:value={password}
			autocomplete="off"
			placeholder="Enter admin password"
		/>
		<button class="btn bg-primary-500" on:click={enter_admin}>Enter admin mode</button>
	</div>
{:else}
	<label for="list">Suppression des {REFERENT}s</label>
	<ListBox name="list" class="border rounded-container-token" multiple>
		{#each referents as item}
			<ListBoxItem bind:group={referents_to_remove} name={item[0]} value={item[1]}
				>{item[1]}
			</ListBoxItem>
		{/each}
	</ListBox>
	<button
		on:click={trigger_modal}
		class="btn bg-secondary-500"
		disabled={!referents_to_remove.length}>Supprimer {REFERENT}s</button
	>
{/if}
