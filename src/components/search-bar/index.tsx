"use client"

import { Command as CommandPrimitive } from "cmdk"
import * as React from "react"

import { useDebounce } from "../../hooks"
import { cn } from "../../utils"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  Dialog as DialogPrimitive,
  DialogTitle,
  DialogTrigger,
} from "./dialog"

const SearchContext = React.createContext<any | null>(null)

export const useSearchIndex = () => {
  const context = React.useContext(SearchContext)
  return context
}

function Root({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [immediateQuery, setImmediateQuery] = React.useState("")

  return (
    <SearchContext.Provider
      value={{
        debouncedQuery,
        setDebouncedQuery,
        immediateQuery,
        setImmediateQuery,
      }}
    >
      <CommandPrimitive
        shouldFilter={false}
        data-slot="command"
        className={cn(
          "bg-white text-black overflow-hidden p-2 sm:p-5 flex h-full w-full flex-col",
          className
        )}
        {...props}
      >
        {children}
      </CommandPrimitive>
    </SearchContext.Provider>
  )
}

function SearchDialog({
  children,
  open,
  onOpenChange,
  ...props
}: React.ComponentProps<typeof DialogPrimitive> & {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [debouncedQuery, setDebouncedQuery] = React.useState("")
  const [immediateQuery, setImmediateQuery] = React.useState("")

  return (
    <SearchContext.Provider
      value={{
        debouncedQuery,
        setDebouncedQuery,
        immediateQuery,
        setImmediateQuery,
      }}
    >
      <DialogPrimitive open={open} onOpenChange={onOpenChange} {...props}>
        {children}
      </DialogPrimitive>
    </SearchContext.Provider>
  )
}

function SearchContent({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  className,
  ...props
}: {
  title?: string
  description?: string
} & React.ComponentProps<typeof DialogContent>) {
  return (
    <div className="relative">
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-24 overflow-hidden p-0 rounded-2xl sm:rounded-3xl",
          className
        )}
        {...props}
      >
        <Root className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Root>
      </DialogContent>
    </div>
  )
}

function SearchTrigger({
  placeholder = "Search...",
  className,
  ...props
}: {
  placeholder?: string
  className?: string
} & React.ComponentProps<typeof DialogTrigger>) {
  return (
    <DialogTrigger asChild {...props}>
      <button
        type="button"
        className={cn(
          "flex items-center gap-3 w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50",
          className
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 shrink-0"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
        <span className="flex-1 text-left">{placeholder}</span>
      </button>
    </DialogTrigger>
  )
}

function Input({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  const [query, setQuery] = React.useState("")
  const debouncedQuery = useDebounce(query, 300)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const searchContext = useSearchIndex()

  React.useEffect(() => {
    searchContext?.setDebouncedQuery?.(debouncedQuery)
  }, [debouncedQuery, searchContext])

  React.useEffect(() => {
    searchContext?.setImmediateQuery?.(query)
  }, [query, searchContext])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setQuery("")
      searchContext?.setDebouncedQuery?.("")
      searchContext?.setImmediateQuery?.("")
    }
  }

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-4 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 shrink-0 opacity-50"
          aria-hidden="true"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </div>
      <CommandPrimitive.Input
        ref={inputRef}
        value={query}
        onValueChange={(v) => setQuery(v)}
        onKeyDown={handleKeyDown}
        data-slot="command-input"
        className={cn(
          "placeholder:text-gray-400 border border-gray-800 ring-2 ring-transparent border-opacity-50 bg-clip-padding shadow focus:ring-emerald-500 pl-12 flex h-12 w-full rounded-lg py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        aria-label="Search"
        aria-describedby={query.length > 0 ? "search-help" : undefined}
        {...props}
        autoFocus
      />
    </div>
  )
}

function Empty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  )
}

function Group({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className
      )}
      {...props}
    />
  )
}

function Separator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-gray-200 -mx-1 h-px", className)}
      {...props}
    />
  )
}

