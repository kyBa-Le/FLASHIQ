import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../ui/pagination";

type PaginationProps = {
  page: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
};

export function PaginationSmart({
  page,
  total,
  pageSize,
  onChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  const handleClick = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) onChange(newPage);
  };

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (page > 4) pages.push("…"); 
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) pages.push(i);

      if (page < totalPages - 3) pages.push("…");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handleClick(page - 1)}
            className={page === 1 ? "opacity-50 pointer-events-none" : ""}
          />
        </PaginationItem>

        {renderPageNumbers().map((p, idx) =>
          typeof p === "number" ? (
            <PaginationItem key={idx}>
              <PaginationLink
                isActive={page === p}
                onClick={() => handleClick(p)}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={idx}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => handleClick(page + 1)}
            className={
              page === totalPages ? "opacity-50 pointer-events-none" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
