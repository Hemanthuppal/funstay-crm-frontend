import React, { useEffect, useState ,useContext} from 'react';
import { useTable, usePagination, useGlobalFilter, useSortBy } from 'react-table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt, FaTimes } from "react-icons/fa";
import './TableLayout.css';
import { ThemeContext } from "../../Shared/Themes/ThemeContext"; 
import { FontSizeContext } from '../../Shared/Font/FontContext';


// Global Search Filter Component
function GlobalFilter({ globalFilter, setGlobalFilter, handleDateFilter }) {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showDateFilters, setShowDateFilters] = useState(false);

  const applyDateFilter = () => {
    handleDateFilter(fromDate, toDate);
  };

  const clearDateFilter = () => {
    setFromDate('');
    setToDate('');
    handleDateFilter('', '');
    setShowDateFilters(false);
  };

  return (
    <div className="dataTable_search mb-3 d-flex align-items-center gap-2">
      <input
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="form-control search-input"
        placeholder="Search..."
      />
      {showDateFilters || fromDate || toDate ? (
        <button className="btn btn-light clear-btn" onClick={clearDateFilter}>
          <FaTimes color="#ff5e62" size={20} />
        </button>
      ) : (
        <button className="btn btn-light calendar-btn" onClick={() => setShowDateFilters(!showDateFilters)}>
          <FaCalendarAlt color="#ff5e62" size={20} />
        </button>
      )}
      {showDateFilters && (
        <div className="date-filters d-flex gap-2 align-items-center">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              if (toDate && e.target.value > toDate) {
                setToDate('');
              }
            }}
            className="form-control date-input"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="form-control date-input"
            min={fromDate}
          />
          <button onClick={applyDateFilter} className="btn btn-primary apply-btn">
            OK
          </button>
        </div>
      )}
    </div>
  );
}


export default function DataTable({ columns, data }) {
  const [filteredData, setFilteredData] = useState(data);
  const [searchInput, setSearchInput] = useState('');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFiltered, setIsFiltered] = useState(false);
  const { themeColor } = useContext(ThemeContext);
  const { fontSize, setFontSize } = useContext(FontSizeContext);
  useEffect(() => {
    applyGlobalSearch(searchInput);
  }, [searchInput, data]);

  // Filter Data Based on Global Search
  const applyGlobalSearch = (searchValue) => {
    if (!searchValue) {
      setFilteredData(data);
      setIsFiltered(false);
      return;
    }

    const filtered = data.filter((item) => {
      return Object.values(item)
        .join(' ')
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });

    setFilteredData(filtered);
    setIsFiltered(true);
  };

  // const { themeColor } = useContext(ThemeContext);
  // const { fontSize, setFontSize } = useContext(FontSizeContext);

  // Date Filter Logic
  const handleDateFilter = (fromDate, toDate) => {
    if (fromDate || toDate) {
      const filtered = data.filter((item) => {
        const itemDate = new Date(item.updated_at).setHours(0, 0, 0, 0);
        const from = fromDate ? new Date(fromDate).setHours(0, 0, 0, 0) : null;
        const to = toDate ? new Date(toDate).setHours(0, 0, 0, 0) : null;

        return (!from || itemDate >= from) && (!to || itemDate <= to);
      });
      setFilteredData(filtered);
      setIsFiltered(true);
    } else {
      setFilteredData(data);
      setIsFiltered(false);
    }
  };

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
    state: { pageIndex, pageSize },
    gotoPage,
  } = useTable(
    {
      columns,
      data: filteredData,
      initialState: { pageIndex: currentPageIndex, pageSize: 20 },
      autoResetPage: false,
    },
    useSortBy,
    usePagination
  );

  useEffect(() => {
    if (isFiltered) {
      gotoPage(0);
      setIsFiltered(false);
    }
  }, [filteredData, isFiltered, gotoPage]);

  useEffect(() => {
    setCurrentPageIndex(pageIndex);
  }, [pageIndex]);


  return (
    <div className="dataTable_wrapper container-fluid">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
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
          <span className="fw-bold">Total Records: {filteredData.length}</span>
        </div>
        <GlobalFilter globalFilter={searchInput} setGlobalFilter={setSearchInput} handleDateFilter={handleDateFilter} />
      </div>

      <div className="table-responsive">
        <table {...getTableProps()} className="table table-striped">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="dataTable_headerRow">
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())} className="dataTable_headerCell"
                  style={{
                    backgroundColor: themeColor, // Updated background color
                    color: 'white',
                    border: '2px solid',
                    borderImage: 'linear-gradient(to right, #ff9966, #ff5e62) 1',
                    textAlign: 'center',
                    fontSize: fontSize,
                  }}>
                    {column.render('Header')}
                    <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
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
                    <td {...cell.getCellProps()} className="dataTable_cell"
                    style={{
                      borderTop: `2px solid ${themeColor}`,
                      borderBottom: `2px solid ${themeColor}`,
                      borderLeft: `2px solid ${themeColor}`,
                      borderRight: `2px solid ${themeColor}`,
                      borderImage: `linear-gradient(to right, ${themeColor}, #ff5e62) 1`,
                      fontSize: fontSize,
                    }}>
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="dataTable_pageInfo">
          Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
        </div>
        <div className="pagebuttons">
          <button className="btn btn-primary me-2 btn1" onClick={() => previousPage()} disabled={!canPreviousPage}>
            Prev
          </button>
          <button className="btn btn-primary btn1" onClick={() => nextPage()} disabled={!canNextPage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
