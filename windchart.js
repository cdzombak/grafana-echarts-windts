const ecData = []

if (context.panel.data.series.length === 0) {
  return {}
}

const time = context.panel.data.series[0].fields[0].values
const direction = context.panel.data.series[0].fields[1].values
const speed = context.panel.data.series[1].fields[1].values

for (let i = 0; i < context.panel.data.series[0].length; i++) {
  ecData.push({ value: [time.get(i), Number(speed.get(i)).toFixed(2)], symbolRotate: (direction.get(i) / Math.PI * 180) - 90 })
}

const series = {
  name: context.panel.data.series[1].refId,
  type: 'line',
  showSymbol: true,
  symbol: "path://m13.022 14.999v3.251c0 .412.335.75.752.75.188 0 .375-.071.518-.206 1.775-1.685 4.945-4.692 6.396-6.069.2-.189.312-.452.312-.725 0-.274-.112-.536-.312-.725-1.451-1.377-4.621-4.385-6.396-6.068-.143-.136-.33-.207-.518-.207-.417 0-.752.337-.752.75v3.251h-9.02c-.531 0-1.002.47-1.002 1v3.998c0 .53.471 1 1.002 1z",
  symbolSize: 15,
  areaStyle: {
    opacity: 0.05,
  },
  lineStyle: {
    width: 1,
  },
  data: ecData,
  animation: false
};


/**
 * Enable Data Zoom by default
 */
setTimeout(() => context.panel.chart.dispatchAction({
  type: 'takeGlobalCursor',
  key: 'dataZoomSelect',
  dataZoomSelectActive: true,
}), 500);

/**
 * Update Time Range on Zoom
 */
context.panel.chart.on('datazoom', function (params) {
  const startValue = params.batch[0]?.startValue;
  const endValue = params.batch[0]?.endValue;
  context.grafana.locationService.partial({ from: startValue, to: endValue });
});

return {
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    left: '0',
    bottom: '0',
    data: ['Wind Speed & Angle'],
    textStyle: {
      color: 'rgba(128, 128, 128, .9)',
    },
  },
  toolbox: {
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
        icon: {
          zoom: 'path://',
          back: 'path://',
        },
      },
      saveAsImage: {},
    }
  },
  xAxis: {
    type: 'time',
  },
  yAxis: {
    type: 'value',
    min: 0,
  },
  grid: {
    left: '2%',
    right: '2%',
    top: '2%',
    bottom: 24,
    containLabel: true,
  },
  series,
};
