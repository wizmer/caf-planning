<script lang="ts">
	import { admin, REFERENT } from '$lib/stores';
	import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';

	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';
	export let data: PageData;

	import { dev } from '$app/environment';
	import { base } from '$app/paths';
	import type { PageData } from '../$types';
	import { create_slots } from '../utils';
	import { DateTime } from 'luxon';

	let password;
	if (dev) {
		// to make development easier
		$admin = true;
	}

	const slots = create_slots();
	const slotstoCreateEvents = Array.apply(null, Array(60)).map((val,index) => DateTime.now().set({day: (DateTime.now().day+ index +1)}).toISODate());
	let events = data.events;
	let type = 'cancelled';
	let date = Object.values(slots)[0].day;

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

	function delete_event(day) {
		for (const key of Object.keys(events)) {
			if (events[key][1] == day) {
				delete events[key];
			}
		}
		fetch(`${base}/api/event`, {
			method: 'DELETE',
			body: JSON.stringify({ day }),
			headers: {
				'content-type': 'application/json'
			}
		});
		events = events;
	}

	function add_event(day, type) {
		fetch(`${base}/api/event`, {
			method: 'POST',
			body: JSON.stringify({ day, type }),
			headers: {
				'content-type': 'application/json'
			}
		});

		events[day] = [-1, day, type];
		events = events;
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
	<div>
		<div class="h2">Evenements speciaux</div>
		{#each Object.values(events) as event}
			<div class="flex flex-row items-center gap-4 border">
				<div>
					{event[1]}
				</div>
				<div>
					{event[2]}
				</div>
				<button class="btn bg-secondary-500" on:click={() => delete_event(event[1])}
					>Supprimer l'evenement</button
				>
			</div>
		{/each}
		<div class="flex flex-row">
			<select id="type" bind:value={type}>
				<option value="cancelled">Annulation</option>
				<option value="new-slot">Nouveau creneau</option>
			</select>
			{#if type == 'cancelled'}
				<select id="date" bind:value={date}>
					{#each Object.values(slots) as slot}
						<option value={slot.day}>{slot.day}</option>
					{/each}
				</select>
			{:else}
			<select id="date" bind:value={date}>
				{#each slotstoCreateEvents as slot}
					<option value={slot}>{slot}</option>
				{/each}
			</select>
			{/if}
			<button class="btn bg-primary-500" on:click={() => add_event(date, type)}
				>Appliquer l'evenement</button
			>
		</div>
	</div>

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
