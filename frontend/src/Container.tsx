import clsx from 'clsx';
import { FC, ReactNode } from 'react';

interface Props {
    className?: string;
    children?: ReactNode;
}

const Container: FC<Props> = ({ className, children }) => {
    return (
        <div
            className={clsx(
                'w-full sm:w-[95%] max-w-[76rem] px-4 sm:px-6 md:px-8 lg:px-14 xl:px-20 mx-auto',
                className
            )}
        >
            {children}
        </div>
    );
};

export default Container;
