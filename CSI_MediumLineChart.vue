<template>
  <div class="p-dflex p-jc-center p-ai-center" style="position: relative;">
    <div v-if="loading" class="p-d-flex p-jc-center p-ai-center" style="width: 100%; height: 100px">
      <ProgressSpinner style="width: 50px; height: 50px" />
    </div>
    <div v-if="error" class="chart-error p-d-flex p-jc-center p-ai-center">
      <p>{{ errorMessage }}</p>
    </div>
    <canvas v-show="!loading && !error" v-bind:id="'chart-' + id"></canvas>
    <div v-if="!loading && !error" class="p-d-flex p-flex-column p-jc-center p-ai-center">
      <div class="chart-legend_wrapper">
        <li
          v-for="item in datasetsForLegend"
          :key="item.id"
          class="chart-legend_item"
        >
          <div
            class="chart-legend_square"
            :style="{background: item.borderColor}"
          >
          </div>
          <div class="chart-legend_text">{{ item.label }}</div>
        </li>
      </div>

      <div class="chart-min-max_wrapper p-mt-3 p-mx-3">
        <div class="p-mb-3 p-jc-center p-d-flex p-flex-column">
          <div class="p-d-flex p-flex-row p-ai-center" :style="{'border-bottom': '1px solid ' + companyColors.lightGrey}">
            <div class="chart-min-max_title p-my-1">Минимальная оценка:</div>
            <div class="chart-min-max_index p-my-1" :style="{'color': 'red'}">{{tableMinMaxComputed.min.index}}</div>
            <div class="p-d-flex p-flex-wrap">
              <div
                v-for="(item) in tableMinMaxComputed.min.customers"
                :key="item.id"
                class="chart-min-max_text"
              >
                {{item}}
              </div>
            </div>
          </div>
          <div class="p-d-flex p-flex-row p-ai-center" :style="{'border-bottom': '1px solid ' + companyColors.lightGrey}">
            <div class="chart-min-max_title p-my-1">Максимальная оценка:</div>
            <div class="chart-min-max_index p-my-1" :style="{'color': 'green'}">{{tableMinMaxComputed.max.index}}</div>
            <div class="p-d-flex p-flex-wrap">
              <div
                v-for="(item) in tableMinMaxComputed.max.customers"
                :key="item.id"
                class="chart-min-max_text"
              >
                {{item}}
              </div>
            </div>
          </div>
        </div>   
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ApiService from "@/services/api.service";
import { bordersForCharts, backgroundsForCharts, } from "@/components/Common_Options/ColorsForCharts";
import { companyColors } from "@/components/Common_Options/CompanyColors";
import mediumLineChartOptions from "@/components/CSI/Charts_Options/CSI_MediumLineChartOptions";
Chart.register(...registerables);

