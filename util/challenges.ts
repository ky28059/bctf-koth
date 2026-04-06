export type ChallengeData = {
    name: string,
    id: 'poly' | 'pickle' | 'shell',
    description: string,
    starter: string,
    languages: string[],
    initialLanguage: string
}

export const challenges: ChallengeData[] = [{
    name: 'Polyglot',
    id: 'poly',
    description: 'Write a polyglot that compiles / runs in as many of the following languages as possible: [...]. In each language, your code should read 3 values a, b, and c from `stdin` then output `a^b%c` to `stdout`. [...]',
    languages: ['bash', 'brainfuck', 'c', 'elixir', 'erlang', 'fish', 'golfscript', 'haskell', 'j', 'java', 'julia', 'lua', 'odin', 'perl', 'python', 'racket', 'rust', 'typescript', 'whitespace'],
    initialLanguage: 'haskell',
    starter: `main :: IO ()
main = getLine >>=
    (\\[a, b, c] -> print $ mod (a ^ b) c) . map (read :: String -> Int) . words`
}, {
    name: 'Pickle golf',
    id: 'pickle',
    description: '...',
    languages: [],
    initialLanguage: 'bash', // TODO
    starter: '...'
}, {
    name: 'Shell polyglot',
    id: 'shell',
    description: '...',
    languages: ["bash", "ash", "fish", "rc", "nushell", "powershell", "zsh", "ysh", "elvish", "ksh", "xonsh"],
    initialLanguage: 'bash',
    starter: 'echo hi'
}];
