import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

const ReporteTabla = ({ selectedYear, tableIds, brandSearch }) => {
  const [data, setData] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [perPage, setPerPage] = useState(25);

  const formatProducto = (producto) => {
    return producto.replace(/,/g, ' ');
  };

  const columns = [
    { name: 'Año', selector: row => selectedYear, sortable: true, wrap: true },
    { name: 'Calidad', selector: row => row.Calidad, sortable: true, wrap: true },
    { name: 'Categoría', selector: row => row.Categoria, sortable: true, wrap: true },
    { name: 'Empresa', selector: row => row.Empresa, sortable: true, wrap: true },
    { name: 'Inversión MP', selector: row => row['Inversion MP'] || '-', sortable: true, wrap: true },
    { name: 'Marca', selector: row => row.Marca, sortable: true, wrap: true },
    { name: 'Medio', selector: row => row.Medio, sortable: true, wrap: true },
    { 
      name: 'Mes', 
      selector: row => {
        if (selectedYear === '2023') {
          return row.Mes || '-';
        } else {
          return row['Mes Nombre'] || '-';
        }
      }, 
      sortable: true,
      wrap: true
    },
    { 
      name: 'Producto', 
      selector: row => formatProducto(row.Producto), 
      sortable: true,
      wrap: true,
      grow: 2
    },
    { name: 'Rubro', selector: row => row.Rubro, sortable: true, wrap: true },
    { name: 'Soporte', selector: row => row.Soporte, sortable: true, wrap: true },
    { name: 'Subrubro', selector: row => row.Subrubro, sortable: true, wrap: true },
  ];

   const fetchData = async (page) => {
    try {
      const response = await axios.get(`https://nocodb-production-5c0d.up.railway.app/api/v2/tables/${tableIds[selectedYear]}/records`, {
        params: {
          offset: (page - 1) * perPage,
          limit: perPage,
          where: brandSearch ? `(Marca,like,${brandSearch}%)` : '',
        },
        headers: {
          'xc-token': '5d2NqaEUVixkksswn1CNUUr73BRJvii-NXvls4zv'
        }
      });
      setData(response.data.list);
      setTotalRows(response.data.pageInfo.totalRows);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, [selectedYear, brandSearch]);

  const handlePageChange = page => {
    fetchData(page);
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setPerPage(newPerPage);
    fetchData(page);
  };

   return (
    <div>
      <DataTable
        title={`Reportería ${selectedYear}`}
        columns={columns}
        data={data}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
        responsive
        highlightOnHover
        pointerOnHover
        paginationPerPage={25}
        paginationRowsPerPageOptions={[25, 50, 100]}
        dense={false}
        customStyles={{
          cells: {
            style: {
              whiteSpace: 'pre-wrap',
              overflow: 'visible',
              minHeight: '60px',
            },
          },
        }}
      />
    </div>
  );
};

export default ReporteTabla;
