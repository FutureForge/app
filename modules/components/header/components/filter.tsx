import { cn } from '@/modules/app'

type FilterButtonsProps<T extends string> = {
  filter: T
  setFilter: (filter: T) => void
  filters: T[]
  className?: string
  disabled?: boolean
  data?: string[]
  collection?: boolean
}

export function FilterButtons<T extends string>({
  filter,
  setFilter,
  filters,
  className,
  disabled = false,
  data,
  collection = false
}: FilterButtonsProps<T>) {
  return (
    <div className="flex justify-between lg:items-center max-md:flex-col gap-4">
      <div className={cn('flex items-center gap-3 max-md:w-full overflow-x-auto whitespace-nowrap', className)}>
        {filters.map((f) => (
          <button
            disabled={disabled}
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

      {collection && (
        <div className="flex gap-4 max-md:w-full max-md:justify-end">
          {data?.map((item, index) => (
            <div key={index}>
              <p>{item}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
