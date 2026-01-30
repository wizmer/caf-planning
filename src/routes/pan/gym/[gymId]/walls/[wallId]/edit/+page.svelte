<script lang="ts">
	import { enhance } from '$app/forms';
	import { PUBLIC_UPLOAD_URL } from '$env/static/public';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let files: FileList = $state();
	let wallName = $state(data.wall.name);
	let wallDescription = $state(data.wall.description || '');
	let isUploading = $state(false);

	function validateFiles(fileList: FileList): boolean {
		const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
		const maxSize = 10 * 1024 * 1024; // 10MB

		return Array.from(fileList).every(
			(file) => validTypes.includes(file.type) && file.size <= maxSize
		);
	}

	function handleSubmitValidation() {
		if (!wallName.trim()) {
			return 'Wall name is required';
		}

		if (files && files.length > 0 && !validateFiles(files)) {
			return 'Please upload only valid image files (JPEG, PNG, WebP) under 10MB';
		}

		return null;
	}
</script>

<div class="container mx-auto p-4 space-y-4 max-w-2xl">
	<!-- Go back link -->
	<a href={`/pan/gym/${data.gym.id}/walls`} class="btn preset-tonal">← Back to Walls</a>

	<h1 class="h1">Edit Wall: {data.wall.name}</h1>

	{#if data.wall.photo}
		<div class="card">
			<header class="card-header">
				<img
					src="{PUBLIC_UPLOAD_URL}/{data.wall.photo.file_path}"
					alt={data.wall.name}
					class="w-full h-64 object-cover rounded-t-container-token"
				/>
			</header>
			<section class="p-4">
				<p class="text-sm opacity-75">Current wall photo (upload a new one to replace)</p>
			</section>
		</div>
	{/if}

	<form
		method="POST"
		enctype="multipart/form-data"
		use:enhance={() => {
			const error = handleSubmitValidation();
			if (error) {
				alert(error);
				return ({ cancel }) => cancel();
			}

			isUploading = true;
			return async ({ update }) => {
				isUploading = false;
				update();
			};
		}}
		class="space-y-4"
	>
		<label class="label">
			<span>Wall Name *</span>
			<input
				class="input"
				type="text"
				name="wallName"
				bind:value={wallName}
				placeholder="e.g., Main Wall, Cave Section, Overhang Area"
				required
			/>
		</label>

		<label class="label">
			<span>Description</span>
			<textarea
				class="textarea"
				name="wallDescription"
				bind:value={wallDescription}
				placeholder="Optional description of the wall section..."
				rows="3"
			></textarea>
		</label>

		<label class="label">
			<span>Replace Photo (optional)</span>
			<FileUpload
				bind:files
				name="photos"
				accept="image/*"
				classes="border-2 border-dashed border-primary-500 p-6 rounded-container bg-primary-50-950"
			>
				{#snippet lead()}
					<div class="text-center">
						<svg
							class="mx-auto h-12 w-12 fill-token"
							stroke="currentColor"
							fill="none"
							viewBox="0 0 48 48"
						>
							<path
								d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<p class="mt-2 text-sm">Drop new wall photo here or click to browse</p>
						<p class="text-xs opacity-50">PNG, JPG, WebP up to 10MB</p>
					</div>
				{/snippet}
			</FileUpload>

			{#if files && files.length > 0}
				<div class="mt-2">
					<p class="text-sm">New photo selected:</p>
					<ul class="list text-xs opacity-75 mt-1">
						{#each files as file}
							<li>• {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</li>
						{/each}
					</ul>
				</div>
			{/if}
		</label>

		{#if form?.error}
			<aside class="alert preset-filled-error-500">
				<div class="alert-message">
					<p>{form.error}</p>
				</div>
			</aside>
		{/if}

		<div class="flex gap-2">
			<button type="submit" disabled={isUploading} class="btn preset-filled-primary-500 flex-1">
				{isUploading ? 'Updating...' : 'Update Wall'}
			</button>
			<a href={`/pan/gym/${data.gym.id}/walls`} class="btn preset-tonal">Cancel</a>
		</div>
	</form>
</div>
