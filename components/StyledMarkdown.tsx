import Markdown from 'react-markdown';
import CopyCodeBlock from '@/components/CopyCodeBlock';


export default function StyledMarkdown(props: { className?: string, children: string }) {
    return (
        <div className={'markdown' + (props.className ? ` ${props.className}` : '')}>
            <Markdown
                components={{
                    pre(props) {
                        const { children, node, ...rest } = props;
                        if (children && typeof children === 'object' && 'props' in children) {
                            const { children: grandChildren, className } = children.props;

                            const match = /language-(\w+)/.exec(className || '')
                            return (
                                <CopyCodeBlock
                                    className="my-2"
                                    children={String(grandChildren).replace(/\n$/, '')}
                                    language={match?.[1]}
                                />
                            )
                        }

                        return (
                            <pre {...rest}>
                                {children}
                            </pre>
                        );
                    }
                }}
            >
                {props.children}
            </Markdown>
        </div>
    )
}