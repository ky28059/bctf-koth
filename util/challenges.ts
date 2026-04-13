export type ChallengeData = PolyglotChallengeData | SpecialChallengeData;

type BaseChallengeData = {
    name: string,
    id: 'poly' | 'pickle' | 'shell',
    description: string
}

export type PolyglotChallengeData = BaseChallengeData & {
    type: 'polyglot',
    starter: string,
    languages: string[],
    initialLanguage: string
}

export type SpecialChallengeData = BaseChallengeData & {
    type: 'special'
}

export const challenges: ChallengeData[] = [{
    type: 'polyglot',
    name: 'Polyglot',
    id: 'poly',
    description: `Write a polyglot that compiles / runs in as many of the following languages as possible:
\`\`\`
[bash, zig, C, elixir, erlang, golfscript, haskell, J, java, julia, lua, odin, perl, python 0, scheme, rust, typescript, whitespace]
\`\`\`
(for exact versions / compilers / docker images, a sample runner is attached below). In each language,

### Input
The first line contains $a$ ($10 \\leq a \\leq 999$).

The second line contains $b$ ($50 \\leq b \\leq 100$).

The third line contains $c$ ($100 \\leq c \\leq 999$).

### Output
Output a single integer equal to $a^b \\mod c$.`,
    languages: ['bash', 'c', 'elixir', 'erlang', 'golfscript', 'haskell', 'j', 'java', 'julia', 'lua', 'odin', 'perl', 'python', 'scheme', 'rust', 'typescript', 'whitespace', 'zig'],
    initialLanguage: 'haskell',
    starter: `powmod :: Int -> Int -> Int -> Int
powmod a 0 c = 1
powmod a b c = let r = powmod a (b - 1) c in mod (a * r) c

main :: IO ()
main =
  (readLn :: IO (Int)) >>= \\a ->
  (readLn :: IO (Int)) >>= \\b ->
  (readLn :: IO (Int)) >>= \\c ->
  print $ powmod a b c`
}, {
    type: 'special',
    name: 'Pickle golf',
    id: 'pickle',
    description: '...'
}, {
    type: 'polyglot',
    name: 'Shell polyglot',
    id: 'shell',
    description: '...',
    languages: ["bash", "ash", "fish", "rc", "nushell", "powershell", "zsh", "ysh", "elvish", "ksh", "xonsh"],
    initialLanguage: 'bash',
    starter: 'echo hi'
}];
