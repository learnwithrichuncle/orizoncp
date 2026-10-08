export function Loader({ className = "" }: { className?: string }) {
  return (
    <div className={`page-loader ${className}`.trim()}>
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
    </div>
  );
}