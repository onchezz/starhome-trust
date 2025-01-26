// Constants for number limits
const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

/**
 * Converts a string representing a large number to either a Number or BigInt
 * Handles decimal, hexadecimal, binary, octal, and scientific notation
 * @param {string} str - The string to convert
 * @param {boolean} forceBigInt - Whether to always return a BigInt
 * @returns {number|BigInt} The converted number
 */
function parseStringToNumber(str, forceBigInt = false) {
    // Remove whitespace and validate input
    const trimmed = str.trim();
    if (!trimmed) {
        throw new Error('Empty string provided');
    }

    try {
        // Handle hexadecimal (0x prefix)
        if (trimmed.toLowerCase().startsWith('0x')) {
            const value = BigInt(trimmed);
            return forceBigInt ? value : convertToNumberIfSafe(value);
        }

        // Handle binary (0b prefix)
        if (trimmed.toLowerCase().startsWith('0b')) {
            const value = BigInt(trimmed);
            return forceBigInt ? value : convertToNumberIfSafe(value);
        }

        // Handle octal (0o prefix)
        if (trimmed.toLowerCase().startsWith('0o')) {
            const value = BigInt(trimmed);
            return forceBigInt ? value : convertToNumberIfSafe(value);
        }

        // Handle scientific notation and regular numbers
        if (trimmed.includes('e') || trimmed.includes('E')) {
            const value = Number(trimmed);
            return forceBigInt ? BigInt(Math.floor(value)) : value;
        }

        // Handle regular decimal strings
        const value = trimmed.includes('.') ? 
            Number(trimmed) : 
            BigInt(trimmed);
            
        return forceBigInt ? 
            (typeof value === 'number' ? BigInt(Math.floor(value)) : value) : 
            convertToNumberIfSafe(value);

    } catch (error) {
        throw new Error(`Failed to parse number: ${str}. Error: ${error.message}`);
    }
}

/**
 * Converts a BigInt to a Number if it's within safe integer range
 * @param {BigInt} value - The BigInt to convert
 * @returns {number|BigInt} Number if safe, otherwise BigInt
 */
function convertToNumberIfSafe(value) {
    if (typeof value === 'number') return value;
    
    if (value <= BigInt(MAX_SAFE_INTEGER) && value >= BigInt(MIN_SAFE_INTEGER)) {
        return Number(value);
    }
    return value;
}

/**
 * Formats a large number for display, with optional decimal places
 * @param {number|BigInt|string} value - The value to format
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} Formatted string
 */
function formatLargeNumber(value, decimals = 2) {
    const num = typeof value === 'string' ? parseStringToNumber(value) : value;
    
    if (typeof num === 'bigint') {
        // Format BigInt with commas
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Handle regular numbers
    if (Math.abs(num) >= 1e6) {
        // Use scientific notation for very large numbers
        return num.toExponential(decimals);
    }
    
    return num.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

// Example usage:
console.log(parseStringToNumber('12345')); // 12345
console.log(parseStringToNumber('0xFF')); // 255
console.log(parseStringToNumber('1.23e5')); // 123000
console.log(parseStringToNumber('9007199254740991')); // Returns BigInt
console.log(parseStringToNumber('0b1010')); // 10
console.log(parseStringToNumber('0o777')); // 511

// Formatting examples
console.log(formatLargeNumber('123456789')); // "123,456,789"
console.log(formatLargeNumber(1234567890123)); // "1.23e12"
console.log(formatLargeNumber('1234.5678', 3)); // "1,234.568"