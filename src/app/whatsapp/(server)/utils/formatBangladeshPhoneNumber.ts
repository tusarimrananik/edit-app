export default function formatBangladeshPhoneNumber(input: string): string {
    // Remove all non-digit characters from the input
    const cleaned = input.replace(/\D/g, '');

    // Determine the national number by removing the country code if present
    let nationalNumber: string;
    if (cleaned.startsWith('880')) {
        nationalNumber = cleaned.substring(3);
    } else {
        nationalNumber = cleaned;
    }

    // Check if the number has exactly 10 digits after removing the country code.
    // If not, return the original input unchanged.
    if (nationalNumber.length !== 10) {
        return input;
    }

    // Format the valid Bangladeshi number in the form: +880 ####-######
    const part1 = nationalNumber.substring(0, 4);
    const part2 = nationalNumber.substring(4);
    return `+880 ${part1}-${part2}`;
}
