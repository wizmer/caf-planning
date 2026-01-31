<script lang="ts">
	import { PUBLIC_UPLOAD_URL } from '$env/static/public';
	import { getMoveBorderColor, getMoveLabel } from '$lib/move-utils';
	import type { Move } from '$lib/types';
	import { Popover, Portal } from '@skeletonlabs/skeleton-svelte';
	import HoldEditor from './HoldEditor.svelte';
	let { walls, route = $bindable([]) as Move[], isEditing = false, legend = true } = $props();

	let currentWallIndex = $state(0);
	let selectedHoldType = $state<Move['type']>(
		route.length > 0 ? route[route.length - 1].type : 'hand'
	);
	let editingMove = $state<Move | null>(null);
	let isDragging = $state(false);
	let isFullscreen = $state(false);
	let wallContainerRef: HTMLDivElement | null = $state(null);

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

	// Use simple $derived instead of $derived.by for better reactivity with bindable props
	let currentWallMoves = $derived(
		(() => {
			const wallId = currentWall?.id;
			const moves = route.filter((move) => move.wallId === wallId);
			console.log('Current wall moves recalculating:', {
				currentWallIndex,
				wallId,
				routeLength: route.length,
				filteredMoves: moves.length,
				allMoveWallIds: route.map((m) => m.wallId),
				moves
			});
			return moves.sort((a, b) => a.index - b.index);
		})()
	);

	function handleImageClick(event: MouseEvent) {
		console.log('Image clicked', { isEditing, isDragging, currentWall });
		if (!isEditing || isDragging) return;
		if (!currentWall) {
			console.error('No current wall');
			return;
		}

		const img = event.currentTarget as HTMLElement;
		const rect = img.getBoundingClientRect();
		const x = ((event.clientX - rect.left) / rect.width) * 100;
		const y = ((event.clientY - rect.top) / rect.height) * 100;

		// Create new move
		const newMove: Move = {
			id: crypto.randomUUID(),
			index: route.length,
			wallId: currentWall.id,
			type: selectedHoldType,
			x,
			y,
			radius: 16
		};

		console.log('Adding new move:', newMove);
		route = [...route, newMove];
		console.log('Route after adding:', route.length, route);

		// Set selectedHoldType to the type of the newly added hold
		selectedHoldType = newMove.type;
	}

	function updateMoveType(move: Move, newType: Move['type']) {
		const index = route.findIndex((m) => m.id === move.id);
		if (index !== -1) {
			route[index] = { ...route[index], type: newType };
			route = [...route];
		}
	}

	function updateMoveRadius(move: Move, radius: number) {
		const index = route.findIndex((m) => m.id === move.id);
		if (index !== -1) {
			route[index] = { ...route[index], radius };
			route = [...route];
		}
	}

	function deleteMove(move: Move) {
		route = route.filter((m) => m.id !== move.id).map((m, idx) => ({ ...m, index: idx }));
		editingMove = null;
	}

	function handleMoveDragStart(event: MouseEvent, move: Move) {
		if (!isEditing) return;
		event.stopPropagation();
		isDragging = true;
		editingMove = null;

		const img = (event.currentTarget as HTMLElement).closest('.wall-image-container');
		if (!img) return;

		const handleDrag = (e: MouseEvent) => {
			const rect = img.getBoundingClientRect();
			const x = ((e.clientX - rect.left) / rect.width) * 100;
			const y = ((e.clientY - rect.top) / rect.height) * 100;

			const index = route.findIndex((m) => m.id === move.id);
			if (index !== -1) {
				route[index] = {
					...route[index],
					x: Math.max(0, Math.min(100, Math.round(x * 10) / 10)),
					y: Math.max(0, Math.min(100, Math.round(y * 10) / 10))
				};
				route = [...route];
			}
		};

		const handleDragEnd = () => {
			isDragging = false;
			document.removeEventListener('mousemove', handleDrag);
			document.removeEventListener('mouseup', handleDragEnd);
		};

		document.addEventListener('mousemove', handleDrag);
		document.addEventListener('mouseup', handleDragEnd);
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
			/>

			<!-- Render moves as overlays -->
			{#each currentWallMoves as move, idx}
				{@const holdRadius = move.radius || 16}
				<div
					class="absolute"
					style="left: {move.x}%; top: {move.y}%; transform: translate(-50%, -50%);"
				>
					<Popover>
						<Popover.Trigger
							class="btn {isEditing ? 'cursor-move' : 'cursor-pointer'}"
							onmousedown={(e) => isEditing && handleMoveDragStart(e, move)}
						>
							<div
								class="rounded-full border-4 {getMoveBorderColor(move.type)} shadow-lg {isEditing
									? 'hover:scale-110'
									: ''} {editingMove?.id === move.id ? 'ring-4 ring-primary-300' : ''}"
								style="width: {holdRadius * 2}px; height: {holdRadius * 2}px;"
							></div>
						</Popover.Trigger>
						<Portal>
							<Popover.Positioner>
								<Popover.Content
									class="card w-96 bg-surface-500 p-3 shadow-xl min-w-[250px] max-h-[500px]"
								>
									<HoldEditor
										bind:move={currentWallMoves[idx]}
										onUpdateType={(type) => updateMoveType(move, type)}
										onUpdateRadius={(radius) => updateMoveRadius(move, radius)}
										onDelete={() => deleteMove(move)}
										onClose={() => (editingMove = null)}
									/>

									<Popover.Arrow
										class="[--arrow-size:--spacing(4)] [--arrow-background:var(--color-surface-500)]"
									>
										<Popover.ArrowTip />
									</Popover.Arrow>
								</Popover.Content>
							</Popover.Positioner>
						</Portal>
					</Popover>
				</div>
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
					{#if currentWallMoves.length > 0}
						<p class="text-surface-300 text-sm mt-1">
							{currentWallMoves.length} move{currentWallMoves.length !== 1 ? 's' : ''}
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
			<div class="card p-4 mt-4">
				<h4 class="h4 mb-2">Move Legend</h4>
				<div class="flex flex-wrap gap-4 text-sm">
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-success-500 border border-surface-50"></div>
						<span>Hand Start</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-success-400 border border-surface-50"></div>
						<span>Foot Start</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-primary-500 border border-surface-50"></div>
						<span>Hand</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-warning-500 border border-surface-50"></div>
						<span>Foot</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-secondary-500 border border-surface-50"></div>
						<span>Both</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="w-4 h-4 rounded-full bg-error-500 border border-surface-50"></div>
						<span>Finish</span>
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
