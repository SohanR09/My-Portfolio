import type * as React from "react"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

import { cn } from "@/lib/utils"

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    name: string
    href: string
  }[]
  separator?: React.ReactNode
  home?: boolean
}

export function Breadcrumb({
  segments,
  separator = <ChevronRight className="h-4 w-4" />,
  home = true,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    >
      <ol className="flex items-center gap-1.5">
        {home && (
          <li className="flex items-center gap-1.5">
            <BreadcrumbLink
              href="/"
              className="flex items-center gap-1.5 text-foreground transition-colors hover:text-primary"
            >
              <Home className="h-4 w-4" />
              <span className="sr-only">Home</span>
            </BreadcrumbLink>
            <BreadcrumbSeparator separator={separator} />
          </li>
        )}
        {segments?.map((segment, index) => (
          <li key={segment.href} className="flex items-center gap-1.5">
            <BreadcrumbLink
              href={segment.href}
              className={cn(
                "transition-colors hover:text-primary",
                index === segments.length - 1 ? "text-foreground font-medium pointer-events-none" : "",
              )}
              aria-current={index === segments.length - 1 ? "page" : undefined}
            >
              {segment.name}
            </BreadcrumbLink>
            {index < segments.length - 1 && <BreadcrumbSeparator separator={separator} />}
          </li>
        ))}
      </ol>
    </nav>
  )
}

interface BreadcrumbItemProps extends React.HTMLAttributes<HTMLLIElement> {}

export function BreadcrumbItem({ className, ...props }: BreadcrumbItemProps) {
  return <li className={cn("flex items-center gap-1.5", className)} {...props} />
}

interface BreadcrumbLinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  href: string
}

export function BreadcrumbLink({ href, className, children, ...props }: BreadcrumbLinkProps) {
  return (
    <Link href={href} className={cn("transition-colors hover:text-primary", className)} {...props}>
      {children}
    </Link>
  )
}

interface BreadcrumbSeparatorProps extends React.HTMLAttributes<HTMLSpanElement> {
  separator?: React.ReactNode
}

export function BreadcrumbSeparator({
  separator = <ChevronRight className="h-4 w-4" />,
  className,
  ...props
}: BreadcrumbSeparatorProps) {
  return (
    <span className={cn("flex items-center", className)} {...props}>
      {separator}
    </span>
  )
}

interface BreadcrumbListProps extends React.HTMLAttributes<HTMLOListElement> {}

export function BreadcrumbList({ className, ...props }: BreadcrumbListProps) {
  return <ol className={cn("flex items-center gap-1.5", className)} {...props} />
}

