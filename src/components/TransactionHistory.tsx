import React, { useMemo } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Loader2, History } from "lucide-react";
import { type ApiTransaction, PaymentStatus } from "@/types/billing";
import { type VariantProps } from "class-variance-authority";

interface TransactionHistoryProps {
  transactions: ApiTransaction[];
  isLoading: boolean;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    setCurrentPage: (page: number) => void;
  };
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  isLoading,
  pagination,
}) => {
  const { currentPage, totalPages, hasNextPage, hasPrevPage, setCurrentPage } =
    pagination;
  const pageNumbersToDisplay = useMemo(() => {
    if (totalPages <= 1) return [];
    const SIBLING_COUNT = 1;
    const totalNumbers = SIBLING_COUNT + 5;
    if (totalPages <= totalNumbers)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const leftSibling = Math.max(currentPage - SIBLING_COUNT, 1);
    const rightSibling = Math.min(currentPage + SIBLING_COUNT, totalPages);
    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 2;
    if (!showLeftEllipsis && showRightEllipsis)
      return [
        ...Array.from({ length: 3 + 2 * SIBLING_COUNT }, (_, i) => i + 1),
        "ellipsis",
        totalPages,
      ];
    if (showLeftEllipsis && !showRightEllipsis)
      return [
        1,
        "ellipsis",
        ...Array.from(
          { length: totalPages - (totalPages - (3 + 2 * SIBLING_COUNT)) + 1 },
          (_, i) => totalPages - (3 + 2 * SIBLING_COUNT) + i + 1
        ),
      ];
    if (showLeftEllipsis && showRightEllipsis)
      return [
        1,
        "ellipsis",
        ...Array.from(
          { length: rightSibling - leftSibling + 1 },
          (_, i) => leftSibling + i
        ),
        "ellipsis",
        totalPages,
      ];
    return [];
  }, [totalPages, currentPage]);

  return (
    <section className="mt-16">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-foreground flex items-center gap-2">
        <History className="h-7 w-7 text-teal-500" /> Transaction History
      </h2>
      <Card className="bg-dark-600 border border-dark-400">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
            </div>
          ) : transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-dark-500">
                    <TableHead className="w-[180px] text-muted-foreground">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Type
                    </TableHead>
                    <TableHead className="text-muted-foreground">
                      Description
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground">
                      Credits
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground">
                      Amount Paid
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    let badgeVariant: VariantProps<
                      typeof badgeVariants
                    >["variant"] = "secondary";
                    if (
                      tx.payment_status === PaymentStatus.COMPLETED &&
                      tx.amount_paid_decimal &&
                      tx.amount_paid_decimal > 0
                    ) {
                      badgeVariant = "secondary";
                    } else if (tx.payment_status === PaymentStatus.REFUNDED) {
                      badgeVariant = "outline";
                    } else if (tx.amount < 0) {
                      badgeVariant = "destructive";
                    }
                    return (
                      <TableRow
                        key={tx.id}
                        className="border-dark-500 hover:bg-dark-500/30"
                      >
                        <TableCell className="py-3 text-sm">
                          {new Date(tx.timestamp).toLocaleString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge
                            variant={badgeVariant}
                            className="capitalize whitespace-nowrap text-xs"
                          >
                            {tx.transaction_type
                              .replace(/_/g, " ")
                              .toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className="py-3 text-sm max-w-[200px] sm:max-w-xs md:max-w-sm lg:max-w-md truncate"
                          title={tx.description || undefined}
                        >
                          {tx.description || "-"}
                        </TableCell>
                        <TableCell
                          className={`py-3 text-sm text-right font-medium ${
                            tx.amount >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {tx.amount >= 0
                            ? `+${tx.amount.toLocaleString()}`
                            : tx.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-right">
                          {tx.amount_paid_decimal &&
                          tx.currency_paid &&
                          tx.amount_paid_decimal > 0
                            ? `$${tx.amount_paid_decimal.toFixed(2)} ${
                                tx.currency_paid
                              }`
                            : "-"}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16 px-6">
              No transactions found. Your transaction history will appear here.
            </div>
          )}
        </CardContent>
        {transactions.length > 0 && totalPages > 1 && (
          <CardFooter className="flex justify-center py-4 border-t border-dark-500">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasPrevPage) setCurrentPage(currentPage - 1);
                    }}
                    className={
                      !hasPrevPage
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "hover:bg-dark-500"
                    }
                    aria-disabled={!hasPrevPage}
                  />
                </PaginationItem>
                {pageNumbersToDisplay.map((page, index) =>
                  typeof page === "number" ? (
                    <PaginationItem key={`${page}-${index}`}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        className={
                          currentPage === page
                            ? "bg-teal-500 text-black hover:bg-teal-600"
                            : "hover:bg-dark-500"
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (hasNextPage) setCurrentPage(currentPage + 1);
                    }}
                    className={
                      !hasNextPage
                        ? "pointer-events-none opacity-50 cursor-not-allowed"
                        : "hover:bg-dark-500"
                    }
                    aria-disabled={!hasNextPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        )}
      </Card>
    </section>
  );
};

export default TransactionHistory;
