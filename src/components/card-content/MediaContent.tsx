interface MediaContentProps {
  icon: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode;
}

export const MediaContent = ({ icon, title, meta }: MediaContentProps) => (
  <div className="flex gap-3 p-4">
    {icon}
    <div>
      <div className="font-medium">{title}</div>
      {meta && (
        <div className="text-sm text-muted-foreground">
          {meta}
        </div>
      )}
    </div>
  </div>
);
