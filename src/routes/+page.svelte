<script lang="ts">
  import Icon from "@iconify/svelte";
  import Plot from "svelte-plotly.js";

  let today = new Date();

  let year = today.getFullYear();
  let month = today.getMonth();
  let date = today.getDate();

  let slots = [];

  for (let i = 0; i < 30; i++) {
    let day = new Date(year, month, date + i);
    if ([1, 3, 5].includes(day.getDay())) {
      let item = {
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

      let cancelled_day = new Date(2024, 0, 24);
      if (day.toDateString() == cancelled_day.toDateString()) {
        item.status = "cancelled";
      }
      if (day.toDateString() == new Date(2024, 1, 7).toDateString()) {
        item.status = "no_referrent";
      }
      slots.push(item);
    }
  }


  let refs = [
      {name: 'benoit', range: [new Date(2024, 0, 14, 18, 30), new Date(2024, 0, 14, 21)]},
      {name: 'pierre', range: [new Date(2024, 0, 14, 19, 30), new Date(2024, 0, 14, 22, 0)]},
      {name: 'josiane', range: [new Date(2024, 0, 14, 19, 0), new Date(2024, 0, 14, 22, 0)]}]

  let traces = [];
  let i = 0;
  for (let ref of refs) {
    traces.push({
      x: ref.range,
      y: [i, i],
      type: "scatter"
    });
    i += 1;
  }

  let data = traces;
  let layout = {
    barmode: "stack",
    xaxis: {
      "tickformat": "%H:%M",
      showgrid: false,
      range: [new Date(2024, 0, 14, 18), new Date(2024, 0, 14, 22)]
    },
    yaxis: {
        showgrid: false,
        tick0: 0,
        dtick: 0,
    },
    showlegend: false,
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: {
      //             family: 'Courier New, monospace',
      size: 18,
      color: "white"
    },
      autosize: true,
      margin: {
      b: 50,
      t: 0,
      pad: 4
    },
    width: 500,
  };
 let config = {responsive: true}
</script>

<!-- Responsive Container (recommended) -->
<div class="table-container">
  <!-- Native Table Element -->
  <table class="table table-hover">
    <thead>
    <tr>
      <th>Date</th>
      <th>Creneau</th>
      <th>Plot</th>
    </tr>
    </thead>
    <tbody>
    {#each slots as row, i}
      {#if (i === 0) || (slots[i - 1].day.getMonth() != slots[i].day.getMonth()) }
        <tr>
          <td colspan="3">
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
        {#if row.status == 'no_referrent'}
          <td class="no_referrent">
              <div class="h3">
            Pas de referent pour le moment
              </div>
          </td>
        {:else if row.status == 'cancelled'}
          <td class="cancelled">
            <div class="h3"
              style="display: flex"
            >
              <Icon icon="mdi:alert" />
              <div style="margin-left: 10px">Session annulee</div>
            </div>
          </td>
        {:else}
          <td>
              <div class="h3">
                  {row.range}
              </div>
          </td>
        {/if}

        <td>
            <div>
                <Plot data={data} layout={layout} config={config} />
          </div>
        </td>

      </tr>
    {/each}
    </tbody>

  </table>
</div>

<style>
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
