import React, { useEffect, useState,useContext } from 'react';
import { useTable, usePagination, useGlobalFilter, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import './TableLayout.css';
import { ThemeContext } from "../../Shared/Themes/ThemeContext"; 
import { FontSizeContext } from '../../Shared/Font/FontContext';



export default function DataTable({ columns, data, initialSearchValue }) {
  const [currentPageIndex, setCurrentPageIndex] = React.useState(0);
  const [filteredData, setFilteredData] = React.useState(data);
  const [previousDataLength, setPreviousDataLength] = React.useState(data.length);


  React.useEffect(() => {
    setFilteredData(data);
    // Only reset page index when the data length changes (indicating a filter was applied)
    if (data.length !== previousDataLength) {
      setCurrentPageIndex(0);
      setPreviousDataLength(data.length);
    }
  }, [data, previousDataLength]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    gotoPage,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { 
        pageIndex: currentPageIndex, 
        pageSize: 20,
        globalFilter: initialSearchValue 
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  React.useEffect(() => {
    setCurrentPageIndex(pageIndex);
  }, [pageIndex]);
  const { themeColor } = useContext(ThemeContext);
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  return (
    <div className="dataTable_wrapper container-fluid">
      {/* Page Size Selector */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
        <div className="row align-items-center">
  {/* Left Section: Dropdowns */}
  <div className="col-auto d-flex align-items-center gap-2">
    {/* Show Entries Dropdown */}
    <select
      className="form-select form-select-sm"
      value={pageSize}
      onChange={(e) => setPageSize(Number(e.target.value))}
    >
      {[20, 50, 100].map((size) => (
        <option key={size} value={size}>
          Show {size}
        </option>
      ))}
    </select>

    {/* Font Size Dropdown */}
    <select
      className="form-select form-select-sm"
      value={fontSize}
      onChange={(e) => setFontSize(e.target.value)}
    >
      <option value="12px">Small</option>
      <option value="14px">Medium</option>
      <option value="16px">Default</option>
      <option value="18px">Large</option>
      <option value="20px">Extra Large</option>
    </select>
  </div>

  
  
</div>

          <span className="fw-bold">Total Records: {data.length}</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table {...getTableProps()} className="table table-striped">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="dataTable_headerRow">
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="dataTable_headerCell"
                    style={{
                      backgroundColor: themeColor,  // Updated background color
                      color: 'white',
                      border: '2px solid',
                      borderImage: 'linear-gradient(to right, #ff9966, #ff5e62) 1',
                      textAlign: 'center',
                      fontSize: fontSize,
                    }}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="dataTable_body">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="dataTable_row">
                  {row.cells.map((cell) => (
                    <td
                      {...cell.getCellProps()}
                      className="dataTable_cell"
                      style={{
                        borderTop: `2px solid ${themeColor}`,
                        borderBottom: `2px solid ${themeColor}`,
                        borderLeft: `2px solid ${themeColor}`,
                        borderRight: `2px solid ${themeColor}`,
                        borderImage: `linear-gradient(to right, ${themeColor}, #ff5e62) 1`,
                        fontSize: fontSize,
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="dataTable_pageInfo">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </div>
        <div className="pagebuttons">
          <button
            className="btn btn-primary me-2 btn1"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            Prev
          </button>
          <button
            className="btn btn-primary btn1"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}