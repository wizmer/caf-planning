<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { admin, REFERENT } from '$lib/stores';

	import { dev } from '$app/environment';
	import { base } from '$app/paths';
	import { XIcon } from '@lucide/svelte';
	import {
		createToaster,
		Dialog,
		Listbox,
		Portal,
		useListCollection
	} from '@skeletonlabs/skeleton-svelte';
	import { DateTime } from 'luxon';
	import type { PageData } from '../$types';
	import { create_slots } from '../utils';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let password = $state();
	if (dev) {
		// to make development easier
		$admin = true;
	}

	let dialogOpen = $state(false);

	const slots = create_slots({});
	let events = $state(data.events);
	let type = $state('cancelled');
	let date = $state(Object.values(slots)[0].day);

	let referents_to_remove = $state([]);
	const toastStore = createToaster();

	let referents = $state(data.referents);
	function enter_admin() {
		if (password == 'AdminSallaz') {
			goto('/admin');
			$admin = true;
		}
	}

	const collection = $derived(
		useListCollection({
			items: referents.map((ref) => ({
				label: ref[1],
				value: ref[1]
			})),
			itemToString: (item) => item.label,
			itemToValue: (item) => item.value
		})
	);

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
		invalidateAll();
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
		invalidateAll();
	}

	function delete_users() {
		console.log('clicked');
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
							referents = referents.filter((item) => !referents_to_remove.includes(item[1]));
						}
					});
				}
			}
		}
		referents = referents.filter((item) => !referents_to_remove.includes(item[1]));
		dialogOpen = false;
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
		<button class="btn bg-primary-500" onclick={enter_admin}>Enter admin mode</button>
	</div>
{:else}
	<div class="flex flex-col gap-8">
		<div class="card m-4 p-4 flex flex-col gap-4">
			<h2 class="h2">Evenements speciaux:</h2>
			<ul class="list">
				{#each Object.values(events) as event}
					<li class="mb-4">
						<span>-</span>
						<span class="flex flex-row flex-wrap items-center gap-4">
							<div>
								{event[1]}
							</div>
							<div>
								{event[2]}
							</div>
							<button class="btn btn-sm bg-secondary-500" onclick={() => delete_event(event[1])}
								>Supprimer l'evenement</button
							>
						</span>
					</li>
				{/each}
			</ul>

			<h3 class="h3">Creer un nouvel evenement</h3>
			<div class="flex flex-row flex-wrap gap-4">
				<select class="select w-fit" id="type" bind:value={type}>
					<option value="cancelled">Annulation</option>
					<option value="new-slot">Nouveau creneau</option>
				</select>
				{#if type == 'cancelled'}
					<select class="select w-fit" id="date" bind:value={date}>
						{#each Object.values(slots) as slot}
							<option value={slot.day}>{slot.day}</option>
						{/each}
					</select>
				{:else}
					{@const slotstoCreateEvents = Array.apply(null, Array(60)).map((val, index) =>
						DateTime.now()
							.set({ day: DateTime.now().day + index })
							.toISODate()
					)}
					<select class="select w-fit" id="date" bind:value={date}>
						{#each slotstoCreateEvents as slot}
							<option value={slot}>{slot}</option>
						{/each}
					</select>
				{/if}
				<button class="btn bg-primary-500" onclick={() => add_event(date, type)}
					>Appliquer l'evenement</button
				>
			</div>
		</div>

		<div class="card flex flex-col m-4 p-4 gap-4">
			<h2 class="h2">Suppression des {REFERENT}s</h2>

			<Listbox
				class="w-full max-w-md"
				{collection}
				onValueChange={(e) => {
					referents_to_remove = e.value;
				}}
				selectionMode="multiple"
			>
				<Listbox.Content>
					{#each collection.items as item (item.value)}
						<Listbox.Item {item}>
							<Listbox.ItemText>{item.label}</Listbox.ItemText>
							<Listbox.ItemIndicator />
						</Listbox.Item>
					{/each}
				</Listbox.Content>
			</Listbox>

			<Dialog open={dialogOpen} onOpenChange={(e) => (dialogOpen = e.open)}>
				<Dialog.Trigger class="btn preset-filled">Supprimer {REFERENT}s</Dialog.Trigger>
				<Portal>
					<Dialog.Backdrop class="fixed inset-0 z-50 bg-surface-50-950/50" />
					<Dialog.Positioner class="fixed inset-0 z-50 flex justify-center items-center p-4">
						<Dialog.Content
							class="card bg-surface-100-900 w-full max-w-xl p-4 space-y-4 shadow-xl transition transition-discrete opacity-0 translate-y-[100px] starting:data-[state=open]:opacity-0 starting:data-[state=open]:translate-y-[100px] data-[state=open]:opacity-100 data-[state=open]:translate-y-0"
						>
							<header class="flex justify-between items-center">
								<Dialog.Title class="text-lg font-bold">Suppression des {REFERENT}s</Dialog.Title>
								<Dialog.CloseTrigger class="btn-icon hover:preset-tonal">
									<XIcon class="size-4" />
								</Dialog.CloseTrigger>
							</header>
							<Dialog.Description>
								Ceci supprimera tous les creneaux des {REFERENT}s suivant.es. Cette action ne peut
								pas etre annulee.
								<ul class="list">
									{#each referents_to_remove as ref}
										<li>{ref}</li>
									{/each}
								</ul>
							</Dialog.Description>
							<footer class="flex justify-end gap-2">
								<Dialog.CloseTrigger class="btn preset-tonal">Cancel</Dialog.CloseTrigger>
								<button onclick={delete_users} type="button" class="btn preset-filled">Save</button>
							</footer>
						</Dialog.Content>
					</Dialog.Positioner>
				</Portal>
			</Dialog>
		</div>
	</div>
{/if}
