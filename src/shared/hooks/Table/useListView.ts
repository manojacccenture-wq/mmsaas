import { useState, useMemo } from "react";

interface UseListViewProps<T> {
  data: T[];
  dateKey?: keyof T;
  itemsPerPage?: number;

}

export const useListView = <T extends Record<string, any>>({
  data,
  dateKey,
  itemsPerPage = 10,
}: UseListViewProps<T>) => {

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [dateRange, setDateRange] = useState<{
    start?: Date;
    end?: Date;
  }>({});

  /*
  ==========================
  SEARCH + DATE FILTER
  ==========================
  */

  const filteredData = useMemo(() => {
    let result = [...data];

    /* SEARCH */
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();

      result = result.filter((item) =>
        Object.values(item).some((value) =>
          String(value).toLowerCase().includes(term)
        )
      );
    }

    /* DATE FILTER */
    if (dateKey && (dateRange.start || dateRange.end)) {
      result = result.filter((item) => {
        const rawDate = item[dateKey];
        const itemDate = new Date(rawDate as string | number | Date);

        if (dateRange.start && itemDate < dateRange.start) return false;
        if (dateRange.end && itemDate > dateRange.end) return false;

        return true;
      });
    }

    return result;
  }, [data, searchTerm, dateRange, dateKey]);

  /*
  ==========================
  PAGINATION
  ==========================
  */

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return {
    paginatedData,
    filteredData,
    totalCount: filteredData.length,

    currentPage,
    setCurrentPage,
    totalPages,

    itemsPerPage,

    searchTerm,
    setSearchTerm,

    dateRange,
    setDateRange,
  };
};