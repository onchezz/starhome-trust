// import { cn } from "@/lib/utils";

import { cn } from "@/utils/utils";

interface ShimmerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Shimmer = ({ className, ...props }: ShimmerProps) => {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent",
        "relative overflow-hidden rounded-md bg-gray-100/10",
        className
      )}
      {...props}
    />
  );
};