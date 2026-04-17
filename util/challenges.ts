export type ChallengeData = PolyglotChallengeData | SpecialChallengeData;

export type ChallengeId = 'poly' | 'pickle' | 'bf' | 'compcov';
type BaseChallengeData = {
    name: string,
    author: string,
    runnerUrl: string,
    id: ChallengeId,
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
    author: 'oh_word',
    id: 'poly',
    runnerUrl: 'ws://polyglot-outer-1:5000',
    description: `Write a polyglot that compiles / runs in as many of the following languages as possible:
\`\`\`
[bash, zig, C, elixir, erlang, fish, golfscript, haskell, J, java, julia, lua, odin, perl, python 0, scheme, rust, typescript, whitespace]
\`\`\`
(for exact versions / compilers / docker images, a sample runner is attached below). In each language, the program should:

### Input
The first line contains $a$ ($2^8 \\leq a < 2^{16}$).

The second line contains $b$ ($2^6 \\leq b < 2^8$).

The third line contains $c$ ($2^{10} \\leq c < 2^{12}$).

### Output
Output a single integer equal to $a^b \\mod c$.`,
    languages: ['bash', 'c', 'elixir', 'erlang', 'golfscript', 'fish', 'haskell', 'j', 'java', 'julia', 'lua', 'odin', 'perl', 'python', 'scheme', 'rust', 'typescript', 'whitespace', 'zig'],
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
    name: 'Pickelang',
    author: 'quasar098',
    id: 'pickle',
    runnerUrl: 'ws://remote-server-1:5000',
    description: `pickelang is an esolang that uses the stack-based pickle virtual machine for evaluation; turing
completeness is achieved by recursive pickle functionality using the \`BINPERSID\` opcode, \`add\`, and \`getitem\` functions
(a sample runner is attached below).

Submit the shortest pickelang payload that passes 5 test cases specified below (100s timeout, 100MB memory limit).

\`struct.pack\` and \`struct.unpack\` are given for convenience.

### Input
The input is a single string in the format \`[A, B, C]\` ($2 \\leq A < 2^{15}, 1 \\leq B < 2^{15}, 2^{15} \\leq C < 2^{16}$)
and can be retrieved using the \`input\` function.

### Output
Output a single integer equal to $A^B \\mod C$. This can be done by stopping the outermost unpickler evaluation with
$A^B \\mod C$ on the top of the stack.`
}, {
    type: 'special',
    name: 'Brainfuck golf',
    author: 'oh_word',
    id: 'bf',
    runnerUrl: 'ws://brainfuck-outer-1:5001',
    description: `Write the shortest Brainfuck program that computes \`powmod\` as specified (a sample runner
is attached below).

> Note: You are in charge of converting strings to ints and ints to strings. Don’t be lazy now.

### Input
The first line contains $a$ ($10 \\leq a \\leq 999$).

The second line contains $b$ ($50 \\leq b \\leq 100$).

The third line contains $c$ ($100 \\leq c \\leq 999$).

### Output
Output a single integer equal to $a^b \\mod c$.`
}, {
    type: 'polyglot',
    name: 'Compiler coverage',
    author: 'pawnlord',
    id: 'compcov',
    runnerUrl: 'ws://remote-server-1:5000', // TODO
    description: '...',
    languages: ['cpp'],
    initialLanguage: 'cpp',
    starter: `#include <iostream>

int main() {
    std::cout << "Hello world!" << std::endl;
}`
} /*, {
    type: 'polyglot',
    name: 'Shell polyglot',
    id: 'shell',
    description: '...',
    languages: ["bash", "ash", "fish", "rc", "nushell", "powershell", "zsh", "ysh", "elvish", "ksh", "xonsh"],
    initialLanguage: 'bash',
    starter: 'echo hi'
} */];
