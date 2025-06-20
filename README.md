# SearchBar

A modern, accessible search interface with dialog-based overlays and real-time search. Built on cmdk, Radix UI primitives & styled with Tailwind.

---

## Features

- **Accessible**: Built on top of Radix UI primitives
- **Keyboard navigation**: Full keyboard support
- **Search highlighting**: Automatic query highlighting in results
- **Loading states**: Built-in skeleton loading states
- **Debounced search**: Optimized search performance
- **Customizable**: Smart defaults, but fully customizable

---

## Example Usage

```tsx
"use client"

import { Search } from "@upstash/search"
import { SearchBar } from "@upstash/search-ui"

import { FileText } from "lucide-react"

const client = new Search({
  url: "<SEARCH_URL>",
  token: "<READONLY_TOKEN>",
})

const index = client.index<{ title: string }>("movies")

export default function Home() {
  return (
    <div className="max-w-sm mx-auto mt-24 px-2">
      <SearchBar.Dialog>
        <SearchBar.Trigger placeholder="Search movies..." />

        <SearchBar.Content
          title="Search Movies"
          description="Search through our movie database"
        >
          <SearchBar.Input placeholder="Type to search movies..." />
          <SearchBar.Results
            searchFn={(query) => {
              return index.search({ query, limit: 10, reranking: true })
            }}
          >
            {(result) => (
              <SearchBar.Item key={result.id}>
                <SearchBar.Icon>
                  <FileText className="text-gray-600" />
                </SearchBar.Icon>
                <SearchBar.ItemContent>
                  <SearchBar.Title>{result.content.title}</SearchBar.Title>
                  <SearchBar.Subtitle>Movie</SearchBar.Subtitle>
                </SearchBar.ItemContent>
              </SearchBar.Item>
            )}
          </SearchBar.Results>
        </SearchBar.Content>
      </SearchBar.Dialog>
    </div>
  )
}
```