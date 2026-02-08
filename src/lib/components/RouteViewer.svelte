<script lang="ts">
	import { PUBLIC_UPLOAD_URL } from '$env/static/public';
	import { getMoveLabel } from '$lib/move-utils';
	import type { Move, Prisma, Route } from '@prisma/client';
	import Hold from './Hold.svelte';
	import MoveLegend from './MoveLegend.svelte';
	let {
		walls,
		route = $bindable() as Route & { moves: Move[] },
		isEditing = false,
		legend = true
	} = $props();

	let initCurrentWallIndex = 0;
	let openedMoveId = $state<number | null>(null);

	if (route.moves.length > 0) {
		const wallIdsWithMoves = new Set(route.moves.map((move) => move.wallId));
		const firstWallIndex = walls.findIndex((wall) => wallIdsWithMoves.has(wall.id));
		if (firstWallIndex !== -1) {
			initCurrentWallIndex = firstWallIndex;
		}
	}

	let currentWallIndex = $state(initCurrentWallIndex);
	let selectedHoldType = $state<Move['type']>(
		route.moves.length > 0 ? route.moves[route.moves.length - 1].type : 'hand'
	);
	let isFullscreen = $state(false);
	let wallContainerRef: HTMLDivElement | null = $state(null);
	let imageWidth = $state(0);

	export const resizeObserver = (node, callback) => {
		const ro = new ResizeObserver(([entry]) => callback(entry));
		ro.observe(node);
		return {
			destroy: () => ro.disconnect()
		};
	};

	function toggleFullscreen() {
		if (!wallContainerRef) return;

		if (!document.fullscreenElement) {
			wallContainerRef
				.requestFullscreen()
				.then(() => {
					isFullscreen = true;
				})
				.catch((err) => {
					console.error('Error attempting to enable fullscreen:', err);
				});
		} else {
			document.exitFullscreen().then(() => {
				isFullscreen = false;
			});
		}
	}

	// Listen for fullscreen changes (e.g., ESC key)
	$effect(() => {
		const handleFullscreenChange = () => {
			isFullscreen = !!document.fullscreenElement;
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});

	function nextWall() {
		currentWallIndex = (currentWallIndex + 1) % walls.length;
	}

	function prevWall() {
		currentWallIndex = currentWallIndex === 0 ? walls.length - 1 : currentWallIndex - 1;
	}

	function goToWall(index: number) {
		currentWallIndex = index;
	}

	let currentWall = $derived(walls[currentWallIndex]);

	function handleImageClick(event: MouseEvent) {
		if (!isEditing) {
			console.warn('clicking does nothing when not in edition mode');
			return;
		}
		if (!currentWall) {
			console.error('No current wall');
			return;
		}

		const img = event.currentTarget as HTMLElement;
		const rect = img.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		// Create new move
		const newMove: Prisma.MoveUncheckedCreateInput = {
			wallId: currentWall.id,
			type: selectedHoldType,
			x,
			y,
			radius: 1.6,
			routeId: route.id
		};

		route.moves.push(newMove);
	}

	function deleteMove(index: number) {
		route.moves = route.moves.slice(0, index).concat(route.moves.slice(index + 1));
	}
</script>

{#if walls.length > 0}
	<div class="relative h-full flex flex-col">
		{#if isEditing}
			<div class="card p-4 mb-4">
				<p class="text-sm text-surface-600 mt-2">
					Click on the wall image to add a {getMoveLabel(selectedHoldType).toLowerCase()} hold. Click
					holds to edit or drag to reposition.
				</p>
			</div>
		{/if}

		<!-- Main Image Display -->
		<div
			bind:this={wallContainerRef}
			class="relative card overflow-hidden wall-image-container flex-1 min-h-0 flex items-center justify-center {isFullscreen
				? 'bg-surface-900'
				: ''}"
		>
			<!-- Fullscreen Button -->
			<button
				onclick={toggleFullscreen}
				aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
				class="absolute top-4 left-4 z-50 btn preset-filled-surface-500 rounded-full w-10 h-10 p-0 flex items-center justify-center hover:scale-110 transition-transform"
			>
				{#if isFullscreen}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
						/>
					</svg>
				{/if}
			</button>

			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_keys -->
			<img
				src="{PUBLIC_UPLOAD_URL}/{currentWall.photo.file_path}"
				alt={currentWall.name}
				class="max-w-full max-h-full object-contain block {isEditing ? 'cursor-crosshair' : ''}"
				onclick={handleImageClick}
				use:resizeObserver={({ contentRect }) => {
					imageWidth = contentRect.width;
				}}
			/>

			{#each route.moves as move, idx}
				<Hold
					bind:move={route.moves[idx]}
					{idx}
					{isEditing}
					bind:openedMoveId
					{deleteMove}
					{imageWidth}
				/>
			{/each}

			<!-- Navigation Arrows -->
			{#if walls.length > 1}
				<button
					onclick={prevWall}
					aria-label="Previous wall"
					class="absolute left-4 top-1/2 -translate-y-1/2 btn preset-filled-surface-500 rounded-full w-12 h-12 p-0 flex items-center justify-center hover:scale-110 transition-transform"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
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
					aria-label="Next wall"
					class="absolute right-4 top-1/2 -translate-y-1/2 btn preset-filled-surface-500 rounded-full w-12 h-12 p-0 flex items-center justify-center hover:scale-110 transition-transform"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
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
					{#if route.moves.length > 0}
						<p class="text-surface-300 text-sm mt-1">
							{route.moves.length} move{route.moves.length !== 1 ? 's' : ''}
						</p>
					{/if}
				</div>
			{/if}

			<!-- Counter -->
			{#if walls.length > 1}
				<div class="badge preset-filled-surface-500 absolute top-4 right-4">
					{currentWallIndex + 1} / {walls.length}
				</div>
			{/if}
		</div>

		<!-- Move Legend (View Mode) -->
		{#if !isEditing && legend}
			<MoveLegend />
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
							src="{PUBLIC_UPLOAD_URL}/{wall.photo.file_path}"
							alt={wall.name}
							class="w-full h-full object-cover"
						/>
					</button>
				{/each}
			</div>
		{/if}
	</div>
{:else}
	<div class="text-center py-12">
		<p class="text-surface-500 text-lg">No walls found for this gym.</p>
	</div>
{/if}
