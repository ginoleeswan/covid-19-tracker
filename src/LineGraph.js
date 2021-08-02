import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  interaction: {
    intersect: false,
    mode: "index",
    callbacks: {
      label: function (tooltipItem, index, tooltipItems, data) {
        return numeral(tooltipItem.formattedValue).format("+0,0");
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  fill: true,
  maintainAspectRatio: false,
  scales: {
    // x: {
    //   time: {
    //     format: "MM/DD/YYYY",
    //     tooltipFormat: "ll",
    //   },
    // },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        //include a dollar sign in the ticks
        callback: function (value, index, values) {
          return numeral(value).format("0a");
        },
      },
    },
  },
};

const buildChartData = (data, casesType = "cases") => {
  const chartData = [];
  let lastDataPoint;

  for (let date in data.cases) {
    if (lastDataPoint) {
      const newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType = "cases", ...props }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => response.json())
        .then((data) => {
          let chartData = buildChartData(data, "cases");
          setData(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div className={props.className}>
      {data?.length > 0 && (
        <Line
          options={options}
          data={{
            datasets: [
              {
                backgroundColor: "rgba(206, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
        />
      )}
    </div>
  );
}

export default LineGraph;
