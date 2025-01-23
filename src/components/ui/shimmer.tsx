import { cn } from "@/utils/utils";

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Shimmer = ({ className, ...props }: ShimmerProps) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:400%_100%] animate-shimmer",
        className
      )}
      {...props}
    />
  );
};