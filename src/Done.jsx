import React from 'react';
import Nav from './components/Nav';

const Done = () => {
  return (
    <div>
      <Nav />

        <div className='h-screen flex flex-col items-center justify-center'>
            <p className='bg-gray-100 shadow-sm rounded-sm px-10 py-20 text-xl font-semibold animate__animated animate__bounceInDown'>
                Attendance Submitted!
            </p>
        </div>
    </div>
  )
}

export default Done
