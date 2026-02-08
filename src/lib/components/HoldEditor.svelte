<script lang="ts">
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { getMoveLabel } from '$lib/move-utils';
	import type { Move } from '$lib/types';

	let { move = $bindable(), onDelete, idx } = $props();
</script>

<h5 class="text-sm font-bold mb-3">Edit Hold</h5>

<div class="space-y-4">
	<!-- Hold Type Selection -->
	<div class="flex flex-col gap-1">
		move type = {move.type}
		{#each ['hand_start', 'foot_start', 'hand', 'foot', 'both', 'finish'] as holdType}
			<button
				onclick={() => {
					console.log('setting move type to', holdType);
					console.log('before:', move);
					move.type = holdType as Move['type'];
					move = { ...move, type: holdType as Move['type'] };
					console.log('after:', move);
				}}
				class="btn btn-sm {move.type === holdType
					? 'preset-filled'
					: 'preset-tonal border border-surface-500'} justify-start"
			>
				<div class="flex items-center gap-2">
					<div class="w-3 h-3 rounded-full {holdType}"></div>
					{getMoveLabel(holdType as Move['type'])}
				</div>
			</button>
		{/each}
	</div>

	<!-- Radius Slider -->
	<div class="space-y-2">
		<label class="block text-sm font-medium">Taille du cercle: {move.radius}%</label>
		<Slider type="single" bind:value={move.radius} max={15} step={1} class="max-w-[70%]" />
	</div>

	<!-- Delete Button -->
	<hr class="my-1" />
	<button onclick={() => onDelete(idx)} class="btn btn-sm preset-filled-error-500 w-full">
		Delete Hold
	</button>
</div>
