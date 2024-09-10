import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart5 = ({ data, brandSearch }) => {
  // Usar useMemo para calcular los rubros únicos y los porcentajes
  const { uniqueRubros, rubroPercentages } = useMemo(() => {
    const rubrosSet = new Set(data.map(item => item.Rubro));
    const uniqueRubros = Array.from(rubrosSet);
    
    const rubroCounts = uniqueRubros.map(rubro => 
      data.filter(item => item.Rubro === rubro).length
    );

    const totalCount = rubroCounts.reduce((sum, count) => sum + count, 0);
    const rubroPercentages = rubroCounts.map(count => 
      ((count / totalCount) * 100).toFixed(2)
    );

    return { uniqueRubros, rubroPercentages };
  }, [data]);

  const chartData = {
    labels: uniqueRubros,
    datasets: [
      {
        label: 'Porcentaje',
        data: rubroPercentages,
        backgroundColor: uniqueRubros.map((_, index) => 
          `hsl(${index * (360 / uniqueRubros.length)}, 70%, 50%)`
        ),
        borderColor: uniqueRubros.map((_, index) => 
          `hsl(${index * (360 / uniqueRubros.length)}, 70%, 40%)`
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
        text: brandSearch ? `Rubros para ${brandSearch} (%)` : 'Distribución de Rubros (%)',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Porcentaje'
        },
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Rubro'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default Chart5;
