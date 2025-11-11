<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Gym } from '@prisma/client';
	import type { ActionData } from '@sveltejs/kit';

	export let form: ActionData = null;
	export let gym: Gym | null = null;
	export let isEditing = false;
	export let cancelUrl = '/pan/gym';

	let gymName = gym?.name || '';
	let gymDescription = gym?.description || '';
	let isSubmitting = false;

	$: submitText = isEditing ? 'Update Gym' : 'Create Gym';
	$: submittingText = isEditing ? 'Updating...' : 'Creating...';
</script>

<form
	method="POST"
	use:enhance={() => {
		isSubmitting = true;
		return async ({ update }) => {
			isSubmitting = false;
			update();
		};
	}}
	class="space-y-4"
>
	<label class="label">
		<span>Gym Name *</span>
		<input
			class="input"
			type="text"
			name="gymName"
			bind:value={gymName}
			placeholder="e.g., Boulder Central, Rock City Climbing"
			required
		/>
	</label>

	<label class="label">
		<span>Description</span>
		<textarea
			class="textarea"
			name="gymDescription"
			bind:value={gymDescription}
			placeholder="Optional description of the gym..."
			rows="4"
		/>
	</label>

	{#if form?.error}
		<aside class="alert variant-filled-error">
			<div class="alert-message">
				<p>{form.error}</p>
			</div>
		</aside>
	{/if}

	<div class="flex gap-4">
		<button type="submit" disabled={isSubmitting} class="btn variant-filled-primary flex-1">
			{isSubmitting ? submittingText : submitText}
		</button>
		<a href={cancelUrl} class="btn variant-soft-surface">Cancel</a>
	</div>
</form>
