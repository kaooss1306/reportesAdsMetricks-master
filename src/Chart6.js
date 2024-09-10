import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart6 = ({ data, brandSearch }) => {
  // Usar useMemo para calcular los 10 soportes con mayor cantidad
  const { topSoportes, topCounts } = useMemo(() => {
    const soporteCounts = data.reduce((acc, item) => {
      acc[item.Soporte] = (acc[item.Soporte] || 0) + 1;
      return acc;
    }, {});

    const sortedSoportes = Object.entries(soporteCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const topSoportes = sortedSoportes.map(([soporte]) => soporte);
    const topCounts = sortedSoportes.map(([, count]) => count);

    return { topSoportes, topCounts };
  }, [data]);

  const chartData = {
    labels: topSoportes,
    datasets: [
      {
        label: 'Cantidad',
        data: topCounts,
        backgroundColor: topSoportes.map((_, index) => 
          `hsl(${index * (360 / topSoportes.length)}, 70%, 50%)`
        ),
        borderColor: topSoportes.map((_, index) => 
          `hsl(${index * (360 / topSoportes.length)}, 70%, 40%)`
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: brandSearch ? `Top 10 Soportes para ${brandSearch}` : 'Top 10 Soportes',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: 'Soporte'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default Chart6;