function Item({
  className,
  children,
  onSelect,
  value,
  icon,
  ...props
}: {
  className?: string
  children: React.ReactNode
  onSelect?: () => void
  icon?: React.ReactNode | false
  value?: string
} & React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <>
      <CommandPrimitive.Item
        data-slot="command-item"
        value={value}
        className={cn(
          "group data-[selected=true]:bg-gray-100 relative flex cursor-default items-center gap-3 rounded-xl p-3 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 hover:bg-gray-50",
          className
        )}
        onSelect={onSelect}
        {...props}
      >
        {children}

        {icon === false ? null : Boolean(icon) ? (
          <div className="shrink-0 opacity-0 group-data-[selected=true]:opacity-100">
            {icon}
          </div>
        ) : (
          <div className="shrink-0 opacity-0 group-data-[selected=true]:opacity-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 text-gray-400"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </div>
        )}
      </CommandPrimitive.Item>
    </>
  )
}

function Icon({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center size-10 rounded-lg p-2.5 border border-gray-200 bg-white shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

function Title({
  children,
  className,
  highlightClassName,
  ...props
}: {
  children: React.ReactNode
  highlightClassName?: string
  className?: string
} & React.HTMLAttributes<HTMLParagraphElement>) {
  const searchContext = useSearchIndex()
  const query = searchContext?.debouncedQuery || ""

  const levenshtein = (a: string, b: string): number => {
    if (a.length === 0) return b.length
    if (b.length === 0) return a.length

    const matrix = Array(b.length + 1)
      .fill(null)
      .map(() => Array(a.length + 1).fill(null))

    for (let i = 0; i <= a.length; i++) matrix[0][i] = i
    for (let j = 0; j <= b.length; j++) matrix[j][0] = j

    for (let j = 1; j <= b.length; j++) {
      for (let i = 1; i <= a.length; i++) {
        const indicator = a[i - 1] === b[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        )
      }
    }

    return matrix[b.length][a.length]
  }

  const highlightMatches = (text: string, query: string) => {
    if (!query.trim() || typeof text !== "string") return text

    const searchWords = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length >= 2)
    if (searchWords.length === 0) return text

    const tokens = text.split(/(\s+|[.,!?;])/g)

    return tokens.map((token, i) => {
      const tokenLower = token.trim().toLowerCase()
      if (!tokenLower) return token

      let highlightedToken: React.ReactElement | string = token
      let shouldHighlight = false

      searchWords.forEach((searchWord) => {
        const exactIndex = tokenLower.indexOf(searchWord)
        if (exactIndex !== -1) {
          shouldHighlight = true
          if (token.length > searchWord.length) {
            const prefix = token.slice(0, exactIndex)
            const match = token.slice(
              exactIndex,
              exactIndex + searchWord.length
            )
            const suffix = token.slice(exactIndex + searchWord.length)
            highlightedToken = (
              <>
                {prefix}
                <span
                  className={cn(
                    "underline underline-offset-3 decoration-2 decoration-emerald-500 text-emerald-500",
                    highlightClassName
                  )}
                >
                  {match}
                </span>
                {suffix}
              </>
            )
          }
          return
        }

        const maxDistance =
          searchWord.length <= 2 ? 0 : searchWord.length <= 4 ? 1 : 2

        for (let i = 0; i <= tokenLower.length - searchWord.length; i++) {
          const substring = tokenLower.slice(i, i + searchWord.length)
          if (levenshtein(substring, searchWord) <= maxDistance) {
            shouldHighlight = true
            const prefix = token.slice(0, i)
            const match = token.slice(i, i + searchWord.length)
            const suffix = token.slice(i + searchWord.length)
            highlightedToken = (
              <>
                {prefix}
                <span
                  className={cn(
                    "underline underline-offset-3 decoration-2 decoration-emerald-500 text-emerald-500",
                    highlightClassName
                  )}
                >
                  {match}
                </span>
                {suffix}
              </>
            )
            return
          }
        }
      })

      return shouldHighlight ? (
        typeof highlightedToken === "string" ? (
          <span
            key={i}
            className={cn(
              "underline underline-offset-3 decoration-2 decoration-emerald-500 text-emerald-500",
              highlightClassName
            )}
          >
            {token}
          </span>
        ) : (
          <span key={i}>{highlightedToken}</span>
        )
      ) : (
        token
      )
    })
  }

  const content = typeof children === "string" ? children : ""

  if (query && typeof children === "string") {
    return (
      <p className={cn("font-medium text-gray-900", className)} {...props}>
        {highlightMatches(content, query)}
      </p>
    )
  }

  return (
    <p className={cn("font-medium text-gray-900", className)} {...props}>
      {children}
    </p>
  )
}

function Subtitle({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-gray-500 mt-0.5", className)} {...props}>
      {children}
    </p>
  )
}

function ItemContent({
  children,
  className,
  ...props
}: {
  children: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 min-w-0", className)} {...props}>
      {children}
    </div>
  )
}

function List({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "outline-none border-none",
        "max-h-[300px] mt-5 scroll-py-5 overflow-x-hidden overflow-y-auto",
        "[&::-webkit-scrollbar]:w-1.5",
        "[&::-webkit-scrollbar-track]:bg-transparent",
        "[&::-webkit-scrollbar-thumb]:bg-gray-200",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb:hover]:bg-gray-300",
        className
      )}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgb(229 231 235) transparent",
      }}
      {...props}
    />
  )
}

