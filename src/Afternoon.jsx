import Nav from './components/Nav';
import Footer from './components/Footer';
import 'animate.css';

const Afternoon = () => {
  return (
    <div>
      <Nav />

        <div className='h-screen flex flex-col items-center justify-center'>
            <p className='bg-gray-100 shadow-sm rounded-sm px-10 py-20 text-xl font-semibold animate__animated animate__bounceInDown'>
                Hey, You are not in Afternoon School!
            </p>

            <img src="/sad.webp" alt="Sad Face" className='rounded-full w-40 h-40 shadow-xl animate__animated animate__bounceInLeft' />
        </div>

        <Footer />
    </div>
  )
}

export default Afternoon
