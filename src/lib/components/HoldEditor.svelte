<script lang="ts">
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { getMoveColor, getMoveLabel } from '$lib/move-utils';
	import type { Move } from '$lib/types';

	interface Props {
		move: Move;
		onUpdateType: (type: Move['type']) => void;
		onUpdateRadius: (radius: number) => void;
		onDelete: () => void;
		onClose: () => void;
	}

	let { move = $bindable(), onUpdateType, onDelete, onClose }: Props = $props();

	function handleRadiusChange(values: number[]) {
		console.log('values', values);
		move.radius = values[0];
	}
</script>

<div
	class="card bg-surface-500 p-3 shadow-xl min-w-[250px] max-h-[500px]"
	role="dialog"
	tabindex="-1"
	onclick={(e) => e.stopPropagation()}
	onkeydown={(e) => e.key === 'Escape' && onClose()}
>
	<h5 class="text-sm font-bold mb-3">Edit Hold</h5>

	<div class="space-y-4">
		<!-- Hold Type Selection -->
		<div class="flex flex-col gap-1">
			{#each ['hand_start', 'foot_start', 'hand', 'foot', 'both', 'finish'] as holdType}
				<button
					onclick={() => onUpdateType(holdType as Move['type'])}
					class="btn btn-sm {move.type === holdType
						? 'preset-filled'
						: 'preset-tonal border border-surface-500'} justify-start"
				>
					<div class="flex items-center gap-2">
						<div class="w-3 h-3 rounded-full {getMoveColor(holdType as Move['type'])}"></div>
						{getMoveLabel(holdType as Move['type'])}
					</div>
				</button>
			{/each}
		</div>

		<!-- Radius Slider -->
		<div class="space-y-2">
			<Slider type="single" bind:value={move.radius} max={100} step={1} class="max-w-[70%]" />
		</div>

		<!-- Delete Button -->
		<hr class="my-1" />
		<button onclick={onDelete} class="btn btn-sm preset-filled-error-500 w-full">
			Delete Hold
		</button>
	</div>
</div>
