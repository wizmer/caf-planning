<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let files: FileList = $state();
	let wallName = $state('');
	let wallDescription = $state('');
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

		if (!files || files.length === 0) {
			return 'Please select at least one image';
		}

		if (!validateFiles(files)) {
			return 'Please upload only valid image files (JPEG, PNG, WebP) under 10MB';
		}

		return null;
	}
</script>

<div class="container mx-auto p-4 space-y-4 max-w-2xl">
	<!-- Go back link -->

	<a href={`/pan/gym/${page.params.gymId}/walls`} class="btn variant-soft">← Back to Gyms</a>

	<h1 class="h1">Upload Wall Photos</h1>

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
			<span>Photos *</span>
			<FileDropzone
				bind:files
				name="photos"
				accept="image/*"
				multiple
				classes="border-2 border-dashed border-primary-500 p-6 rounded-container-token bg-primary-50-900-token"
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
							<p class="mt-2 text-sm">Drop wall photos here or click to browse</p>
							<p class="text-xs opacity-50">PNG, JPG, WebP up to 10MB each</p>
						</div>
					
							{/snippet}
			</FileDropzone>

			{#if files && files.length > 0}
				<div class="mt-2">
					<p class="text-sm">{files.length} file(s) selected:</p>
					<ul class="list text-xs opacity-75 mt-1">
						{#each files as file}
							<li>• {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)</li>
						{/each}
					</ul>
				</div>
			{/if}
		</label>

		{#if form?.error}
			<aside class="alert variant-filled-error">
				<div class="alert-message">
					<p>{form.error}</p>
				</div>
			</aside>
		{/if}

		<button type="submit" disabled={isUploading} class="btn variant-filled-primary w-full">
			{isUploading ? 'Uploading...' : 'Upload Wall'}
		</button>
	</form>
</div>
