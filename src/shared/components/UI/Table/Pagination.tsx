import React from 'react';
import Button from '@/shared/components/UI/Button/Button';

const ChevronLeft: React.FC = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight: React.FC = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

interface PaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  totalCount?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  itemsPerPage = 10,
  totalCount = 0,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalCount);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-[var(--color-neutral-20)]">
      <p className="text-sm font-normal leading-5 text-[var(--color-neutral-40)] font-['Outfit',sans-serif]">
        Showing {startItem} to {endItem} of {totalCount} results
      </p>

      <div className="flex items-center gap-2">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          size="sm"
          aria-label="Previous page"
        >
          <ChevronLeft />
        </Button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + Math.max(1, currentPage - 2);
            if (pageNum > totalPages) return null;

            return (
              <Button
                key={pageNum}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg font-medium text-sm leading-5 font-['Outfit',sans-serif] transition-colors duration-200 ${
                  currentPage === pageNum
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-neutral-10)] text-[var(--color-text-paragraph)] hover:bg-[var(--color-neutral-20)]"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          size="sm"
          aria-label="Next page"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;