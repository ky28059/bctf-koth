import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-elixir';
import 'prismjs/components/prism-brainfuck';
import 'prismjs/components/prism-odin';
import 'prismjs/components/prism-lua';
import 'prismjs/components/prism-scheme';
import 'prismjs/components/prism-racket';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-julia';
import 'prismjs/components/prism-erlang';
import 'prismjs/components/prism-j';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-haskell';
import 'prismjs/components/prism-powershell';


type LanguageSelectorProps = {
    languages: string[],
    language: string,
    setLanguage: (l: string) => void,
}
export default function LanguageSelector(props: LanguageSelectorProps) {
    return (
        <div className="flex gap-x-2 gap-y-1 flex-wrap mt-8">
            {languages.filter((s) => props.languages.includes(s.name)).sort((a, b) => a.name.localeCompare(b.name)).map((l) => (
                <button
                    className="flex items-center cursor-pointer border border-tertiary px-1 py-0.5 text-sm rounded disabled:opacity-50 hover:bg-white/10 transition duration-100 disabled:hover:bg-transparent"
                    onClick={() => props.setLanguage(l.name)}
                    disabled={!l.highlight}
                    key={l.name}
                >
                    {l.icon && (
                        <img
                            src={`/icons/${l.icon}`}
                            alt={l.name}
                            className={'size-4 mr-1 object-contain object-center' + (l.invert ? ' dark:invert dark:hue-rotate-180' : '')}
                        />
                    )}
                    {l.name}
                </button>
            ))}
        </div>
    )
}

const languages = [{
    name: "python",
    highlight: true,
    icon: 'python.svg',
    invert: false
}, {
    name: "fish",
    highlight: false,
    invert: false
}, {
    name: "whitespace",
    highlight: false,
    invert: false
}, {
    name: "perl",
    highlight: true,
    icon: 'perl.svg',
    invert: false
}, {
    name: "rust",
    highlight: true,
    icon: 'rust.svg',
    invert: true
}, {
    name: "elixir",
    highlight: true,
    icon: 'elixir.svg',
    invert: false
}, {
    name: "brainfuck",
    highlight: true,
    invert: false
}, {
    name: "bash",
    highlight: true,
    icon: 'bash.svg',
    invert: false
}, {
    name: "c",
    highlight: true,
    icon: 'c.png',
    invert: false
}, {
    name: "odin",
    highlight: true,
    icon: 'odin.svg',
    invert: false
}, {
    name: "lua",
    highlight: true,
    icon: 'lua.svg',
    invert: false
}, {
    name: "racket",
    highlight: true,
    icon: 'racket.svg',
    invert: false
}, {
    name: "typescript",
    highlight: true,
    icon: 'typescript.svg',
    invert: false
}, {
    name: "julia",
    highlight: true,
    icon: 'julia.svg',
    invert: true
}, {
    name: "haskell",
    highlight: true,
    icon: 'haskell.svg',
    invert: false
}, {
    name: "erlang",
    highlight: true,
    icon: 'erlang.svg',
    invert: false
}, {
    name: "j",
    highlight: true,
    icon: 'j.png',
    invert: false
}, {
    name: "golfscript",
    highlight: false,
    invert: false
}, {
    name: "java",
    highlight: true,
    icon: 'java.svg',
    invert: false
}, {
    name: "ash",
    highlight: false,
    invert: false
}, {
    name: "rc",
    highlight: false,
    invert: false
}, {
    name: "nushell",
    highlight: false,
    // icon: 'nushell.svg',
    invert: false
}, {
    name: "powershell",
    highlight: true,
    icon: 'powershell.png',
    invert: false
}, {
    name: "zsh",
    highlight: false,
    // icon: 'zsh.svg',
    invert: true
}, {
    name: "ysh",
    highlight: false,
    invert: false
}, {
    name: "elvish",
    highlight: false,
    invert: false
}, {
    name: "ksh",
    highlight: false,
    invert: false
}, {
    name: "xonsh",
    highlight: false,
    invert: false
}]
