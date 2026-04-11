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
    description: `Write a polyglot that compiles / runs in as many of the following languages as possible:
- Bash
- Brainfuck
- C
- Elixir
- Erlang
- GolfScript
- Haskell
- J
- Java
- Julia
- Lua
- Odin
- Perl
- Python 0 [[Image](https://hub.docker.com/r/dustingram/vintage-python)]
- Scheme
- Rust
- TypeScript
- Whitespace

In each language, your code should read 3 space-separated integers a, b, and c from \`stdin\`, then output \`pow(a, b) % c\` to \`stdout\`. Overflow resilience will be tested!`,
    languages: ['bash', 'brainfuck', 'c', 'elixir', 'erlang', 'golfscript', 'haskell', 'j', 'java', 'julia', 'lua', 'odin', 'perl', 'python', 'racket', 'rust', 'typescript', 'whitespace'],
    initialLanguage: 'haskell',
    starter: `powmod :: Int -> Int -> Int -> Int
powmod a 1 c = mod a c
powmod a b c = let r = powmod a (b - 1) c in mod (a * r) c

main :: IO ()
main =
  (readLn :: IO (Int)) >>= \\a ->
  (readLn :: IO (Int)) >>= \\b ->
  (readLn :: IO (Int)) >>= \\c ->
  print $ powmod a b c`
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
