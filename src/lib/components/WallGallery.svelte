<script lang="ts">
	import type { Move } from '$lib/types';
	import type { Wall } from '@prisma/client';

	let { walls, route = $bindable([]) as Move[], isEditing = false } = $props();

	let currentWallIndex = $state(0);
	let selectedHoldType = $state<Move['type']>('hand');
	let editingMove = $state<Move | null>(null);
	let isDragging = $state(false);

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
	let currentWallMoves = $derived(
		route.filter((move) => move.wallId === currentWall?.id).sort((a, b) => a.index - b.index)
	);

	function handleImageClick(event: MouseEvent) {
		if (!isEditing || isDragging) return;

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
			x: Math.round(x * 10) / 10,
			y: Math.round(y * 10) / 10
		};

		route = [...route, newMove];
	}

	function handleMoveClick(event: MouseEvent, move: Move) {
		event.stopPropagation();
		if (!isEditing) return;

		editingMove = editingMove?.id === move.id ? null : move;
	}

	function updateMoveType(move: Move, newType: Move['type']) {
		const index = route.findIndex((m) => m.id === move.id);
		if (index !== -1) {
			route[index] = { ...route[index], type: newType };
			route = [...route];
		}
		editingMove = null;
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

	function getMoveColor(type: Move['type']) {
		const colors = {
			hand_start: 'bg-success-500',
			foot_start: 'bg-success-400',
			hand: 'bg-primary-500',
			foot: 'bg-warning-500',
			both: 'bg-secondary-500',
			finish: 'bg-error-500'
		};
		return colors[type];
	}

	function getMoveLabel(type: Move['type']) {
		const labels = {
			hand_start: 'Hand Start',
			foot_start: 'Foot Start',
			hand: 'Hand',
			foot: 'Foot',
			both: 'Both',
			finish: 'Finish'
		};
		return labels[type];
	}
</script>

{#if walls.length > 0}
	<div class="relative w-full max-w-4xl mx-auto">
		{#if isEditing}
			<div class="card p-4 mb-4">
				<h4 class="h4 mb-3">Hold Type Selection</h4>
				<div class="flex flex-wrap gap-2">
					{#each ['hand_start', 'foot_start', 'hand', 'foot', 'both', 'finish'] as holdType}
						<button
							onclick={() => (selectedHoldType = holdType as Move['type'])}
							class="btn px-4 py-2 {selectedHoldType === holdType
								? 'variant-filled-primary'
								: 'variant-soft'}"
						>
							<div class="flex items-center gap-2">
								<div class="w-3 h-3 rounded-full {getMoveColor(holdType as Move['type'])}"></div>
								{getMoveLabel(holdType as Move['type'])}
							</div>
						</button>
					{/each}
				</div>
				<p class="text-sm text-surface-600 mt-2">
					Click on the wall image to add a {getMoveLabel(selectedHoldType).toLowerCase()} hold. Click
					holds to edit or drag to reposition.
				</p>
			</div>
		{/if}

		<!-- Main Image Display -->
		<div class="relative card overflow-hidden wall-image-container">
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<img
				src="/uploads/{currentWall.photo.file_path}"
				alt={currentWall.name}
				class="w-full h-auto object-contain max-h-96 {isEditing ? 'cursor-crosshair' : ''}"
				onclick={handleImageClick}
			/>

			<!-- Render moves as overlays -->
			{#each currentWallMoves as move, idx}
				<div
					class="absolute transition-all"
					style="left: {move.x}%; top: {move.y}%; transform: translate(-50%, -50%);"
				>
					<!-- Hold marker button -->
					<button
						class={isEditing ? 'cursor-move' : 'cursor-pointer'}
						onclick={(e) => handleMoveClick(e, move)}
						onmousedown={(e) => isEditing && handleMoveDragStart(e, move)}
						aria-label="Hold {idx + 1}"
					>
						<div
							class="w-8 h-8 rounded-full {getMoveColor(
								move.type
							)} border-2 border-surface-50 shadow-lg flex items-center justify-center text-white text-xs font-bold {isEditing
								? 'hover:scale-110'
								: ''} {editingMove?.id === move.id ? 'ring-4 ring-primary-300' : ''}"
						>
							{idx + 1}
						</div>
					</button>

					<!-- Edit popup (outside button) -->
					{#if isEditing && editingMove?.id === move.id}
						<div
							class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
							role="dialog"
							tabindex="-1"
							onclick={(e) => e.stopPropagation()}
							onkeydown={(e) => e.key === 'Escape' && (editingMove = null)}
						>
							<div class="card p-3 shadow-xl min-w-[200px]">
								<h5 class="text-sm font-bold mb-2">Edit Hold #{idx + 1}</h5>
								<div class="flex flex-col gap-1">
									{#each ['hand_start', 'foot_start', 'hand', 'foot', 'both', 'finish'] as holdType}
										<button
											onclick={() => updateMoveType(move, holdType as Move['type'])}
											class="btn btn-sm {move.type === holdType
												? 'variant-filled'
												: 'variant-ghost'} justify-start"
										>
											<div class="flex items-center gap-2">
												<div
													class="w-3 h-3 rounded-full {getMoveColor(holdType as Move['type'])}"
												></div>
												{getMoveLabel(holdType as Move['type'])}
											</div>
										</button>
									{/each}
									<hr class="my-1" />
									<button onclick={() => deleteMove(move)} class="btn btn-sm variant-filled-error">
										Delete Hold
									</button>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/each}

			<!-- Navigation Arrows -->
			{#if walls.length > 1}
				<button
					onclick={prevWall}
					aria-label="Previous wall"
					class="absolute left-4 top-1/2 -translate-y-1/2 btn variant-filled-surface rounded-full w-12 h-12 p-0 flex items-center justify-center hover:scale-110 transition-transform"
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
					class="absolute right-4 top-1/2 -translate-y-1/2 btn variant-filled-surface rounded-full w-12 h-12 p-0 flex items-center justify-center hover:scale-110 transition-transform"
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
				<div class="badge variant-filled-surface absolute top-4 right-4">
					{currentWallIndex + 1} / {walls.length}
				</div>
			{/if}
		</div>

		<!-- Current Wall Holds (Editing Mode) -->
		{#if isEditing && currentWallMoves.length > 0}
			<div class="card p-4 mt-4">
				<h4 class="h4 mb-2">Current Wall: {currentWallMoves.length} Holds</h4>
				<div class="flex flex-wrap gap-2">
					{#each currentWallMoves as move, idx}
						<button
							onclick={(e) => handleMoveClick(e, move)}
							class="chip {editingMove?.id === move.id ? 'variant-filled-primary' : 'variant-soft'}"
						>
							<div class="flex items-center gap-1">
								<div class="w-3 h-3 rounded-full {getMoveColor(move.type)}"></div>
								<span>#{idx + 1}</span>
							</div>
						</button>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Move Legend (View Mode) -->
		{#if !isEditing}
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
							src="/uploads/{wall.photo.file_path}"
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
