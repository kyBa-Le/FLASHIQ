export function ListItemContent({
  title,
  meta,
}: {
  title: string
  meta: string
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span className="truncate text-xs leading-4 text-muted-foreground">
        {meta}
      </span>

      <h3 className="line-clamp-2 text-sm font-semibold leading-5">
        {title}
      </h3>
    </div>
  )
}
