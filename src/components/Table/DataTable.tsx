import './datatable.css'


'use client'

import { useEffect, useState } from 'react'

interface DataRow {
  id: number
  name: string
  email: string
  created_at: string
  updated_at: string
}

export default function DataTable() {
  const [data, setData] = useState<DataRow[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [rowsPerPage, setRowsPerPage] = useState<number>(8)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      let url = `https://api.razzakfashion.com`;
      if (searchTerm) {
        url = `https://api.razzakfashion.com?paginate=${rowsPerPage}&search=${searchTerm}`;
      }
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch data! Please Use Allow CORS: Access-Control-Allow-Origin Chrome extension to see data')
        }
        const jsonData = await response.json()
        const dataArray: DataRow[] = jsonData?.data || []
        setData(dataArray)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm, rowsPerPage])

  const totalPages = Math.ceil(data?.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const currentData = data?.slice(startIndex, endIndex)

  const toggleSelectAll = () => {
    if (selectedRows?.length === currentData?.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(currentData.map(row => row.id))
    }
  }

  const toggleSelectRow = (id: number) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const goToFirstPage = () => setCurrentPage(1)
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1))
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages))
  const goToLastPage = () => setCurrentPage(totalPages)

  if (loading) {
    return <div className="loading-state">Loading...</div>
  }

  if (error) {
    return <div className="error-state">Error: {error}</div>
  }

  return (
    <div className="container mx-auto">
      <div className="searchContainer">
        <input
          type="text"
          placeholder="Search area"
          className="searchInput"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
        />
      </div>
      <div className="tableContainer">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === currentData.length && currentData.length > 0}
                  onChange={toggleSelectAll}
                  className="checkbox"
                />
              </th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Created Date</th>
              <th>Updated Date</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row.id)}
                    onChange={() => toggleSelectRow(row.id)}
                    className="checkbox"
                  />
                </td>
                <td>{row.name?.split(" ")[0]}</td>
                <td>{row.name?.split(" ")[1]}</td>
                <td>{row.email}</td>
                <td>{formatDate(row.created_at)}</td>
                <td>{formatDate(row.updated_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination flex items-center justify-between mt-4">
        <div className="rowsPerPage flex items-center">
          <span className="mr-2">Rows per page</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            className="select border p-2 rounded-md"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div className="paginationInfo">
          {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length}
        </div>
        <div className="paginationControls flex">
          <button onClick={goToFirstPage} disabled={currentPage === 1} className="p-2 border rounded-l-md hover:bg-gray-100 disabled:opacity-50">
            |&lt;
          </button>
          <button onClick={goToPreviousPage} disabled={currentPage === 1} className="p-2 border hover:bg-gray-100 disabled:opacity-50">
            &lt;
          </button>
          <button onClick={goToNextPage} disabled={currentPage === totalPages} className="p-2 border hover:bg-gray-100 disabled:opacity-50">
            &gt;
          </button>
          <button onClick={goToLastPage} disabled={currentPage === totalPages} className="p-2 border rounded-r-md hover:bg-gray-100 disabled:opacity-50">
            &gt;|
          </button>
        </div>
      </div>
    </div>
  )
}

