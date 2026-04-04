export function suffix(num: number) {
    if (num % 10 === 1 && num !== 11) return 'st'; // 21st, but not 11th
    if (num % 10 === 2 && num !== 12) return 'nd'; // 32nd, but not 12th
    if (num % 10 === 3 && num !== 13) return 'rd'; // 63rd, but not 13th
    return 'th'
}
