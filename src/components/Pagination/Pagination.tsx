import React from 'react';
import ArrowDownIcon from 'components/icons/ArrowDownIcon';
import { getPages } from 'utils/getPages';
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
  const pages = getPages(currentPage, pageCount);

  return (
    <div className={styles.pagination}>
      <button
      type = 'button'
        className={styles.arrow}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowDownIcon style={{ transform: 'rotate(90deg)' }} />
      </button>

      {pages.map((page, index) => {
        if (typeof page === 'string') {
          return (
            <span key={`dots-${index}`} className={styles.dots}>
              ...
            </span>
          );
        }
        return (
          <button
          type='button'
            key={page}
            className={`${styles.pageButton} ${page === currentPage ? styles.active : ''
              }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      <button
      type='button'
        className={styles.arrow}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageCount}
      >
        <ArrowDownIcon style={{ transform: 'rotate(-90deg)' }} />
      </button>
    </div>
  );
};