import React, { ReactNode } from "react";
import MainLayout from "./MainLayout";
import { Link, useLocation } from "react-router-dom";

const TabList = [
    { link: "/signing", label: "Signing" },
    { link: "/verification", label: "Verification" },
    { link: "/Modify", label: "Modify Data" },
];

interface TabLayoutProps {
    children: ReactNode;
}

const TabLayout: React.FC<TabLayoutProps> = ({ children }) => {
    const location = useLocation();
    const { pathname } = location;

    return (
        <MainLayout>
            <div className="flex justify-center w-full text-center">
                {TabList.map((tab) => {
                    return (
                        <Link
                            to={tab.link}
                            className={`w-full p-4 md:p-8 text-2xl  ${pathname === tab.link ? "" : "bg-gray-50 opacity-50 shadow-sm"}`}
                            key={tab.label}
                        >
                            {tab.label}
                        </Link>
                    );
                })}
            </div>
            <div className="w-full max-w-3xl px-4">{children}</div>
        </MainLayout>
    );
};

export default TabLayout;
