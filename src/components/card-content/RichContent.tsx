interface RichContentProps {
  header?: React.ReactNode;
  title: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
}

export const RichContent = ({
  header,
  title,
  body,
  footer,
}: RichContentProps) => (
  <div className="p-5 space-y-3">
    {header}
    <div className="text-lg font-semibold">{title}</div>
    {body}
    {footer}
  </div>
);
