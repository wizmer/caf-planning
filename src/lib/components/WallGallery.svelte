<script lang="ts">
	import type { Wall } from '@prisma/client';

	export let walls: Wall[];

	interface Move {
		index: number;
		wallId: number;
		type: 'foothold' | 'handhold' | 'both' | 'start' | 'top';
		x: number;
		y: number;
	}

	export let route: Move[] = [];

	route = [
		{ index: 1, wallId: 5, type: 'start', x: 20, y: 80 },
		{ index: 2, wallId: 5, type: 'handhold', x: 30, y: 60 },
		{ index: 3, wallId: 5, type: 'foothold', x: 40, y: 70 },
		{ index: 4, wallId: 5, type: 'both', x: 50, y: 50 },
		{ index: 5, wallId: 5, type: 'top', x: 60, y: 20 }
	];

	let currentIndex = 0;

	function nextWall() {
		currentIndex = (currentIndex + 1) % walls.length;
	}

	function prevWall() {
		currentIndex = currentIndex === 0 ? walls.length - 1 : currentIndex - 1;
	}

	function goToWall(index: number) {
		currentIndex = index;
	}

	$: currentWall = walls[currentIndex];
	$: currentWallMoves = route.filter((move) => move.wallId === currentWall?.id);

	function getMoveColor(type: string) {
		switch (type) {
			case 'start':
				return 'bg-green-500';
			case 'top':
				return 'bg-red-500';
			case 'handhold':
				return 'bg-blue-500';
			case 'foothold':
				return 'bg-yellow-500';
			case 'both':
				return 'bg-purple-500';
			default:
				return 'bg-gray-500';
		}
	}
</script>

{#if walls.length > 0}
	<div class="relative w-full max-w-4xl mx-auto">
		<!-- Main Image Display -->
		<div class="relative card overflow-hidden">
			<img
				src="/uploads/{currentWall.photo.file_path}"
				alt={currentWall.name}
				class="w-full h-full object-cover aspect-video"
			/>

			<!-- Move Circles Overlay -->
			{#each currentWallMoves as move}
				<div
					class="absolute w-6 h-6 rounded-full border-2 border-surface-50 shadow-lg flex items-center justify-center text-on-primary-token text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 {getMoveColor(
						move.type
					)}"
					style="left: {move.x}%; top: {move.y}%;"
					title="{move.type} - Move {move.index}"
				>
					{move.index}
				</div>
			{/each}

			<!-- Navigation Arrows -->
			{#if walls.length > 1}
				<button
					on:click={prevWall}
					class="btn-icon variant-filled-surface absolute left-4 top-1/2 transform -translate-y-1/2"
					aria-label="Previous wall"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 19l-7-7 7-7"
						/>
					</svg>
				</button>

				<button
					on:click={nextWall}
					class="btn-icon variant-filled-surface absolute right-4 top-1/2 transform -translate-y-1/2"
					aria-label="Next wall"
				>
					<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/>
					</svg>
				</button>
			{/if}

			<!-- Wall Info Overlay -->
			<div
				class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-surface-900/80 to-transparent p-6"
			>
				<h3 class="text-surface-50 text-xl font-bold">{currentWall.name}</h3>
				{#if currentWall.description}
					<p class="text-surface-200 mt-1">{currentWall.description}</p>
				{/if}
				{#if currentWallMoves.length > 0}
					<p class="text-surface-300 text-sm mt-1">
						{currentWallMoves.length} move{currentWallMoves.length !== 1 ? 's' : ''}
					</p>
				{/if}
			</div>

			<!-- Counter -->
			{#if walls.length > 1}
				<div class="badge variant-filled-surface absolute top-4 right-4">
					{currentIndex + 1} / {walls.length}
				</div>
			{/if}
		</div>

		<!-- Move Legend -->
		{#if currentWallMoves.length > 0}
			<div class="card p-4 mt-4">
				<h4 class="h4 mb-2">Move Legend</h4>
				<div class="flex flex-wrap gap-4 text-sm">
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-success-500 border border-surface-50" />
						<span>Start</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-primary-500 border border-surface-50" />
						<span>Handhold</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-warning-500 border border-surface-50" />
						<span>Foothold</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-secondary-500 border border-surface-50" />
						<span>Both</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-error-500 border border-surface-50" />
						<span>Top</span>
					</div>
				</div>
			</div>
		{/if}

		<!-- Thumbnail Navigation -->
		{#if walls.length > 1}
			<div class="flex justify-center mt-4 space-x-2 overflow-x-auto pb-2">
				{#each walls as wall, index}
					<button
						on:click={() => goToWall(index)}
						class="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all {index ===
						currentIndex
							? 'border-primary-500'
							: 'border-surface-300 hover:border-surface-400'}"
					>
						<img
							src="/uploads/{wall.photo.file_path}"
							alt={wall.name}
							class="w-full h-full object-cover"
						/>
					</button>
				{/each}
			</div>
		{/if}

		<!-- Wall Details -->
		<div class="mt-6 text-center">
			<h2 class="h2 mb-2">{currentWall.name}</h2>
			{#if currentWall.description}
				<p class="text-surface-600 max-w-2xl mx-auto">{currentWall.description}</p>
			{/if}
		</div>
	</div>
{:else}
	<div class="text-center py-12">
		<p class="text-surface-500 text-lg">No walls found for this gym.</p>
	</div>
{/if}

<style>
	/* Smooth transitions */
	img {
		transition: opacity 0.3s ease-in-out;
	}

	/* Move circles hover effect */
	.absolute.w-6.h-6 {
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.absolute.w-6.h-6:hover {
		transform: translate(-50%, -50%) scale(1.2);
		z-index: 10;
	}
</style>
