export const formatBalance = (amount: number, isCurrency?:boolean) => {
    const isLarge = amount > 100;
    return new Intl.NumberFormat("en-US", {
   style: isCurrency?  "currency" : "decimal",
      currency: "USD",
      maximumFractionDigits: isLarge? 2:4,
    }).format(amount);
  };
// function formatBalance(num: any): string {
//     // If number is less than 1000, return as is with original decimal places
//     if (num < 1000) {
//       return num.toString();
//     }

//     // Split number into integer and decimal parts
//     const [integerPart, decimalPart] = num.toString().split(".");

//     // Add commas to integer part
//     const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

//     // Return formatted number with original decimal places
//     return decimalPart
//       ? `${formattedInteger}.${decimalPart}`
//       : formattedInteger;
//   }
  
  //   function formatBalance(num: string): string {
//     const [integerPart, decimalPart] = num.split(".");
//     const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return decimalPart !== undefined
//       ? `${formattedInteger}.${decimalPart}`
//       : formattedInteger;
//   }
  