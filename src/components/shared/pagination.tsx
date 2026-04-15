"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  total: number;
  perPage?: number;
  onChange: (page: number) => void;
}

export function Pagination({
  page,
  total,
  perPage = 9,
  onChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
        let pageNum = i + 1;
        if (totalPages > 5 && page > 3) {
          pageNum = page - 3 + i;
          if (pageNum > totalPages) return null;
        }
        return (
          <Button
            key={pageNum}
            variant={page === pageNum ? "default" : "outline"}
            size="icon"
            onClick={() => onChange(pageNum)}
            className="h-9 w-9"
          >
            {pageNum}
          </Button>
        );
      })}

      {totalPages > 5 && page < totalPages - 2 && (
        <span className="text-muted-foreground">...</span>
      )}

      {totalPages > 5 && page < totalPages - 2 && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => onChange(totalPages)}
          className="h-9 w-9"
        >
          {totalPages}
        </Button>
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
