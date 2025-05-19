import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Pagination({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("flex w-full justify-center items-center gap-2 mt-8", className)}
      {...props}
    >
      {children}
    </nav>
  );
}

export function PaginationContent({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul className={cn("flex items-center gap-1", className)} {...props} />
  );
}

export function PaginationItem({ className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) {
  return <li className={cn("", className)} {...props} />;
}

export function PaginationLink({
  className,
  href,
  isActive,
  ...props
}: React.ComponentProps<typeof Link> & { isActive?: boolean }) {
  return (
    <Link
      href={href || "#"}
      className={cn(
        "px-3 py-1.5 rounded border text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-white border-primary shadow"
          : "bg-white text-maintext border-gray-300 hover:bg-primary/10 hover:text-primary",
        className
      )}
      aria-current={isActive ? "page" : undefined}
      {...props}
    />
  );
}

export function PaginationPrevious({ className, href, disabled, ...props }: React.ComponentProps<typeof Link> & { disabled?: boolean }) {
  return (
    <PaginationItem>
      <Link
        href={href || "#"}
        className={cn(
          "px-3 py-1.5 rounded border text-sm font-medium transition-colors",
          disabled
            ? "bg-gray-100 text-maintext border-gray-200 cursor-not-allowed"
            : "bg-white text-maintext border-gray-300 hover:bg-primary/10 hover:text-primary",
        )}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        Trước
      </Link>
    </PaginationItem>
  );
}

export function PaginationNext({ className, href, disabled, ...props }: React.ComponentProps<typeof Link> & { disabled?: boolean }) {
  return (
    <PaginationItem>
      <Link
        href={href || "#"}
        className={cn(
          "px-3 py-1.5 rounded border text-sm font-medium transition-colors",
          disabled
            ? "bg-gray-100 text-maintext border-gray-200 cursor-not-allowed"
            : "bg-white text-maintext border-gray-300 hover:bg-primary/10 hover:text-primary",
        )}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        {...props}
      >
        Sau
      </Link>
    </PaginationItem>
  );
}

export function PaginationEllipsis({ className }: { className?: string }) {
  return (
    <span className={cn("px-2 text-maintext text-lg select-none", className)}>
      ...
    </span>
  );
} 