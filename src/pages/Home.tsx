const Home = () => {
  const wrapper = 'flex justify-center items-center select-none';
  const content = 'flex items-center mobile:flex-col-reverse';
  return (
    <div className={wrapper}>
      <div className={content}>
        <div className='flex flex-col items-center'>
          <h1 className='transition-all duration-500 text-[4rem] mobile:text-[3rem]'>
            malinatrash
          </h1>
          <h1 className='text-[3rem] mobile:text-[2rem]'>
            React Tailwind Template
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Home;
