import classNames from 'classnames';
import { FC, ReactNode } from 'react';

interface Props {
    direction: 'prompt' | 'response';
    children?: ReactNode;
    time: string;
}

const Message: FC<Props> = ({ direction, children, time }) => {
    return (
        <div
            className={classNames('w-9/10 space-y-1', {
                'ml-auto': direction === 'prompt',
                'mr-auto': direction === 'response'
            })}
        >
            <div
                className={classNames('w-full text-sm px-6 py-4 rounded-2xl', {
                    'bg-blue-500 text-white rounded-br-none': direction === 'prompt',
                    'bg-gray-300 text-black rounded-bl-none': direction === 'response'
                })}
            >
                {children}
            </div>
            <p
                className={classNames('text-xs text-gray-900', {
                    'text-right': direction === 'prompt',
                    'text-left': direction === 'response'
                })}
            >
                {time}
            </p>
        </div>
    );
};

export default Message;
