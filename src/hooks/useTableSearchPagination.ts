import React from 'react';

const DEFAULT_ROWS_PER_PAGE = 10;

export const buildDefaultSearchText = (value: unknown): string => {
  if (value === null || value === undefined) {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map(buildDefaultSearchText).join(' ');
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>)
      .map(buildDefaultSearchText)
      .join(' ');
  }

  return String(value);
};

const normalizeSearchText = (value: string) => value.toLowerCase().trim();

const useTableSearchPagination = <T,>(
  items: T[],
  getSearchText: (item: T) => string = buildDefaultSearchText
) => {
  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);

  const normalizedSearch = normalizeSearchText(search);
  const filteredItems = normalizedSearch === ''
    ? items
    : items.filter((item) => normalizeSearchText(getSearchText(item)).includes(normalizedSearch));

  React.useEffect(() => {
    setPage(0);
  }, [search, rowsPerPage]);

  React.useEffect(() => {
    const maxPage = Math.max(0, Math.ceil(filteredItems.length / rowsPerPage) - 1);

    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredItems.length, page, rowsPerPage]);

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return {
    search,
    page,
    rowsPerPage,
    filteredItems,
    paginatedItems,
    handleSearchChange,
    handlePageChange,
    handleRowsPerPageChange
  };
};

export default useTableSearchPagination;
