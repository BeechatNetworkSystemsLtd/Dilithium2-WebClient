import React, { ReactNode } from 'react';
import Header from './Header';
import Body from './Body';
// import Footer from './Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  //   const wrapper = 'flex justify-center items-center select-none';
  return (
    <div className='flex flex-col items-center justify-center select-none'>
      <Header />
      <Body>{children}</Body>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
