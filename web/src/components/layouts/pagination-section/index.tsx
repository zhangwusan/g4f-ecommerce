import React from 'react';
import Pagination from '@mui/material/Pagination';

interface MuiPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MuiPagination: React.FC<MuiPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(_, value) => onPageChange(value)}
      color="primary"
      shape="rounded"
      variant="outlined"
      showFirstButton
      showLastButton
    />
  );
};

export default MuiPagination;