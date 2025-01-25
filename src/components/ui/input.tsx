// import * as React from "react";
// import { cn } from "@/utils/utils";

// interface DoubleInputProps extends React.ComponentProps<"input"> {
//   allowNegative?: boolean; // Optional prop to allow negative numbers
//   decimalPlaces?: number; // Optional prop to limit decimal places
// }

// const Input = React.forwardRef<HTMLInputElement, DoubleInputProps>(
//   (
//     {
//       className,
//       type,
//       allowNegative = false,
//       decimalPlaces = 2,
//       onChange,
//       ...props
//     },
//     ref
//   ) => {
//     // Handle input change
//     const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//       const inputValue = event.target.value;

//       // Build regex dynamically based on props
//       let regexPattern = "^";
//       if (allowNegative) regexPattern += "-?"; // Allow negative sign
//       regexPattern += "\\d*"; // Allow digits before the decimal point
//       regexPattern += "\\.?"; // Allow a single decimal point
//       regexPattern += `\\d{0,${decimalPlaces}}`; // Allow up to `decimalPlaces` digits after the decimal point
//       regexPattern += "$";

//       const regex = new RegExp(regexPattern);

//       // Validate input
//       if (regex.test(inputValue)) {
//         if (onChange) {
//           onChange(event); // Call the original onChange handler if provided
//         }
//       }
//     };

//     return (
//       <input
//         type="text" // Use "text" instead of "number" to have full control over input
//         className={cn(
//           "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           className
//         )}
//         ref={ref}
//         onChange={handleInputChange}
//         {...props}
//       />
//     );
//   }
// );

// Input.displayName = "Input";

// export { Input };

import * as React from "react";

import { cn } from "@/utils/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
