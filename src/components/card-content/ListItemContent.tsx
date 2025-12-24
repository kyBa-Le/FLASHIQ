export function ListItemContent({
  title,
  meta,
}: {
  title: string
  meta: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-muted-foreground">
        {meta}
      </span>
      <h3 className="text-sm font-semibold">
        {title}
      </h3>
    </div>
  )
}
