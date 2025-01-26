<script lang="ts">
	import { user } from '$lib/stores';
	import { getToastStore } from '@skeletonlabs/skeleton';

	import { base } from '$app/paths';
	import type { PageData } from './$types';
	import { create_slots, timeslots } from './utils';

	export let data: PageData;

	const toastStore = getToastStore();

	const events = data.events;
	const refs = data.slots;
	console.log('refs', refs);

	let slots = create_slots();

	Object.entries(slots).forEach(([date, slot]) => {
		const day = slot.day;
		console.log('day', day);

		if (day in events) {
			slot.status = events[day][2];
		}

		slot.refs = refs[slot.day] || {};
	});

	$: {
		for (let slot of Object.values(slots)) {
			if ($user && !($user in slot.refs)) {
				slot.refs[$user] = { name: $user, start: '', end: '' };
			}
		}
		console.log('slots', slots);
	}

	function update_timeslot(ref, day) {
		if ((!ref.start && !ref.end) || (ref.start && ref.end)) {
			fetch(`${base}/api/slot`, {
				method: 'POST',
				body: JSON.stringify({ day: day, ref: ref }),
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
	}
</script>

<div>
	{#each Object.values(slots) as row, i (row.id)}
		{#if i === 0 || Object.values(slots)[i - 1].month != row.month}
			<div class="h2 p-4">
				{row.day}
			</div>
		{/if}

		{#if row.status != 'non-planned'}
			<div class="card">
				<header class="card-header">
					<div class="h3">{row.date}</div>
				</header>

				<section class="p-4">
					{#if row.status != 'cancelled'}
						{#if $user}
							{#if !row.refs[$user]?.start && !row.refs[$user]?.end && !row.adding_slot}
								<button
									type="button"
									class="btn bg-primary-500"
									on:click={() => {
										row.adding_slot = true;
									}}
								>
									Ajouter mon creneau
								</button>
							{:else}
								<div class="flex flex-row flex-wrap justify-center items-center gap-2 mb-4">
									<label for="select-start-{i}">Mon créneau: </label>
									<select
										id="select-start-{i}"
										class="border rounded"
										bind:value={row.refs[$user].start}
										on:change={() => update_timeslot(row.refs[$user], row.day)}
									>
										{#each timeslots.slice(0, -1) as time}
											<option value={time}>{time}</option>
										{/each}
									</select>

									<!-- <label for="select-end-{i}" class="p-4">A: </label> -->
									<select
										id="select-end-{i}"
										class="border rounded"
										bind:value={row.refs[$user].end}
										on:change={() => update_timeslot(row.refs[$user], row.day)}
									>
										{#each timeslots.slice(1) as time}
											{#if !row.refs[$user].start || row.refs[$user].start < time}
												<option value={time}>{time}</option>
											{/if}
										{/each}
									</select>

									<button
										type="button"
										class="btn text-white bg-red-400 hover:bg-red-500"
										on:click={() => {
											if ($user in row.refs) {
												row.refs[$user].start = '';
												row.refs[$user].end = '';
												update_timeslot(row.refs[$user], row.day);
											}
											row.adding_slot = false;
										}}
									>
										Enlever mon creneau
									</button>
								</div>
							{/if}
						{/if}
					{/if}

					<div class="table-container">
						<table class="table table-auto table-hover max-w-prose">
							<thead class="divide-x divide-x-2">
								<th>Nom</th>
								<th colspan="2">18:00</th>
								<th colspan="2">19:00</th>
								<th colspan="2">20:00</th>
								<th colspan="2">21:00</th>
							</thead>

							<tbody>
								{#if row.status == 'cancelled'}
									<tr>
										<td class="cancelled" colspan="100%">
											<div class="h3">Session annulee</div>
										</td>
									</tr>
								{:else}
									{#if Object.values(row.refs).filter((ref) => ref.start && ref.end).length == 0}
										<tr>
											<td class="no_referrent" colspan="100%">
												<div class="h3">Pas de referent·e pour le moment</div>
											</td>
										</tr>
									{/if}

									{#each Object.values(row.refs) as ref}
										{#if ['ok', 'new-slot'].includes(row.status) && ref.start && ref.end}
											<tr class="py-0 divide-x divide-y">
												<td>
													{ref.name}
												</td>

												{#each timeslots.slice(0, -1) as time}
													<td class:present={ref.start <= time && ref.end > time} />
												{/each}
											</tr>
										{/if}
									{/each}
								{/if}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		{/if}
	{/each}
</div>

<style>
	.table thead th {
		padding-left: 2px !important;
		padding-right: 2px !important;
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

	.no_referrent {
		color: rgba(var(--color-warning-500) / 1);
	}

	.cancelled {
		color: rgba(var(--color-error-500) / 1);
	}

	.card {
		margin-top: 20px;
		margin-bottom: 20px;
	}
</style>
