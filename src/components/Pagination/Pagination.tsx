import React from 'react';
import ArrowDownIcon from 'components/icons/ArrowDownIcon';
import styles from './Pagination.module.scss';

type PaginationProps = {
  currentPage: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  pageCount,
  onPageChange,
}) => {
  const getPages = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const sideCount = 2;
    const maxVisible = 5; 

    if (pageCount <= maxVisible + 2) {
      for (let i = 1; i <= pageCount; i++) pages.push(i);
      return pages;
    }

    pages.push(1);

    let start = Math.max(2, currentPage - sideCount);
    let end = Math.min(pageCount - 1, currentPage + sideCount);

    if (start > 2) {
      pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < pageCount - 1) {
      pages.push('...');
    }

    pages.push(pageCount);
    return pages;
  };

  const pages = getPages();

  return (
    <div className={styles.pagination}>
      <button
        className={styles.arrow}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowDownIcon style={{ transform: 'rotate(90deg)' }} />
      </button>

      {pages.map((page, index) => {
        if (page === '...') {
          return (
            <span key={`dots-${index}`} className={styles.dots}>
              ...
            </span>
          );
        }
        const pageNum = page as number;
        return (
          <button
            key={pageNum}
            className={`${styles.pageButton} ${
              pageNum === currentPage ? styles.active : ''
            }`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        );
      })}

      <button
        className={styles.arrow}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        <ArrowDownIcon style={{ transform: 'rotate(-90deg)' }} />
      </button>
    </div>
  );
};