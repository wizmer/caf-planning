<script lang="ts">
	import type { Move } from '$lib/types';
	import type { Wall } from '@prisma/client';

	let { walls, route = $bindable([]) as Move[], isEditing = false } = $props();

	// route = [
	// 	{ index: 0, wallId: 6, type: 'both', x: 55, y: 45 },
	// 	{ index: 1, wallId: 5, type: 'start', x: 20, y: 80 },
	// 	{ index: 2, wallId: 5, type: 'handhold', x: 30, y: 60 },
	// 	{ index: 3, wallId: 5, type: 'foothold', x: 40, y: 70 },
	// 	{ index: 4, wallId: 5, type: 'both', x: 50, y: 50 },
	// 	{ index: 5, wallId: 5, type: 'top', x: 60, y: 20 },
	// 	{ index: 6, wallId: 6, type: 'top', x: 60, y: 20 },
	// 	{ index: 7, wallId: 6, type: 'foothold', x: 45, y: 65 }
	// ];

	let currentWallIndex = $state(0);
	let currentMoveIndex = $state(route.length);

	function nextWall() {
		currentWallIndex = (currentWallIndex + 1) % walls.length;
	}

	function prevWall() {
		currentWallIndex = currentWallIndex === 0 ? walls.length - 1 : currentWallIndex - 1;
	}

	function goToWall(index: number) {
		currentWallIndex = index;
	}

	let currentWall = $derived(walls.find((wall: Wall) => wall.id === currentWallIndex) ?? walls[0]);
	console.log('walls', walls);
	let currentWallMoves = $derived(route.filter((move) => move.wallId === currentWall?.id));
	let currentOperation = $state<'adding' | 'editing'>('adding');

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

	let currentMoveType = $state<Move['type']>('handhold');

	let tempMove = $state<Move | null>(null);
	let tempRoute = $state<Move[]>([]);
	function handleImageClick(event: MouseEvent) {
		if (!isEditing) return;

		const img = event.currentTarget as HTMLElement;
		const rect = img.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		tempMove = {
			index: currentMoveIndex,
			wallId: currentWall.id,
			type: currentMoveType,
			x: Math.round(x * 10) / 10,
			y: Math.round(y * 10) / 10
		};

		if (currentOperation === 'adding') {
			tempRoute = [...route, tempMove];
		} else {
			route[currentMoveIndex] = tempMove;
			tempRoute = [...route];
		}
	}

	function submitMove() {
		if (!tempMove) return;

		route = [...tempRoute];

		// Go back to adding move state
		addMove();
	}

	function addMove() {
		tempMove = null;
		currentOperation = 'adding';
		currentMoveIndex = route.length;
	}
	function editMove(move: Move) {
		tempMove = null;
		currentOperation = 'editing';
		goToWall(move.wallId);
		currentMoveType = move.type;
		currentMoveIndex = move.index;
		currentWallIndex = move.wallId;
	}

	function removeMove(moveIndex: number) {
		route = route.filter((move) => move.index !== moveIndex);
		// Reindex remaining moves
		route = route.map((move, index) => ({ ...move, index: index + 1 }));
	}
</script>

