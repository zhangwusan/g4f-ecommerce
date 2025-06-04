import React from 'react';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';

interface MuiPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const StyledPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPagination-ul': {
    justifyContent: 'center',
    gap: theme.spacing(1),
  },
  '& .MuiPaginationItem-root': {
    borderRadius: '50%',
    border: `1px solid ${theme.palette.divider}`,
    color: '#679cff',
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: '#fff',
      borderColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

const MuiPagination: React.FC<MuiPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <StyledPagination
      count={totalPages}
      page={currentPage}
      onChange={(_, value) => onPageChange(value)}
      shape="rounded"
      variant="outlined"
      showFirstButton
      showLastButton
    />
  );
};

export default MuiPagination;