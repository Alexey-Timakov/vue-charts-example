import numberConverter from "@/utils/NumberConverter";

function mediumLineChartOptions() {
  return {
    options: {
      layout: {
        padding: 20
      },
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      elements: {
        point: {
          radius: 3,
          hoverRadius: 10,
          pointHitRadius: 50,
          pointStyle : "circle",
        }
      },
      plugins: {
        legend: {
          display: false,
          position: "right",
          labels: {
            boxWidth: 15,
          },
        },
        datalabels: {
          // clamp: true,
          // anchor: 'center',
          align: 'bottom',
          offset: 2,
          backgroundColor: function(context) {
            return context.dataset.backgroundColor;
          },
          borderColor: function(context) {
            return context.dataset.borderColor;
          },
          borderRadius: 5,
          borderWidth: 1,
          color: function(context) {
            return context.datasetIndex != 0 ? "black" : "white";
          },
          formatter: function (value) { // преобразуем число на секторах в строку вида "1 000 000"
            return numberConverter(value);
          },
          display: function(context) {
            return context.datasetIndex != 3; // не показываем на графике данные из 3-го ряда данных
          },
          padding: 3,
          font: {
            size: "13em", // Размер текста на секторах диаграммы
          },
        },
        tooltip: {
          filter: function (tooltipItem) {
            return tooltipItem.datasetIndex !== 3;
          },
          callbacks : {
            title: function(tooltipItem) {
              return "" // !!! в данном случае (формирование поля title) tooltipItem - это массив
            },
            label: function(context) {
              return (context.datasetIndex !==0 && context.dataset.customers) ? context.dataset.customers[context.dataIndex] : context.dataset.label // !!! в данном случае (формирование поля label) contex (либо возможен вариант tooltipItem) - это объект
            },
          }
        },
      },
      scales: {
        x: {
          display: true,
          // reverse: true,
          title: {
            display: true,
            text: ""
          },
          ticks: {
            callback: function(value, index, values) {
              return this.getLabelForValue(value)
            }
          }
        },
        y: {
          display: true,
          beginAtZero: false,
        },
      },
    },
  }
}

export default mediumLineChartOptions;