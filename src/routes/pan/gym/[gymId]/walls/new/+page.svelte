<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import { FileIcon } from '@lucide/svelte';
	import { FileUpload } from '@skeletonlabs/skeleton-svelte';
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

	<a href={`/pan/gym/${page.params.gymId}/walls`} class="btn preset-tonal">← Back to Gyms</a>

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

			<FileUpload
				name="photos"
				accept={['image/jpeg', 'image/png', 'image/webp']}
				maxFiles={10}
				maxFileSize={10 * 1024 * 1024}
				onFileAccept={(details) => {
					files = details.files as any;
				}}
			>
				<FileUpload.Label>Upload your files</FileUpload.Label>
				<FileUpload.Dropzone>
					<FileIcon class="size-10" />
					<span>Select file or drag here.</span>
					<FileUpload.Trigger>Browse Files</FileUpload.Trigger>
					<FileUpload.HiddenInput />
				</FileUpload.Dropzone>
				<FileUpload.ItemGroup>
					<FileUpload.Context>
						{#snippet children(fileUpload)}
							{#each fileUpload().acceptedFiles as file (file.name)}
								<FileUpload.Item {file}>
									<FileUpload.ItemName>{file.name}</FileUpload.ItemName>
									<FileUpload.ItemSizeText>{file.size} bytes</FileUpload.ItemSizeText>
									<FileUpload.ItemDeleteTrigger />
								</FileUpload.Item>
							{/each}
						{/snippet}
					</FileUpload.Context>
				</FileUpload.ItemGroup>
				<FileUpload.ClearTrigger>Clear Files</FileUpload.ClearTrigger>
			</FileUpload>

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
			<aside class="alert preset-filled-error-500">
				<div class="alert-message">
					<p>{form.error}</p>
				</div>
			</aside>
		{/if}

		<button type="submit" disabled={isUploading} class="btn preset-filled-primary-500 w-full">
			{isUploading ? 'Uploading...' : 'Upload Wall'}
		</button>
	</form>
</div>
