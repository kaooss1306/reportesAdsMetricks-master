import React, { useState, useEffect, useRef } from 'react';
import './Dashboard.css';
import Chart1 from './Chart1';
import Chart2 from './Chart2';
import Chart3 from './Chart3';
import Chart4 from './Chart4';
import Chart5 from './Chart5';
import Chart6 from './Chart6';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";
import logoImage from '../src/origen.png'; // Asegúrate de que la ruta sea correcta

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [data, setData] = useState([]);
  const [brandSearch, setBrandSearch] = useState('');
  const [brandSuggestions, setBrandSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chartsLoaded, setChartsLoaded] = useState(false);
  const dashboardRef = useRef();

  const tableIds = {
    '2022': 'mjkna8fbfpdh6vc',
    '2023': 'm015jrlsv82sydz',
    '2024': 'mpq79q0vqaa13ep'
  };

  const handleYearChange = (event) => {
    const newYear = event.target.value;
    setSelectedYear(newYear);
    fetchData(newYear, brandSearch);
  };

  const handleBrandSearchChange = (event) => {
    const value = event.target.value;
    setBrandSearch(value);

    if (value.length >= 3) {
      const suggestions = [...new Set(data
        .filter(item => item.Marca.toLowerCase().includes(value.toLowerCase()))
        .map(item => item.Marca))]
        .slice(0, 5);
      setBrandSuggestions(suggestions);
    } else {
      setBrandSuggestions([]);
    }

    if (value === '') {
      fetchData(selectedYear, '');
    }
  };

  const handleBrandSelect = (brand) => {
    setBrandSearch(brand);
    setBrandSuggestions([]);
    fetchData(selectedYear, brand);
  };

  const fetchData = async (year, brand) => {
    setIsLoading(true);
    setChartsLoaded(false);
    try {
      const response = await axios.get(`https://nocodb-production-5c0d.up.railway.app/api/v2/tables/${tableIds[year]}/records`, {
        params: {
          limit: 1000,
          where: brand ? `(Marca,like,${brand}%)` : '',
        },
        headers: {
          'xc-token': '5d2NqaEUVixkksswn1CNUUr73BRJvii-NXvls4zv'
        }
      });
      setData(response.data.list);
      setTimeout(() => setChartsLoaded(true), 2000);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedYear, brandSearch);
  }, [selectedYear, brandSearch]);

  const exportToPDF = async () => {
    if (!chartsLoaded) {
      alert("Por favor, espere a que todos los gráficos se carguen completamente.");
      return;
    }

    const content = dashboardRef.current;
    
    try {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Ajusta estos valores según necesites
      const imgWidth = 40;
      const imgHeight = 10;

      const addHeaderToPage = () => {
        // Añadir logo
        pdf.addImage(logoImage, 'PNG', 10, 10, imgWidth, imgHeight);
        
        // Configurar fuente y tamaño para el texto
        pdf.setFont("helvetica");
        pdf.setFontSize(14);
        
        // Preparar el texto del encabezado
        const brandText = brandSearch ? `Marca: ${brandSearch}` : "Datos generales";
        const yearText = `Año: ${selectedYear}`;
        const headerText = `${brandText} - ${yearText}`;
        
        // Calcular la posición del texto para centrarlo
        const textWidth = pdf.getStringUnitWidth(headerText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const textX = (pageWidth - textWidth) / 2;
        
        // Añadir el texto centrado
        pdf.text(headerText, textX, 25);
      };

      addHeaderToPage();

      const charts = content.querySelectorAll('.chart');
      const chartWidth = (pageWidth - 30) / 2; // Ancho para dos gráficos por fila
      const chartHeight = (pageHeight - 50) / 3; // Altura para tres filas de gráficos

      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i];
        const canvas = await html2canvas(chart, {
          scale: 2,
          useCORS: true,
          logging: true
        });
        
        const xPosition = i % 2 === 0 ? 10 : chartWidth + 20;
        const yPosition = 35 + Math.floor(i / 2) * (chartHeight + 5);
        
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', xPosition, yPosition, chartWidth, chartHeight);
      }
      
      pdf.save('dashboard.pdf');
      
    } catch (error) {
      console.error('Error al exportar a PDF:', error);
      alert("Hubo un error al exportar el PDF. Por favor, intente de nuevo.");
    }
  };

  return (
    <div className="dashboard">
      <div className="selectors">
        <select 
          className="selector" 
          value={selectedYear} 
          onChange={handleYearChange}
        >
          <option value="">Seleccionar Año</option>
          {Object.keys(tableIds).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <div className="brand-search-container">
          <input
            type="text"
            placeholder="Buscar Marca"
            value={brandSearch}
            onChange={handleBrandSearchChange}
          />
          {brandSuggestions.length > 0 && (
            <ul className="brand-suggestions">
              {brandSuggestions.map((brand, index) => (
                <li key={index} onClick={() => handleBrandSelect(brand)}>
                  {brand}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className='mibtn' onClick={exportToPDF} disabled={!chartsLoaded}>
          {chartsLoaded ? 'Exportar PDF' : 'Cargando Gráficos'}
        </button>
      </div>

      <div className="content-container" ref={dashboardRef}>
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
          </div>
        )}
        <div className="charts-container">
          <div className="chart" id="chart1">
            <Chart1 data={data} selectedYear={selectedYear} brandSearch={brandSearch} />
          </div>
          <div className="chart" id="chart2">
            <Chart2 data={data} brandSearch={brandSearch} />
          </div>
          <div className="chart" id="chart3">
            <Chart3 data={data} brandSearch={brandSearch} />
          </div>
          <div className="chart" id="chart4">
            <Chart4 data={data} brandSearch={brandSearch} />
          </div>
          <div className="chart" id="chart5">
            <Chart5 data={data} brandSearch={brandSearch} />
          </div>
          <div className="chart" id="chart6">
            <Chart6 data={data} brandSearch={brandSearch} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;