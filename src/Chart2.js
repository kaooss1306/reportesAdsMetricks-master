import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart2 = ({ data, brandSearch }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      // Filtrar datos basados en la búsqueda de marca
      const filteredData = brandSearch
        ? data.filter(item => item.Marca.toLowerCase().includes(brandSearch.toLowerCase()))
        : data;

      // Calcular porcentajes de medio para los datos filtrados
      const medios = filteredData.reduce((acc, item) => {
        acc[item.Medio] = (acc[item.Medio] || 0) + 1;
        return acc;
      }, {});

      const mediosData = Object.entries(medios).map(([medio, count]) => ({
        medio,
        percentage: (count / filteredData.length) * 100
      }));

      // Ordenar medios por porcentaje descendente
      mediosData.sort((a, b) => b.percentage - a.percentage);

      // Tomar los top 5 medios y agrupar el resto en "Otros"
      const top5Medios = mediosData.slice(0, 5);
      const otrosMedios = mediosData.slice(5);
      const otrosPercentage = otrosMedios.reduce((sum, item) => sum + item.percentage, 0);

      const labels = [...top5Medios.map(item => item.medio), 'Otros'];
      const percentages = [...top5Medios.map(item => item.percentage), otrosPercentage];

      const colors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ];

      setChartData({
        labels: labels,
        datasets: [
          {
            data: percentages,
            backgroundColor: colors,
            borderColor: colors.map(color => color.replace('0.8', '1')),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [data, brandSearch]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: brandSearch ? `Distribución de Medios para ${brandSearch}` : 'Distribución de Medios General',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value.toFixed(2)}%`;
          }
        }
      }
    },
  };

  return (
    <div style={{ height: '290px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default Chart2;
