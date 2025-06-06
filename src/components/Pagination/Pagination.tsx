import React from 'react';
import '../../css/Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; 
  'data-testid'?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  'data-testid': dataTestId = "pagination", 
}) => {

  if (totalPages <= 1) {
    return null;
  }

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
    <div className="pagination-container" data-testid={dataTestId}>
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1} 
        data-testid="pagination-prev"
        className="pagination-button"
      >
        Previous
      </button>

      <span className="pagination-info">
        Page {currentPage} з {totalPages}
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages} 
        data-testid="pagination-next"
        className="pagination-button"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;