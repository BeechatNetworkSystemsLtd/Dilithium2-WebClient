import React, { ReactNode } from "react";
import Header from "./Header";
import Body from "./Body";

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <Header />
            <Body>{children}</Body>
        </div>
    );
};

export default MainLayout;
