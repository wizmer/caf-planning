<script lang="ts">
  import Icon from "@iconify/svelte";

  let today = new Date();

  let year = today.getFullYear();
  let month = today.getMonth();
  let date = today.getDate();

  let current_user = "benoit";

  let edition_enabled = true;

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
            day: "numeric"
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


  let refs = {
    benoit: { name: "benoit", range: [new Date(2024, 0, 14, 18, 30), new Date(2024, 0, 14, 21)] },
    pierre: { name: "pierre", range: [new Date(2024, 0, 14, 19, 30), new Date(2024, 0, 14, 22, 0)] },
    josiane: { name: "josiane", range: [new Date(2024, 0, 14, 19, 0), new Date(2024, 0, 14, 22, 0)] }
  };

  for (let ref of Object.values(refs)) {
    ref["presence"] = [];
    let day = new Date(ref.range[0]);
    day.setHours(18, 0);
    for (let i = 0; i < 16; i++) {
      let newDateObj = new Date(day.getTime() + i * 15 * 60000);
      ref["presence"].push((newDateObj >= ref.range[0]) && (newDateObj < ref.range[1]));
    }
  }

  function start_update(i: number) {
    if (!is_updating) {
      refs[current_user].presence = Array(16).fill(false);
      refs[current_user].presence[i] = true;
      new_start_point = i;
    } else {
      for (let pos = Math.min(new_start_point, i); pos <= Math.max(new_start_point, i); pos++) {
        refs[current_user].presence[pos] = true;
      }
    }
    is_updating = !is_updating;
  }

  function delete_line() {
    console.log('do you come here?')
    refs[current_user].presence = Array(16).fill(false)
    console.log(refs)
  }

</script>

<div class="table-container">
  <!-- Native Table Element -->
  <table class="table table-hover">
    <tbody>
    {#each slots as row,i (row.id)}
      {#if (i === 0) || (slots[i - 1].day.getMonth() != slots[i].day.getMonth()) }
        <tr>
          <td colspan="2">
            <div class="h2">
              {row.month}
            </div>
          </td>
        </tr>
      {/if}
      <tr>
        <td>
          <div class="h3">{row.date}</div>
        </td>
        <td>

          <div class="table-container">
            <table class="table table-hover max-w-prose">
              <thead class="divide-x">
              <th>Nom</th>
              <th colspan="4">18:00</th>
              <th colspan="4">19:00</th>
              <th colspan="4">20:00</th>
              <th colspan="4">21:00</th>
              </thead>

              <tbody>

              {#if row.status == 'no_referrent'}
                <tr>
                  <td class="no_referrent" colspan="16">
                    <div class="h3">
                      Pas de referent pour le moment
                    </div>
                  </td>
                </tr>
              {:else if row.status == 'cancelled'}
                <tr>
                  <td class="cancelled" colspan="16">
                    <div
                      class="h3"
                    >
                      Session annulee
                    </div>
                  </td>
                </tr>
              {:else}
                {#each Object.values(refs) as ref}
                  <tr class="py-0 divide-x divide-y">
                    <td>
                      {ref.name}
                      {#if edition_enabled && ref.name == current_user}
                        <button class="button" on:click={delete_line} >
                          <Icon icon="ph:trash" style="color: red"
                                />
                        </button>
                      {/if}

                    </td>
                    {#each ref.presence as present, i}
                      <td class:present={present} on:click={()=>start_update(i, ref)}></td>
                    {/each}
                  </tr>
                {/each}
              {/if}
              </tbody>
            </table>
          </div>
        </td>
      </tr>
    {/each}
    </tbody>
  </table>
</div>

<style>
    th {
        text-align: left;
    }

    .present {
        background-color: green;
    }

    .no_referrent {
        color: orange;
    }

    .cancelled {
        color: rgba(225, 4, 4, 0.77);
    }

    td[colspan]:not([colspan="1"]) {
        text-align: center;
    }
</style>
