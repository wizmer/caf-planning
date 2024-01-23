<script lang="ts">
 import Icon from "@iconify/svelte";
 import {user} from "$lib/stores"
 import SveltyPicker from 'svelty-picker'
 import { ListBox, LightSwitch, ListBoxItem } from '@skeletonlabs/skeleton';

 import type { PageData } from './$types';
 import { dev } from '$app/environment';
 let calendar = {};
 export let data: PageData;

 let today = new Date();

 let year = today.getFullYear();
 let month = today.getMonth();
 let date = today.getDate();
 let is_updating = false;
 let new_start_point = 0;

 let slots = [];

 let timeslots = []
 for(let i=0;i<4; i++){
     timeslots.push(`${18+i}:00`)
     timeslots.push(`${18+i}:30`)
 }
 timeslots.push(`22:00`)

 for (let i = 0; i < 30; i++) {
     let day = new Date(year, month, date + i);
     if ([1, 3, 5].includes(day.getDay())) {
         let item = {
             id: i,
             day: day,
             month: day.toLocaleDateString(
                 "fr",
                 {
                     year: "numeric",
                     month: "long"
                 }
             ),
             date: day.toLocaleDateString(
                 "fr",
                 {
                     weekday: "long",
                     day: "numeric",
                     month: "long"
                 }
             ),
             status: "ok",
             adding_slot: false,
         };

         let cancelled_day = new Date(2024, 0, 19);
         if (day.toDateString() == cancelled_day.toDateString()) {
             item.status = "cancelled";
         }

         item.refs = data.slots[day] || {}
         slots.push(item);
     }
 }

</script>


<div>
    {#each slots as row,i (row.id)}
        {#if (i === 0) || (slots[i - 1].day.getMonth() != slots[i].day.getMonth()) }
            <div class="h2 p-4">
                {row.month}
            </div>
        {/if}

        <div class="card">

            <header class="card-header">
                <div class="h3">{row.date}</div>
            </header>

            <section class="p-4">
                {#if row.status != 'cancelled'}
                    <div>

                        {#if $user}
                        {#if !row.refs[$user].start && !row.refs[$user].end && !row.adding_slot}
                            <button type="button" class="btn bg-primary-500"
                            on:click={()=>{row.adding_slot=true}}>
                                Ajouter mon creneau
                            </button>
                        {:else }
                        Mon creneau:
                        De:
                        <select class="border rounded" bind:value={row.refs[$user].start}>
                            {#each timeslots.slice(0, -1) as time}
                                <option value={time}>{time}</option>
                            {/each}
                        </select>

                        A:
                        <select class="border rounded" bind:value={row.refs[$user].end}>
                            {#each timeslots.slice(1) as time}
                                {#if !row.refs[$user].start || row.refs[$user].start < time}
                                <option value={time}>{time}</option>
                                {/if}
                            {/each}
                        </select>

                        <button type="button" class="btn text-white bg-red-400 hover:bg-red-500"
                                on:click={()=>{

                                         row.refs[$user].start = '';
                                         row.refs[$user].end = '';
                                         row.adding_slot = false
                                         }}
                        >
                            Enlever mon creneau
                        </button>

                        {/if}

                        {/if}
                    </div>
                {/if}

                <div class="table-container">
                    <table class="table table-auto table-hover max-w-prose">
                        <thead class="divide-x divide-x-2">
                            <th>Nom</th>
                            <th colspan="2">18:00</th>
                            <th colspan="2">19:00</th>
                            <th colspan="2">20:00</th>
                            <th colspan="2">21:00</th>
                        </thead>

                        <tbody>

                            {#if row.status == 'cancelled'}
                                <tr>
                                    <td class="cancelled" colspan="100%">
                                        <div
                                            class="h3"
                                        >
                                            Session annulee
                                        </div>
                                    </td>
                                </tr>
                            {:else}
                                {#if slots[i].refs.length == 0}
                                    <tr>
                                        <td class="no_referrent" colspan="100%">
                                            <div class="h3">
                                                Pas de referent·e pour le moment
                                            </div>
                                        </td>
                                    </tr>
                                {/if}

                                {#each Object.values(slots[i].refs) as ref}
                                    {#if row.status == 'ok'}
                                        <tr class="py-0 divide-x divide-y">
                                            <td>
                                                {ref.name}
                                            </td>


                                            {#each timeslots.slice(0, -1) as time, i}
                                                <td class:present={ref.start<=time && ref.end>time}
                                                ></td>
                                            {/each}
                                        </tr>
                                    {/if}
                                {/each}
                            {/if}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    {/each}
</div>

<style>
 .table thead th {
     padding-left: 2px !important;
     padding-right: 2px !important;
 }

 .table tbody td {
     padding-left: 0;
 }

 table {
     margin: auto
 }

 div {
     text-align: center
 }

 th {
     text-align: left;
 }

 .present {
     background-color: green;
 }

 .no_referrent {
     color: rgba(var(--color-warning-500) / 1);

 }

 .cancelled {
     color: rgba(var(--color-error-500) / 1);
 }

 .card {
     margin-top: 20px;
     margin-bottom: 20px;
 }

</style>
