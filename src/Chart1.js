import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart1 = ({ data, selectedYear, brandSearch }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (data && data.length > 0) {
      const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ];
      
      // Filtrar datos basados en la búsqueda de marca
      const filteredData = brandSearch
        ? data.filter(item => item.Marca.toLowerCase().includes(brandSearch.toLowerCase()))
        : data;

      // Agrupar datos por marca y mes
      const groupedData = filteredData.reduce((acc, item) => {
        if (!acc[item.Marca]) {
          acc[item.Marca] = {};
        }
        const month = item['Mes Nombre'] || months[parseInt(item.Mes, 10) - 1];
        if (!acc[item.Marca][month]) {
          acc[item.Marca][month] = 0;
        }
        acc[item.Marca][month] += parseFloat(item['Inversion MP']) || 0;
        return acc;
      }, {});

      let datasets;

      if (brandSearch) {
        // Si hay una búsqueda de marca, mostrar solo esa marca
        datasets = Object.entries(groupedData).map(([brand, monthlyData]) => ({
          label: brand,
          data: months.map(month => monthlyData[month] || 0),
          borderColor: 'hsl(0, 70%, 50%)',
          backgroundColor: 'hsla(0, 70%, 50%, 0.5)',
        }));
      } else {
        // Si no hay búsqueda, mostrar las 6 marcas con mayor inversión total
        const topBrands = Object.entries(groupedData)
          .map(([brand, monthlyData]) => ({
            brand,
            total: Object.values(monthlyData).reduce((sum, value) => sum + value, 0),
          }))
          .sort((a, b) => b.total - a.total)
          .slice(0, 6)
          .map(item => item.brand);

        datasets = topBrands.map((brand, index) => ({
          label: brand,
          data: months.map(month => groupedData[brand][month] || 0),
          borderColor: `hsl(${index * 60}, 70%, 50%)`,
          backgroundColor: `hsla(${index * 60}, 70%, 50%, 0.5)`,
        }));
      }

      setChartData({
        labels: months,
        datasets: datasets,
      });
    }
  }, [data, selectedYear, brandSearch]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: brandSearch ? `Inversión MP - ${brandSearch}` : 'Inversión MP - General',
      },
    },
  };

  return <Line options={options} data={chartData} />;
};

export default Chart1;