{#if walls.length > 0}
	<div class="relative w-full max-w-4xl mx-auto">
		{#if isEditing}
			<div class="card p-4 mb-4">
				{#if currentOperation === 'adding'}
					<h4 class="h5 mb-2">Adding Move: {currentMoveIndex}</h4>
				{:else}
					<h4 class="h5 mb-2">Editing Move: {currentMoveIndex}</h4>
				{/if}
				<div class="flex gap-2 flex-wrap">
					<button
						class="chip {currentMoveType === 'start' ? 'variant-filled-success' : 'variant-soft'}"
						onclick={() => (currentMoveType = 'start')}
					>
						Start
					</button>
					<button
						class="chip {currentMoveType === 'handhold'
							? 'variant-filled-primary'
							: 'variant-soft'}"
						onclick={() => (currentMoveType = 'handhold')}
					>
						Handhold
					</button>
					<button
						class="chip {currentMoveType === 'foothold'
							? 'variant-filled-warning'
							: 'variant-soft'}"
						onclick={() => (currentMoveType = 'foothold')}
					>
						Foothold
					</button>
					<button
						class="chip {currentMoveType === 'both' ? 'variant-filled-secondary' : 'variant-soft'}"
						onclick={() => (currentMoveType = 'both')}
					>
						Both
					</button>
					<button
						class="chip {currentMoveType === 'top' ? 'variant-filled-error' : 'variant-soft'}"
						onclick={() => (currentMoveType = 'top')}
					>
						Top
					</button>
					<button class="btn variant-filled-secondary" onclick={submitMove} disabled={!tempMove}
						>Add Move</button
					>
				</div>
				<p class="text-sm text-surface-600 mt-2">Click on the wall image to add moves'</p>
			</div>
		{/if}

		<!-- Main Image Display -->
		<div class="relative card overflow-hidden">
			<img
				src="/uploads/{currentWall.photo.file_path}"
				alt={currentWall.name}
				class="w-full h-auto object-contain max-h-96 {isEditing ? 'cursor-crosshair' : ''}"
				onclick={handleImageClick}
			/>

			<!-- Move Circles Overlay -->
			{#each currentWallMoves as move}
				<div
					class="absolute w-6 h-6 rounded-full border-2 border-surface-50 shadow-lg flex items-center justify-center text-on-primary-token text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 {getMoveColor(
						move.type
					)} {isEditing ? 'hover:scale-125 cursor-pointer' : ''}"
					style="left: {move.x}%; top: {move.y}%;"
					title="{move.type} - Move {move.index}"
					onclick={isEditing
						? (e) => {
								e.stopPropagation();
								removeMove(move.index);
							}
						: undefined}
				>
					{move.index}
				</div>
			{/each}

			{#if tempMove}
				<div
					class="absolute w-6 h-6 rounded-full border-2 border-surface-50 shadow-lg flex items-center justify-center text-on-primary-token text-xs font-bold transform -translate-x-1/2 -translate-y-1/2 {getMoveColor(
						tempMove.type
					)} {isEditing ? 'hover:scale-125 cursor-pointer' : ''}"
					style="left: {tempMove.x}%; top: {tempMove.y}%;"
					title="{tempMove.type} - Move {tempMove.index}"
					onclick={isEditing
						? (e) => {
								e.stopPropagation();
								removeMove(tempMove.index);
							}
						: undefined}
				>
					{tempMove.index}
				</div>
			{/if}

			<!-- Navigation Arrows -->
			{#if walls.length > 1}
				<button
					onclick={prevWall}
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
					onclick={nextWall}
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

			{#if !isEditing}
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
					{#if isEditing}
						<p class="text-surface-300 text-xs mt-1">
							Editing mode • Click to add {currentMoveType}
						</p>
					{/if}
				</div>
			{/if}

			<!-- Counter -->
			{#if walls.length > 1}
				<div class="badge variant-filled-surface absolute top-4 right-4">
					{currentWallIndex + 1} / {walls.length}
				</div>
			{/if}
		</div>

		<!-- Move Legend -->
		{#if route && !isEditing}
			<div class="card p-4 mt-4">
				<h4 class="h4 mb-2">Move Legend</h4>
				<div class="flex flex-wrap gap-4 text-sm">
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-success-500 border border-surface-50"></div>
						<span>Start</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-primary-500 border border-surface-50"></div>
						<span>Handhold</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-warning-500 border border-surface-50"></div>
						<span>Foothold</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-secondary-500 border border-surface-50"></div>
						<span>Both</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-error-500 border border-surface-50"></div>
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
						onclick={() => goToWall(index)}
						class="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all {index ===
						currentWallIndex
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

		{#if isEditing}
			<div class="flex justify-center mt-4 space-x-2 pb-2 overflow-scroll">
				{#each route as move}
					<button
						onclick={() => editMove(move)}
						class="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all {move.index ===
						currentMoveIndex
							? 'border-primary-500'
							: 'border-surface-300 hover:border-surface-400'}"
					>
						Move {move.index}
					</button>
				{/each}
				<button
					onclick={() => addMove()}
					class="flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-all {currentOperation ===
					'adding'
						? 'border-primary-500'
						: 'border-surface-300 hover:border-surface-400'}"
				>
					➕ New Move
				</button>
			</div>
		{/if}
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
