export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-cinza-medio dark:bg-azul-light ${className}`}
    />
  );
}