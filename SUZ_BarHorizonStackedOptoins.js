import numberConverter from "@/utils/NumberConverter";

const stackedOptions = {
  options: {
    indexAxis: 'y', // для горизонтально ориентированного графика
    layout: {
      padding: {
        right: 40,
        left: 10
      }
    },
    // skipNull: true,
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2,
    barThickness: 10,
    
    barPercentage: 1.0, // относительная ширина столбцов внутри категории
    categoryPercentage: 0.9, // ширина категорий относительно сегмента графика
    elements: {
      point: {
        // radius: 10,
        // hoverRadius: 20,
        // pointStyle : "circle"
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function() {
            return ""
          },
          label: function(context) {
            return context.dataset.longLabel[context.dataIndex]
          }
        }
      },
      datalabels: {
        labels: {
          name: {
            anchor: "start",
            align: 'left',
            offset: 10,
            font: {
              size: '10em'
            },
            formatter: function(value, ctx) {
              return ctx.chart.data.datasets[0].label[ctx.dataIndex];
            }
          },
          value: {
            anchor: "end",
            align: 'right',
            offset: 5,
            font: {
              size: '11em',
              weight: 600,
            },
            formatter: function(value, ctx) {
              return numberConverter(ctx.chart.data.datasets[0].data[ctx.dataIndex]);
            }
          },

        },
        display: 'auto',
        // backgroundColor: function(context) {
        //   return context.dataset.borderColor;
        // },
        // borderColor: 'white',
        // borderRadius: 15,
        // borderWidth: 1,
        // anchor: "end",
        // align: "end",
        // padding: 2,
        // color: "black",
        // font: {
        //   size: "10em", // Размер текста на секторах диаграммы
        // },
      },
    },
    scales: {
      xAxis: {
        display: true,
        stacked: false,
        pointLabels: {
          display: true,
          padding: 0,
        },
        ticks: {
          maxRotation: 0,
          // stepSize: 50,
          font: {
            size: "12rem"
          }
        }
      },
      yAxis: {
        display: true,
        stacked: false,
        grid: {
          display: true,
          drawOnChartArea: false,
          drawTicks: true,
          tickLength: 50,
          tickColor: function(context) {
            if (context.tick) {
              if (context.tick.label[0] !== "") {
                return "lightgray";
              }
              else return "transparent"
            }
          }
        },
        ticks: {
          maxRotation: 0,
          display: true,
          // mirror: true,
          labelOffset: 0,
          autoSkip: false,
          align: 'start',
          // padding: -50,
          font: {
            size: "11rem"
          },
          callback: function(label) {
            const wordCount = this.getLabelForValue(label).split(" ").length;
            const half = Math.floor(this.getLabelForValue(label).split(" ").length / 2);
            const first = this.getLabelForValue(label).split(" ").splice(0 , half).join(" ");
            const second = this.getLabelForValue(label).split(" ").splice(half, wordCount).join(" ");
            return [first, second] // Строчные надписи преобразуем в массив строк для отображения вертикально
          },
        }
      },
    },
  },
};

export default stackedOptions;