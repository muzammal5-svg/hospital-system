'use client';

import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  SlidersHorizontal,
} from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Skeleton } from './Skeleton';

export interface ColumnDef<T> {
  id: string;
  header: string | React.ReactNode;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  hideable?: boolean;
}

export interface RowAction<T> {
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (row: T, index: number) => string | number;
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description?: string;
    action?: React.ReactNode;
    icon?: React.ReactNode;
  };
  pagination?: {
    pageSize?: number;
    showPageSizeOptions?: boolean;
  };
  rowActions?: RowAction<T>[] | ((row: T) => RowAction<T>[]);
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedIds?: (string | number)[];
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  stickyFirstColumn?: boolean;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  emptyState = { title: 'No records found', description: 'Try adjusting your filters or search query.' },
  pagination,
  rowActions,
  onRowClick,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  stickyFirstColumn = false,
  className = '',
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination?.pageSize || 10);
  const [openActionRowId, setOpenActionRowId] = useState<string | number | null>(null);
  const [hiddenColumnIds, setHiddenColumnIds] = useState<string[]>([]);
  const [showColMenu, setShowColMenu] = useState(false);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    const col = columns.find((c) => c.id === sortColumn);
    if (!col || !col.accessorKey) return data;

    return [...data].sort((a, b) => {
      const aVal = a[col.accessorKey!];
      const bVal = b[col.accessorKey!];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal);
      } else {
        comparison = aVal < bVal ? -1 : 1;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection, columns]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize, pagination]);

  const handleSort = (colId: string, sortable?: boolean) => {
    if (!sortable) return;
    if (sortColumn === colId) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(colId);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      const allIds = data.map((r, i) => keyExtractor(r, i));
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((item) => item !== id));
    }
  };

  const visibleColumns = useMemo(
    () => columns.filter((col) => !hiddenColumnIds.includes(col.id)),
    [columns, hiddenColumnIds]
  );

  return (
    <div className={`flex flex-col rounded-xl border border-[#E3E9EF] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.05)] ${className}`}>
      {/* Table Scrollable Container */}
      <div className="relative overflow-x-auto rounded-t-xl">
        <table className="w-full text-left border-collapse text-sm">
          {/* Header */}
          <thead>
            <tr className="border-b border-[#E3E9EF] bg-[#F8FAFC]">
              {selectable && (
                <th className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-[#D5DDE5] text-[#0B4F8A] focus:ring-[#0B4F8A]"
                    aria-label="Select all"
                  />
                </th>
              )}

              {visibleColumns.map((col, idx) => {
                const isSticky = stickyFirstColumn && idx === 0;
                return (
                  <th
                    key={col.id}
                    scope="col"
                    onClick={() => handleSort(col.id, col.sortable)}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#5B6B7B] transition-colors ${
                      col.sortable ? 'cursor-pointer select-none hover:text-[#1B2733]' : ''
                    } ${isSticky ? 'sticky left-0 bg-[#F8FAFC] z-10 shadow-[1px_0_0_#E3E9EF]' : ''} ${
                      col.headerClassName || ''
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-[#8A97A5]">
                          {sortColumn === col.id ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp className="h-3.5 w-3.5 text-[#0B4F8A]" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-[#0B4F8A]" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}

              {rowActions && (
                <th className="w-14 px-4 py-3 text-right text-xs font-semibold text-[#5B6B7B]">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-[#F0F4F8] bg-white">
            {isLoading ? (
              Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, r) => (
                <tr key={r}>
                  {selectable && (
                    <td className="px-4 py-3.5 text-center">
                      <Skeleton className="h-4 w-4 mx-auto rounded" />
                    </td>
                  )}
                  {visibleColumns.map((col) => (
                    <td key={col.id} className="px-4 py-3.5">
                      <Skeleton className="h-4 w-3/4 rounded" />
                    </td>
                  ))}
                  {rowActions && (
                    <td className="px-4 py-3.5 text-right">
                      <Skeleton className="h-4 w-6 ml-auto rounded" />
                    </td>
                  )}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={visibleColumns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className="p-8 text-center"
                >
                  <EmptyState
                    icon={emptyState.icon}
                    title={emptyState.title}
                    description={emptyState.description}
                    action={emptyState.action}
                  />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const rowKey = keyExtractor(row, index);
                const isSelected = selectedIds.includes(rowKey);

                const actionsList =
                  typeof rowActions === 'function' ? rowActions(row) : rowActions;

                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors hover:bg-[#F8FAFC] ${
                      isSelected ? 'bg-[#E8F1F9]/40' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                  >
                    {selectable && (
                      <td
                        className="px-4 py-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                          className="h-4 w-4 rounded border-[#D5DDE5] text-[#0B4F8A] focus:ring-[#0B4F8A]"
                        />
                      </td>
                    )}

                    {visibleColumns.map((col, cIdx) => {
                      const isSticky = stickyFirstColumn && cIdx === 0;
                      return (
                        <td
                          key={col.id}
                          className={`px-4 py-3 text-[#1B2733] font-normal text-sm ${
                            isSticky
                              ? 'sticky left-0 bg-white group-hover:bg-[#F8FAFC] z-10 shadow-[1px_0_0_#E3E9EF]'
                              : ''
                          } ${col.className || ''}`}
                        >
                          {col.cell
                            ? col.cell(row, index)
                            : col.accessorKey
                            ? String(row[col.accessorKey] ?? '—')
                            : null}
                        </td>
                      );
                    })}

                    {rowActions && (
                      <td
                        className="relative px-4 py-3 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenActionRowId(openActionRowId === rowKey ? null : rowKey)
                          }
                          className="rounded-lg p-1 text-[#8A97A5] hover:bg-[#F1F5F9] hover:text-[#1B2733] transition-colors"
                          aria-label="Row actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {openActionRowId === rowKey && actionsList && actionsList.length > 0 && (
                          <>
                            <div
                              className="fixed inset-0 z-20"
                              onClick={() => setOpenActionRowId(null)}
                            />
                            <div className="absolute right-4 top-10 z-30 min-w-[140px] rounded-lg border border-[#E3E9EF] bg-white py-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                              {actionsList.map((action, aIdx) => (
                                <button
                                  key={aIdx}
                                  type="button"
                                  onClick={() => {
                                    setOpenActionRowId(null);
                                    action.onClick(row);
                                  }}
                                  className={`flex w-full items-center gap-2 px-3 py-1.5 text-xs font-medium transition-colors ${
                                    action.variant === 'danger'
                                      ? 'text-rose-600 hover:bg-rose-50'
                                      : 'text-[#1B2733] hover:bg-[#F8FAFC]'
                                  }`}
                                >
                                  {action.icon}
                                  <span>{action.label}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E3E9EF] bg-[#FBFDFF] px-4 py-3 text-xs text-[#5B6B7B] rounded-b-xl">
          <div className="flex items-center gap-2">
            <span>
              Showing{' '}
              <strong className="text-[#1B2733]">
                {sortedData.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
              </strong>{' '}
              to{' '}
              <strong className="text-[#1B2733]">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </strong>{' '}
              of <strong className="text-[#1B2733]">{sortedData.length}</strong> records
            </span>

            {pagination.showPageSizeOptions && (
              <div className="ml-3 flex items-center gap-1.5">
                <span>Rows:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded border border-[#D5DDE5] bg-white px-2 py-0.5 text-xs text-[#1B2733] focus:outline-none focus:ring-1 focus:ring-[#0B4F8A]"
                >
                  {[10, 25, 50, 100].map((sz) => (
                    <option key={sz} value={sz}>
                      {sz}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
              className="rounded p-1 text-[#8A97A5] hover:bg-[#F1F5F9] hover:text-[#1B2733] disabled:opacity-30 disabled:pointer-events-none"
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded p-1 text-[#8A97A5] hover:bg-[#F1F5F9] hover:text-[#1B2733] disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-2 font-medium text-[#1B2733]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="rounded p-1 text-[#8A97A5] hover:bg-[#F1F5F9] hover:text-[#1B2733] disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              className="rounded p-1 text-[#8A97A5] hover:bg-[#F1F5F9] hover:text-[#1B2733] disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
