export type ChallengeData = {
    name: string,
    id: 'poly' | 'pickle' | 'shell',
    description: string,
    starter: string,
}

export const challenges: ChallengeData[] = [{
    name: 'Polyglot',
    id: 'poly',
    description: 'Write a polyglot that compiles / runs in as many of the following languages as possible: [...]. In each language, your code should read 3 values a, b, and c from `stdin` then output `a^b%c` to `stdout`. [...]',
    starter: `main :: IO ()
main = getLine >>=
    (\\[a, b, c] -> print $ mod (a ^ b) c) . map (read :: String -> Int) . words`
}, {
    name: 'Pickle golf',
    id: 'pickle',
    description: '...',
    starter: '...'
}, {
    name: 'Shell polyglot',
    id: 'shell',
    description: '...',
    starter: 'echo hi'
}];
