import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart4 = ({ data, brandSearch }) => {
  // Usar useMemo para calcular las categorías únicas y los porcentajes
  const { uniqueCategories, categoryPercentages } = useMemo(() => {
    const categoriesSet = new Set(data.map(item => item.Categoria));
    const uniqueCategories = Array.from(categoriesSet);
    
    const categoryCounts = uniqueCategories.map(category => 
      data.filter(item => item.Categoria === category).length
    );

    const totalCount = categoryCounts.reduce((sum, count) => sum + count, 0);
    const categoryPercentages = categoryCounts.map(count => 
      ((count / totalCount) * 100).toFixed(2)
    );

    return { uniqueCategories, categoryPercentages };
  }, [data]);

  const chartData = {
    labels: uniqueCategories,
    datasets: [
      {
        label: 'Porcentaje',
        data: categoryPercentages,
        backgroundColor: uniqueCategories.map((_, index) => 
          `hsl(${index * (360 / uniqueCategories.length)}, 70%, 50%)`
        ),
        borderColor: uniqueCategories.map((_, index) => 
          `hsl(${index * (360 / uniqueCategories.length)}, 70%, 40%)`
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
        text: brandSearch ? `Categorías para ${brandSearch} (%)` : 'Distribución de Categorías (%)',
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
          text: 'Categoría'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default Chart4;
