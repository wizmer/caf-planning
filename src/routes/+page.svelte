<script lang="ts">
    import Icon from "@iconify/svelte";
    import {edition_enabled, refs, user} from "$lib/stores"

    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth();
    let date = today.getDate();


    let is_updating = false;
    let new_start_point = 0;

    let slots = [];

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

                // date: day.getDay(),
                range: "18-20",
                status: "ok"
            };

            let cancelled_day = new Date(2024, 0, 19);
            if (day.toDateString() == cancelled_day.toDateString()) {
                item.status = "cancelled";
            }
            if (day.toDateString() == new Date(2024, 0, 22).toDateString()) {
                item.status = "no_referrent";
            }
            slots.push(item);
        }
    }



    for (let ref of Object.values(refs)) {
        ref["presence"] = [];
        let day = new Date(ref.range[0]);
        day.setHours(18, 0);
        for (let i = 0; i < 16; i++) {
            let newDateObj = new Date(day.getTime() + i * 15 * 60000);
            let item = '';
            if((newDateObj >= ref.range[0]) && (newDateObj < ref.range[1])){
                item = 'ok'
            }
            ref["presence"].push(item);
        }
    }

 function start_update(i: number, ref: string) {
     if (!$edition_enabled || ref.name != $user) {
         return
     }

     if (!is_updating) {
         refs[$user].presence = Array(16).fill(false);
         refs[$user].presence[i] = 'ok';
         new_start_point = i;
     } else {
         for (let pos = Math.min(new_start_point, i); pos <= Math.max(new_start_point, i); pos++) {
             refs[$user].presence[pos] = 'ok';
         }
     }
     is_updating = !is_updating;
 }

    function on_hover(i: number, ref: string) {
        if (!is_updating || !$edition_enabled || ref.name != $user) {
            return
        }

        refs[$user].presence = Array(16).fill('')

        for (let pos = Math.min(new_start_point, i); pos <= Math.max(new_start_point, i); pos++) {
            refs[$user].presence[pos] = 'temp';
        }
        refs[$user].presence[new_start_point] = 'ok';
    }

    function delete_line() {
        console.log('do you come here?')
        refs[$user].presence = Array(16).fill('')
        console.log(refs)
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
                <div class="table-container">
                    <table class="table table-auto table-hover max-w-prose">
                        <thead class="divide-x divide-x-2">
                        <th>Nom</th>
                        <th colspan="4">18:00</th>
                        <th colspan="4">19:00</th>
                        <th colspan="4">20:00</th>
                        <th colspan="4">21:00</th>
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
                            {#if row.status == 'no_referrent'}
                            <tr>
                                <td class="no_referrent" colspan="100%">
                                    <div class="h3">
                                        Pas de referent·e pour le moment
                                    </div>
                                </td>
                            </tr>
                            {/if}

                            {#each Object.values(refs) as ref}
                                {#if row.status == 'ok' || ($edition_enabled && ref.name == $user)}
                                <tr class="py-0 divide-x divide-y">
                                    <td>
                                        {ref.name}
                                        {#if $edition_enabled && ref.name == $user}
                                            <button class="button" on:click={delete_line}>
                                                <Icon icon="ph:trash" style="color: red"
                                                />
                                            </button>
                                        {/if}

                                    </td>
                                    {#each ref.presence as present, i}
                                        <td class:present={present === 'ok'}
                                                          class:updating={present === 'temp'}
                                            on:mouseenter={()=>on_hover(i, ref)}
                                                          on:click={()=>start_update(i, ref)}></td>
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

 .updating {
     background-color: yellow;
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
