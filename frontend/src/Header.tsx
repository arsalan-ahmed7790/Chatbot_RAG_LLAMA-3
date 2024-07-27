import { FC } from 'react';
import Logo from './assets/images/logo.png';
import Container from './Container';

const Header: FC = () => {
    return (
        <header className="h-16 bg-gray-50 shadow-md border-b border-gray-300 px-4">
            <Container className="flex items-center h-full gap-x-4">
                <img src={Logo} className="size-12" alt="UET peshawar" />
                <span className="font-bold text-xl italic">UET PESHAWAR</span>
            </Container>
        </header>
    );
};

export default Header;