export default {
  data() {
    return {
      chartData: {
        data: {
          labels: [],
          datasets: [],
        },
      },
      options: mediumLineChartOptions(),
      loading: true,
      error: false,
      errorMessage: null,
      chartItem: null,
      tableMinMax: {
        min: {},
        max: {}
      },
      companyColors: companyColors,
      bordersForCharts: bordersForCharts,
      backgroundsForCharts: backgroundsForCharts
    };
  },
    props: {
    id: Number,
    reqTitle: String,
    reqName: String,
    selectedYear: Object,
    isPeriodic: Boolean,
    ratioForChart: Number,
  },
  computed: {
    datasetsForLegend() {
      return this.chartData.data.datasets;
      // return this.chartData.data.datasets.slice(0, this.chartData.data.datasets.length -1);
    },
    tableMinMaxComputed() {
      return this.tableMinMax;
    }
  },
  watch: {
    selectedYear(newY) {
      if (newY.value && !this.loading) {
        this.getData()
      }
    },
  },
  methods: {
    // Обновляем график после получения новых данных
    updateChart() {
      this.chartItem.destroy();
      this.createChart();
    },

    // Отображаем график
    createChart() {
      // this.options.options.scales.x.title.text = this.titleAxesX;
      const ctx = document.getElementById(`chart-${this.id}`);
      const chartObjectProperties = {
        type: this.type ? this.type : "line",
        data: this.chartData.data,
        plugins: [ChartDataLabels],
        options: this.options.options,
      };
      this.chartItem = new Chart(ctx, chartObjectProperties);
      this.loading = false;
    },
    // Формирование объекта данных для графика
    createChartDataObject(resData) {
      this.options.options.aspectRatio = this.ratioForChart || 2;

      this.tableMinMax.min = resData.data.min;
      this.tableMinMax.max = resData.data.max;
      // Формирование массива данных для линии "минимально требуемого уровня".
      // Необходимо для заполнения области ниже этого значения определенным цветом. 
      const demandedIndex = 7.2; // Задаем требуемое значение.
      const demandedArray = [];
      for (let i = 0; i <= resData.data.datasets[2].data.length - 1; i++) {
        const demandedArrayElement = (resData.data.datasets[2].data[i] <= demandedIndex) ? demandedIndex : resData.data.datasets[2].data[i];
        demandedArray.push(demandedArrayElement);
      }
      const demandedLine = {
        data: demandedArray,
        borderWidth: 0,
        tension: 0.2,
        borderColor: "transparent",
        backgroundColor: "transparent",
        pointRadius: 0, // скрываем точки на графике. Эта же опция убираем значения во всплывающих подсказках
        hidden: false // данную линию не отображаем на общем графике
      };

      // Данные для остальных графиков: 
      this.chartData.data.datasets = [];
      this.chartData.data.labels = resData.data.labels;
        for (let i = 0; i < resData.data.datasets.length; i++) {
          const lineData = {
            data: resData.data.datasets[i].data,
            label: resData.data.datasets[i].label,
            customers: resData.data.datasets[i].customers,
            borderWidth: (i == 0) ? 3 : 2,
            backgroundColor: (i == 0) ? companyColors.darkGrey : (i == 1) ? backgroundsForCharts.green : backgroundsForCharts.red,
            borderColor: (i == 0) ? companyColors.darkGrey : Object.values(bordersForCharts)[i],
            fill: 
              (i == 2) ? ({target: "3", above: "transparent", below: backgroundsForCharts.red}): // минимальные значения
              (i == 1) ? {target: "3", above: backgroundsForCharts.green, below: "transparent"} : "none", // максимальные значения
            // fill: 
            //   (i == 2) ? ({target: {value: demandedIndex}, above: "transparent", below: backgroundsForCharts.red}): // минимальные значения
            //   (i == 1) ? {target: "2", above: backgroundsForCharts.green, below: "transparent"} : "none", // максимальные значения
            tension: 0.2,
            datalabels: {
              align: "end",
              anchor: "end",
            },
          };
          this.chartData.data.datasets.push(lineData);
        }
      this.chartData.data.datasets.push(demandedLine);
    },
    // Получаем данные для построения графика
    getData() {
      this.loading = true;
      this.error = false;
      ApiService.getCSIDataForPeriod(this.reqTitle, this.reqName, this.isPeriodic, this.selectedYear.value)
        .then((data) => {
          this.createChartDataObject(data);
          this.loading = false;
          if (this.chartItem) {
            this.updateChart();
          } else this.createChart();
        })
        .catch((error) => {
          this.errorMessage = error.message;
          this.error = true;
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>
.chart-legend_ {
  &wrapper {
    display: flex;
    justify-content: center;
    height: 15px;
    margin: 0;
    margin-bottom: 0.4rem;
    padding-left: 0;
  }
  &item {
    display: inline-flex;
    font-size: 0.8rem;
    list-style-type: none;
  }
  &square {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    margin-left: 1rem;
    margin-right: 0.3rem;
  }
  &text {
    height: 15px;
    display: flex;
    align-items: flex-end;
  }
}
.chart-error {
  width: 100%;
  text-align: center;
  color: rgb(194,9,55);
  font-weight: 500;
}
.chart-min-max_{
  &wrapper {
    width: 85%;
  }
  &title {
    height: 1.5rem;
    font-size: 0.9rem;
    display: flex;
    flex-wrap: wrap;
    min-width: 11rem; 
  }
  &index {
    height: 1.5rem;
    min-width: 2rem;
    text-align: end;
  }
  &text {
    font-size: 0.8rem;
    margin-left: 2rem;
    padding: 2px;
  }
}
</style>