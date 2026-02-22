export const getPages = (
  currentPage: number,
  pageCount: number,
  sideCount: number = 2,
  maxVisible: number = 5
): (number | string)[] => {
  const pages: (number | string)[] = [];

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
