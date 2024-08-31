export type FilterType = 'All' | 'Recently Listed' | 'Recently Sold' | 'Recently Auctioned'

type FilterButtonsProps = {
  filter: FilterType
  setFilter: (filter: FilterType) => void
}

export function FilterButtons({ filter, setFilter }: FilterButtonsProps) {
  const filters: FilterType[] = ['All', 'Recently Listed', 'Recently Sold', 'Recently Auctioned']

  return (
    <div className="flex flex-wrap items-center gap-3">
      {filters.map((f) => (
        <button
          key={f}
          className={`px-4 py-2 m-2 rounded-xl hover:text-foreground ${
            filter === f ? 'bg-sec-bg text-foreground' : 'text-muted-foreground'
          } transition ease-in-out duration-200`}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
