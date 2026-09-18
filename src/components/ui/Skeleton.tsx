interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-cinza-medio dark:bg-azul-light ${className}`}
      aria-hidden="true"
    />
  );
}