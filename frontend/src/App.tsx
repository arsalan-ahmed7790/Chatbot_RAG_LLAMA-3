import { FC } from 'react';
import Header from './Header';
import Search from './Search';

const App: FC = () => {
    return (
        <div className="w-screen min-h-[100dvh] overflow-x-hidden">
            <Header />
            <Search />
        </div>
    );
};

export default App;
