<script lang="ts">
 // Most of your app wide CSS should be put in this file
 import { dev, browser } from '$app/environment';
 import '../app.postcss';
 import { page } from '$app/stores';
 import { base } from '$app/paths';
 import { AppShell, AppBar, LightSwitch, Toast, initializeStores } from '@skeletonlabs/skeleton';
 import Icon from '@iconify/svelte';
 import icon from '$lib/assets/big-icon.png';
 import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
 import { storePopup } from '@skeletonlabs/skeleton';
 import '../app.postcss';
 import { goto } from '$app/navigation';
 import { Modal, getModalStore } from '@skeletonlabs/skeleton';
 import type { ModalSettings, ModalComponent, ModalStore } from '@skeletonlabs/skeleton';
 import ModalLogin from './ModalLogin.svelte';
 import {user} from '$lib/stores'
 import {edition_enabled} from "$lib/stores"

 initializeStores();
 storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });


 const modalStore = getModalStore();
 const modalRegistry: Record<string, ModalComponent> = {
	   modalLogin: { ref: ModalLogin },
 };

</script>

<Toast />
<Modal components={modalRegistry} />

<AppShell >
	<svelte:fragment slot="header">
		<AppBar background="variant-filled-primary">
			<svelte:fragment slot="lead">
					<img src={icon} alt="icon-caf" class="w-12" />
					<h1 class="h1">Planning des creneaux libres</h1>
			</svelte:fragment>

			<svelte:fragment slot="trail">
          <LightSwitch />

          {#if $user && $edition_enabled}
                  <button class="btn border" on:click={()=>{$edition_enabled=false}}>
                      {$user}: sortir du mode edition
                  </button>
              {:else}
              <button class="btn border" on:click={()=>modalStore.trigger({
	                                                type: 'component',
	                                                component: 'modalLogin',
                                                  })}>

						      Espace staff
					    </button>
          {/if}


      </svelte:fragment>


		</AppBar>
	</svelte:fragment>

	<slot />
</AppShell>
