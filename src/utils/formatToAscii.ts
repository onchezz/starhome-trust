function isAscii(text: string): boolean {
        // Check if all characters have ASCII codes between 0 and 127
    return text.split('').every(char => char.charCodeAt(0) <= 127);
    // return /^[\x00-\x7F]*$/.test(text);
}

export function convertToAscii(text: string): string {
    // If text is already ASCII, return as is
    if (isAscii(text)) {
        return text;
    }
       // Check if text contains Arabic, if not return as is
    if (!isArabic(text)) {
        return text;
    }

    // Define Arabic to ASCII mapping
    const arabicToAscii: { [key: string]: string } = {
        'ا': 'a',
        'أ': 'a',
        'إ': 'e',
        'ب': 'b',
        'ت': 't',
        'ث': 'th',
        'ج': 'j',
        'ح': 'h',
        'خ': 'kh',
        'د': 'd',
        'ذ': 'th',
        'ر': 'r',
        'ز': 'z',
        'س': 's',
        'ش': 'sh',
        'ص': 's',
        'ض': 'd',
        'ط': 't',
        'ظ': 'z',
        'ع': 'a',
        'غ': 'gh',
        'ف': 'f',
        'ق': 'q',
        'ك': 'k',
        'ل': 'l',
        'م': 'm',
        'ن': 'n',
        'ه': 'h',
        'و': 'w',
        'ي': 'y',
        'ى': 'a',
        'ئ': 'e',
        'ء': 'a',
        'ؤ': 'o',
        'ة': 'h',
        ' ': ' ',
        'آ': 'a'
    };

    return convertArabicToAscii(text)
    
        // .split('')
        // .map(char => arabicToAscii[char] || char)
        // .join('')
        // // Remove diacritics (harakat)
        // .replace(/[\u064B-\u065F]/g, '')
        // // Replace multiple spaces with single space
        // .replace(/\s+/g, ' ')
        // // Make lowercase
        // .toLowerCase()
        // // Replace multiple consecutive letters with single letter
        // .replace(/(.)\1+/g, '$1');
}

function convertArabicToAscii(text: string): string {
    // Define Arabic to ASCII mapping
    
    const arabicToAscii: { [key: string]: string } = {
        'ا': 'a',
        'أ': 'a',
        'إ': 'e',
        'ب': 'b',
        'ت': 't',
        'ث': 'th',
        'ج': 'j',
        'ح': 'h',
        'خ': 'kh',
        'د': 'd',
        'ذ': 'th',
        'ر': 'r',
        'ز': 'z',
        'س': 's',
        'ش': 'sh',
        'ص': 's',
        'ض': 'd',
        'ط': 't',
        'ظ': 'z',
        'ع': 'a',
        'غ': 'gh',
        'ف': 'f',
        'ق': 'q',
        'ك': 'k',
        'ل': 'l',
        'م': 'm',
        'ن': 'n',
        'ه': 'h',
        'و': 'w',
        'ي': 'y',
        'ى': 'a',
        'ئ': 'e',
        'ء': 'a',
        'ؤ': 'o',
        'ة': 'h',
        ' ': ' ',
        'آ': 'a'
    };

    // Convert each character
    return text
        .split('')
        .map(char => arabicToAscii[char] || char)
        .join('')
        // Remove diacritics (harakat)
        .replace(/[\u064B-\u065F]/g, '')
        // Replace multiple spaces with single space
        .replace(/\s+/g, ' ')
        // Make lowercase
        .toLowerCase()
        // Replace multiple consecutive letters with single letter
        .replace(/(.)\1+/g, '$1');
}

function isArabic(text: string): boolean {
    // Arabic Unicode range: \u0600-\u06FF
    const arabicPattern = /[\u0600-\u06FF]/;
    return arabicPattern.test(text);
}