type OptionalPromise<T> = Promise<T> | T

interface ResultProps<T>
  extends Omit<React.ComponentProps<typeof CommandPrimitive.List>, "children"> {
  children: (result: T) => React.ReactNode
  searchFn: (query: string) => OptionalPromise<T[]>
  debounceMs?: number
}

function Results<T = any>({
  children,
  debounceMs = 150,
  searchFn,
  ...props
}: ResultProps<T>) {
  const [results, setResults] = React.useState<T[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const searchContext = useSearchIndex()
  const { debouncedQuery, immediateQuery } = searchContext || {}
  const currentQueryRef = React.useRef<string>("")

  const search = async ({ query }: { query: string }) => {
    if (query.trim() && searchFn) {
      currentQueryRef.current = query
      setIsLoading(true)
      try {
        const searchResults = await searchFn(query)
        if (currentQueryRef.current === query) {
          setResults(Array.isArray(searchResults) ? searchResults : [])
        }
      } catch (error) {
        console.error("Search error:", error)
        if (currentQueryRef.current === query) {
          setResults([])
        }
      } finally {
        if (currentQueryRef.current === query) {
          setIsLoading(false)
        }
      }
    } else {
      currentQueryRef.current = ""
      setResults([])
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (!Boolean(immediateQuery?.trim())) {
      currentQueryRef.current = ""
      setResults([])
      setIsLoading(false)
      return
    }
  }, [immediateQuery])

  React.useEffect(() => {
    if (debouncedQuery !== undefined && debouncedQuery.trim()) {
      search({ query: debouncedQuery })
    } else {
      currentQueryRef.current = ""
      setResults([])
      setIsLoading(false)
    }
  }, [debouncedQuery, searchFn])

  if (isLoading) {
    return (
      <List {...props}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="relative flex cursor-default items-center gap-3 rounded-xl p-3 text-sm outline-hidden select-none"
          >
            <div className="flex items-center justify-center size-10 rounded-lg border border-gray-200 bg-gray-100 shrink-0 animate-pulse" />
            <div className="flex flex-col flex-1 min-w-0">
              <div
                className="h-4 bg-gray-200 rounded animate-pulse mb-1.5"
                style={{ width: `${60 + Math.random() * 30}%` }}
              />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3" />
            </div>
          </div>
        ))}
      </List>
    )
  }

  if (!Boolean(results.length)) {
    return null
  }

  return <List {...props}>{results.map((result) => children(result))}</List>
}

export const SearchBar = {
  Dialog: SearchDialog,
  DialogContent: SearchContent,
  DialogTrigger: SearchTrigger,
  Input,
  Result: Item,
  ResultIcon: Icon,
  ResultTitle: Title,
  ResultContent: ItemContent,
  Separator,
  Results,
}
