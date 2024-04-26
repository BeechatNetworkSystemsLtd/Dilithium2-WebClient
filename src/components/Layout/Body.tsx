import React, { ReactNode } from "react";

interface BodyProps {
    children: ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => {
    return (
        <div className="flex justify-center h-full min-h-[calc(100vh_-_80px)] w-full  mt-1">
            <div className="flex flex-col items-center w-full bg-gray-200 rounded-md max-w-7xl">{children}</div>
        </div>
    );
};

export default Body;
