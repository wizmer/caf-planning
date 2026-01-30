<script lang="ts">
	import { run } from 'svelte/legacy';

	import { base } from '$app/paths';
	import { REFERENT, user } from '$lib/stores';
	import { Trash } from '@lucide/svelte';
	import { createToaster } from '@skeletonlabs/skeleton-svelte';
	import type { PageData } from './$types';
	import { capitalize, create_slots, timeslots } from './utils';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const toastStore = createToaster();

	const events = data.events;
	const refs = data.slots;

	let slots = $state(create_slots(events));

	Object.entries(slots).forEach(([date, slot]) => {
		const day = slot.day;

		if (day in events) {
			slot.status = events[day][2];
		}

		slot.refs = refs[slot.day] || {};
	});

	run(() => {
		for (let slot of Object.values(slots)) {
			if ($user && !($user in slot.refs)) {
				slot.refs[$user] = { name: $user, start: '', end: '' };
			}
		}
	});

	function update_timeslot(ref, day) {
		if ((!ref.start && !ref.end) || (ref.start && ref.end)) {
			fetch(`${base}/api/slot`, {
				method: 'POST',
				body: JSON.stringify({ day: day, ref: ref }),
				headers: {
					'content-type': 'application/json'
				}
			});
		}
	}
</script>

<div>
	{#each Object.values(slots) as row, i (row.id)}
		{#if i === 0 || Object.values(slots)[i - 1].month != row.month}
			<div class="h2 p-4 text-secondary-500">
				{capitalize(row.date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' }))}
			</div>
		{/if}

		<div class="card m-auto max-w-xl preset-filled-surface-100-900 p-4 text-center">
			<header class="card-header">
				<div class="h3 text-tertiary-500">
					<span
						>{row.date.toLocaleString('fr-FR', {
							weekday: 'long',
							day: 'numeric',
							month: 'long'
						})}</span
					>

					{#if row.status == 'new-slot'}
						<span class="p-1 w-fit bg-success-500 rounded-md">
							<span
								class="text-center text-xs text-success-contrast-500 font-medium font-['General Sans']"
							>
								créneau additionnel
							</span>
						</span>
					{/if}
				</div>
			</header>

			<section class="p-4">
				{#if row.status == 'cancelled'}
					<div class="h3 text-error-500">Session annulée</div>
				{:else if $user}
					{#if !row.refs[$user]?.start && !row.refs[$user]?.end && !row.adding_slot}
						<button
							type="button"
							class="btn bg-primary-500 mb-4"
							onclick={() => {
								row.adding_slot = true;
							}}
						>
							Ajouter mon créneau
						</button>
					{:else}
						<div class="flex flex-row flex-wrap justify-center items-center gap-2 mb-4">
							<label for="select-start-{i}">Mon créneau: </label>
							<select
								id="select-start-{i}"
								class="select w-fit p-2 preset-outlined"
								bind:value={row.refs[$user].start}
								onchange={() => update_timeslot(row.refs[$user], row.day)}
							>
								{#each timeslots.slice(0, -1) as time}
									<option value={time}>{time}</option>
								{/each}
							</select>

							<select
								id="select-end-{i}"
								class="select w-fit p-2 preset-outlined"
								bind:value={row.refs[$user].end}
								onchange={() => update_timeslot(row.refs[$user], row.day)}
							>
								{#each timeslots.slice(1) as time}
									{#if !row.refs[$user].start || row.refs[$user].start < time}
										<option value={time}>{time}</option>
									{/if}
								{/each}
							</select>

							<button
								type="button"
								class="btn text-white bg-red-400 hover:bg-red-500 p-2"
								onclick={() => {
									if ($user in row.refs) {
										row.refs[$user].start = '';
										row.refs[$user].end = '';
										update_timeslot(row.refs[$user], row.day);
									}
									row.adding_slot = false;
								}}
							>
								<Trash />
							</button>
						</div>
					{/if}

					<div class="table-container">
						<table class="table table-auto max-w-prose">
							<thead class="divider-x">
								<tr>
									<th>Nom</th>
									<th colspan="2">18:00</th>
									<th colspan="2">19:00</th>
									<th colspan="2">20:00</th>
									<th colspan="2">21:00</th>
								</tr>
							</thead>

							<tbody>
								{#if Object.values(row.refs).filter((ref) => ref.start && ref.end).length == 0}
									<tr>
										<td colspan="100%">
											<div class="h3">Pas de {REFERENT} pour le moment</div>
										</td>
									</tr>
								{/if}

								{#each Object.values(row.refs) as ref}
									{#if ['ok', 'new-slot'].includes(row.status) && ref.start && ref.end}
										<tr class="py-0 divider-x divide-y">
											<td>
												{ref.name}
											</td>

											{#each timeslots.slice(0, -1) as time}
												<td class:present={ref.start <= time && ref.end > time}></td>
											{/each}
										</tr>
									{/if}
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</section>
		</div>
	{/each}
</div>

<style>
	.table thead th {
		padding-left: 2px !important;
		padding-right: 2px !important;
		text-align: left;
	}
	.table thead th:nth-child(1) {
		text-align: center; /* Center-align header cell text */
	}

	.table tbody td {
		padding-left: 0;
	}

	table {
		margin: auto;
	}

	div {
		text-align: center;
	}

	th {
		text-align: left;
	}

	.present {
		background-color: green;
	}

	.card {
		margin-top: 20px;
		margin-bottom: 20px;
	}

	.divider-x th {
		border-right-width: 0px;
		border-left-width: 4px;
	}

	.divider-x td {
		border-right-width: 0px;
		border-left-width: 1px;
	}
</style>
