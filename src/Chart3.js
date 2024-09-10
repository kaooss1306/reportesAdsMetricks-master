import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart3 = ({ data, brandSearch }) => {
  // Usar useMemo para calcular las calidades únicas y los conteos
  const { uniqueQualities, qualityCounts } = useMemo(() => {
    const qualitiesSet = new Set(data.map(item => item.Calidad));
    const uniqueQualities = Array.from(qualitiesSet);
    
    const qualityCounts = uniqueQualities.map(quality => 
      data.filter(item => item.Calidad === quality).length
    );

    return { uniqueQualities, qualityCounts };
  }, [data]);

  const chartData = {
    labels: uniqueQualities,
    datasets: [
      {
        label: 'Cantidad',
        data: qualityCounts,
        backgroundColor: uniqueQualities.map((_, index) => 
          `hsl(${index * (360 / uniqueQualities.length)}, 70%, 50%)`
        ),
        borderColor: uniqueQualities.map((_, index) => 
          `hsl(${index * (360 / uniqueQualities.length)}, 70%, 40%)`
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
        text: brandSearch ? `Calidad para ${brandSearch}` : 'Distribución de Calidad',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Tipo de Calidad'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export default Chart3;
