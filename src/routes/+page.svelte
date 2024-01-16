<script lang="ts">
 import Icon from "@iconify/svelte";

 let today = new Date();

 let year = today.getFullYear();
 let month = today.getMonth();
 let date = today.getDate();

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


  let refs = [
      {name: 'benoit', range: [new Date(2024, 0, 14, 18, 30), new Date(2024, 0, 14, 21)]},
      {name: 'pierre', range: [new Date(2024, 0, 14, 19, 30), new Date(2024, 0, 14, 22, 0)]},
      {name: 'josiane', range: [new Date(2024, 0, 14, 19, 0), new Date(2024, 0, 14, 22, 0)]}]

 for(let ref of refs){
   ref['presence'] = []
   let day = new Date(ref.range[0])
   day.setHours(18, 0)
   console.log(day)
   for(let i=0;i<16; i++){
     let newDateObj = new Date(day.getTime() + i*15*60000);
     ref['presence'].push((newDateObj >= ref.range[0]) && (newDateObj < ref.range[1]))
   }
 }

</script>
<!-- Responsive Container (recommended) -->
<div class="table-container">
  <!-- Native Table Element -->
  <table class="table table-hover">
    <thead>
    <tr>
      <th>Date</th>
      <th>Plot</th>
    </tr>
    </thead>
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
              <div >{row.date}</div>
          </td>
        {#if row.status == 'no_referrent'}
          <td class="no_referrent">
              <div >
            Pas de referent pour le moment
              </div>
          </td>
        {:else if row.status == 'cancelled'}
          <td class="cancelled">
            <div
              style="display: flex"
                class="h3"
            >
              <Icon icon="mdi:alert" />
              <div style="margin-left: 10px">Session annulee</div>
            </div>
          </td>
        {:else}
          <td>
              <table >
                  <thead>
                      <td>Nom</td>
                      <td colspan="4">18:00</td>
                      <td colspan="4">19:00</td>
                      <td colspan="4">20:00</td>
                      <td colspan="4">21:00</td>
                  </thead>

                  <tbody>
                  {#each refs as ref (ref.name)}
                      <tr>
                          <td>{ref.name}</td>
                        {#each ref.presence as present}
                          <td class:present={present}></td>
                          {/each}
                      </tr>
                    {/each}
                  </tbody>
          </td>
        {/if}
      </tr>
    {/each}
    </tbody>

  </table>
</div>

<style>
    thead{
        /*text-align: left;*/
    }
    .present{
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
