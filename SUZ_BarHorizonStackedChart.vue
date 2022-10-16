<template>
  <div class="p-d-flex p-jc-center p-ai-center p-flex-column" style="position: relative; min-height: 50px">
    <div v-if="loading" class="p-d-flex p-jc-center p-ai-center" style="width: 100%; top: 25%">
      <ProgressSpinner style="width:50px; height:50px" />
    </div>
    <div v-if="error" class="chart-error p-d-flex p-jc-center p-ai-center">
      <p>{{ errorMessage }}</p>
    </div>
    <canvas v-show="!loading && !error" v-bind:id="'chart-' + id"></canvas>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import ApiService from "@/services/api.service";
import { backgroundsForCharts, bordersForCharts } from "@/components/Common_Options/ColorsForCharts";
import { companyColors } from "@/components/Common_Options/CompanyColors";
import barHorizonStackedOptoins from "@/components/SUZ/Charts_Options/SUZ_BarHorizonStackedOptoins";

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
      chartDataItemsCount: 0, // количество полей с названиями (для расчета высоты графика)
      backgroundsForCharts: backgroundsForCharts,
      bordersForCharts: bordersForCharts,
      companyColors: companyColors,
      options: barHorizonStackedOptoins,
      loading: true,
      error: false,
      errorMessage: null,
      chartItem: null,
    };
  },

  props: {
    resData: Object,
    valueAxis: String,
    id: Number,
    isTicksEnabled: Boolean,
    type: String || null,
    reqTitle: String,
    reqName: String,
    reqGroupBy: String,
    reqBody: Object,
  },

  watch: {
    reqBody: {
      handler() {
        this.getData();
      },
      deep: true
    },
    reqName() {
      this.getData()
    }
  },

  methods: {
    // Обновляем график после получения новых данных
    updateChart() {
        this.chartItem.destroy();
        this.createChart();
    },

    // Изменение размеров графика после каждого обновления
    resizeChart() {
      const oneItemHeightSize = 20; // высота одного элемента графика
      const ctx = document.getElementById(`chart-${this.id}`);
      const parentComponentDiv = ctx.parentElement;
      // const aspectRatio = this.options.options.aspectRatio;
      // const aspectRatio = 1.5;
      // ctx.width = parseInt(parentComponentDiv.offsetWidth);
      // ctx.height = ctx.width / aspectRatio;
      parentComponentDiv.style.height = this.chartDataItemsCount * oneItemHeightSize + 'px';
    },
    
    // Отображаем график
    createChart() {
      this.resizeChart();
      if (this.chartDataItemsCount === 0) {
        this.errorMessage = "Нет данных для отображения";
        this.error = true;
      } else {
        const ctx = document.getElementById(`chart-${this.id}`);
        const chartObjectProperties = {
          type: this.type ? this.type : "bar",
          data: this.chartData.data,
          options: {...this.options.options},
          plugins: [ChartDataLabels]
        };
  
        this.chartItem = new Chart(ctx, chartObjectProperties);
      }
      // window.addEventListener("resize", this.resizeChart);
    },
    
    // Формирование объекта данных для горизонтально ориентированного графика
    // modifyDataForHorizonChart(data) {
    //   for (let i = 0; i < data.length; i++) {
      //     const newLabels = data[i].department;
    //     this.chartData.data.labels.push(newLabels);

    //     for (let j = 0; j < data[i].units.length; j++) {
      //       const datasetObject = {
    //         label: "",
    //         data: [],
    //         backgroundColor: "",
    //         borderColor: "",
    //       };
    //       datasetObject.label = data[i].units[j].name;
    //       datasetObject.backgroundColor = Object.values(backgroundsForCharts)[i];
    //       datasetObject.borderColor = Object.values(bordersForCharts)[i];
    //       for (let k = 0; k < data.length; k++) {
      //         datasetObject.data.push('null');
    //       }
    //       datasetObject.data[i] = data[i].units[j].count;
    //       this.chartData.data.datasets.push(datasetObject);
    //     }
    //   }
    // },

    // Формирование объекта данных для вертикально ориентированного графика
    modifyDataForVerticalChart(data) {
      this.options.options.scales.yAxis.ticks.display = this.isTicksEnabled || false;
      this.chartData.data.labels = [];
      this.chartData.data.datasets = [];

      const datasetObject = {
        label: [],
        longLabel: [],
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
      };
      let nameCount = 0; // количество полей с названиями (для расчета высоты графика)
      let nameMaxLength = null; // длина самого длинного названия
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].units.length;  j++) {
          if (data[i].units[j].count !== 0) { // не включаем данные с нулевыми значениями
            j === 0 ? this.chartData.data.labels.push(data[i].department) : this.chartData.data.labels.push(""); // Формируем подписи групп блоков 
            datasetObject.label.push(data[i].units[j].shortName); // это поле отображается слева от шкалы, как подпись по оси Y
            datasetObject.longLabel.push(data[i].units[j].name); // поле для вывода расшифровок аббревиатур в подсказках
            datasetObject.data.push(data[i].units[j].count); // поле для отображения в качестве количественного значения на графике
            datasetObject.backgroundColor.push(Object.values(companyColors)[i]);
            datasetObject.borderColor.push(Object.values(companyColors)[i]);
            nameMaxLength = data[i].units[j].shortName.length > nameMaxLength ? data[i].units[j].shortName.length : nameMaxLength
            nameCount++;
          }
        }
      }
      this.chartData.data.datasets.push(datasetObject);
      this.chartDataItemsCount = nameCount;
      this.options.options.scales.yAxis.grid.tickLength = nameMaxLength * 5.5;
    },
    
    // Получаем данные для построения графика
    getData() {
      this.loading = true;
      this.error = false;
      if (!this.resData) {  // Временный блок - убрать после завершения!
        ApiService.getSUZData(this.reqTitle, this.reqName, this.reqGroupBy, this.reqBody)
          .then((data) => {
            this.modifyDataForVerticalChart(data);
            if (this.chartItem) {
              this.updateChart();
            }
            else {
              this.createChart();
              // window.addEventListener("resize", this.chartItem.update);
            }
            this.loading = false;
          })
          .catch((error) => {
            this.error = true;
            this.loading = false;
            this.errorMessage = error.message;
          });
      } else { // Временный блок - убрать после завершения!
        this.modifyDataForVerticalChart(this.resData);
          if (this.chartItem) {
            this.updateChart();
          }
          else {
            this.createChart();
          }
          this.loading = false;
      } // Временный блок - убрать после завершения!
    },
  },

  mounted() {
    this.getData();
  },
};
</script>

<style lang="scss" scoped>

.chart-error {
  width: 100%;
  text-align: center;
  color: rgb(194,9,55);
  font-size: 1rem;
  font-weight: 500;
}
</style>