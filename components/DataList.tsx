
import React from 'react';
import { Plus, Search, RotateCcw, FileSpreadsheet, Upload, Download } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  width?: string;
}

interface DataListProps<T> {
  title?: string;
  breadcrumb?: string;
  data: T[];
  columns: Column<T>[];
  onAdd?: () => void;
  renderFilter?: React.ReactNode;
  onSearch?: () => void;
  onReset?: () => void;
  hideAddButton?: boolean;
  onExcelUpload?: () => void;
  onDownloadSample?: () => void;
  onExcelDownload?: () => void;
  actions?: React.ReactNode; // New Prop
}

const DataList = <T extends { id: string | number }>({
  title,
  breadcrumb,
  data,
  columns,
  onAdd,
  renderFilter,
  onSearch,
  onReset,
  hideAddButton = false,
  onExcelUpload,
  onDownloadSample,
  onExcelDownload,
  actions // Destructure
}: DataListProps<T>) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);

  // Reset page when data length changes significantly or filter implies new search
  React.useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Title & Breadcrumb & Actions */}
      {/* Title & Breadcrumb handled by Layout. Actions specific to DataList. */}
      {actions && (
        <div className="flex items-center justify-end mb-2">
          {actions}
        </div>
      )}

      {/* Filter Area */}
      {renderFilter && (
        <div className="space-y-3">
          <div className="bg-white border border-gray-200">
            {renderFilter}
          </div>
          <div className="flex justify-between items-center">
            {/* Rows Per Page Selector - Positioned left for visibility */}
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="font-bold">표시 수량</span>
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none"
              >
                <option value={20}>20개</option>
                <option value={30}>30개</option>
                <option value={50}>50개</option>
                <option value={100}>100개</option>
              </select>
            </div>

            <div className="flex space-x-2">
              {onReset && (
                <button
                  onClick={onReset}
                  className="flex items-center px-4 py-1.5 bg-[#B22222] text-white rounded text-sm font-bold hover:bg-[#9a1d1d]"
                >
                  초기화
                </button>
              )}
              {onSearch && (
                <button
                  onClick={onSearch}
                  className="flex items-center px-4 py-1.5 bg-[#6DC9C1] text-white rounded text-sm font-bold hover:bg-[#5bb7af]"
                >
                  <Search className="mr-1 h-4 w-4" /> 검색
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table Area */}
      <div className="bg-white overflow-hidden">
        <table className="w-full border-collapse">
          <thead className="bg-[#F1F3F6] border-t-2 border-gray-800 border-b border-gray-200">
            <tr className="text-sm font-bold text-gray-700">
              {columns.map((col, i) => (
                <th
                  key={i}
                  className={`px-4 py-3 border-r border-gray-200 last:border-r-0 ${col.width || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 border-b border-gray-200">
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-400 text-sm">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              currentItems.map((item) => (
                <tr key={item.id} className="text-center text-xs text-gray-600 hover:bg-gray-50">
                  {columns.map((col, i) => (
                    <td key={i} className="px-4 py-4 border-r border-gray-200 last:border-r-0">
                      {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4 pt-4">
        {data.length > 0 && (
          <div className="flex items-center space-x-4 text-gray-400 text-sm select-none">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className={`hover:text-gray-800 ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              |&lt;
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`hover:text-gray-800 ${currentPage === 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              &lt;
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum = currentPage;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-full font-bold transition-colors ${currentPage === pageNum
                      ? 'bg-gray-200 text-gray-800'
                      : 'hover:bg-gray-100 text-gray-400'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`hover:text-gray-800 ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              &gt;
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className={`hover:text-gray-800 ${currentPage === totalPages ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              &gt;|
            </button>
          </div>
        )}

        <div className="w-full flex justify-end gap-2">
          {onDownloadSample && (
            <button
              onClick={onDownloadSample}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm font-bold hover:bg-gray-50"
            >
              <FileSpreadsheet className="mr-1 h-4 w-4" /> 양식 다운로드
            </button>
          )}
          {onExcelDownload && (
            <button
              onClick={onExcelDownload}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded text-sm font-bold hover:bg-gray-50"
            >
              <Download className="mr-1 h-4 w-4" /> 엑셀 다운
            </button>
          )}
          {onExcelUpload && (
            <button
              onClick={onExcelUpload}
              className="flex items-center px-4 py-2 bg-[#2D7D32] text-white rounded text-sm font-bold hover:bg-[#1b5e20]"
            >
              <Upload className="mr-1 h-4 w-4" /> 엑셀 업로드
            </button>
          )}
          {!hideAddButton && onAdd && (
            <button
              onClick={onAdd}
              className="flex items-center px-4 py-2 bg-[#6DC9C1] text-white rounded text-sm font-bold hover:bg-[#5bb7af]"
            >
              <Plus className="mr-1 h-4 w-4" /> 추가
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataList;
