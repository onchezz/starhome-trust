import { tokenOptions } from "./constants";

/**
 * Finds a matching token by comparing addresses case-insensitively and handling different prefixes
 * @param {string} searchAddress - The address to search for
 * @param {Array<{symbol: string, address: string}>} tokenOptions - Array of token options
 * @returns {Object | undefined} Matching token object or undefined if not found
 */
export const findMatchingToken = (searchAddress) => {
  // Normalize the search address by removing both '0x' and '0x0' prefixes and converting to lowercase
  const normalizedSearchAddress = searchAddress.toLowerCase().replace(/^0x0?/, '');
  
  return tokenOptions.find(token => {
    // Normalize the token address the same way
    const normalizedTokenAddress = token.address.toLowerCase().replace(/^0x0?/, '');
    return normalizedTokenAddress === normalizedSearchAddress;
  });
};

// // Example usage with different prefix formats:
// const testCases = [
//   { investment_token: "0x02Ab8758891E84b968fF11361789070c6B1Af2dF618D6D2f4a78b0757573C6eB" },
//   { investment_token: "0x2Ab8758891E84b968fF11361789070c6B1Af2dF618D6D2f4a78b0757573C6eB" },
//   { investment_token: "02Ab8758891E84b968fF11361789070c6B1Af2dF618D6D2f4a78b0757573C6eB" }
// ];

// // Test all cases
// testCases.forEach(data => {
//   const matchingToken = findMatchingToken(
//     data.investment_token,
//   );
//   console.log(`Input: ${data.investment_token}`);
//   console.log(`Matched Token: ${matchingToken?.symbol}`);
// });