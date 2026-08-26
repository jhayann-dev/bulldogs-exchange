import { Outlet } from 'react-router-dom';
import logo from '../assets/img/nubdexchange_logo.png';
import bgImage from '../assets/img/bg.jpg';


const AuthLayout = () => {
  return (
    <section className="min-h-screen bg-cover bg-center text-zinc-900" style={{backgroundImage: `url(${bgImage})`}}>
      <div className="grid min-h-screen w-full lg:grid-cols-[1fr_0.95fr]">
        <div className="flex items-center justify-center border-b-2 border-zinc-300 bg-blue/20 backdrop-blur-[1px] p-8 sm:p-10 lg:border-b-0 lg:border-r-2 lg:border-zinc-300 lg:p-16">
          <div className="flex w-full max-w-md items-center justify-center rounded-4xl border-2 border-dashed border-zinc-300 bg-zinc-100/60 p-8 sm:p-10">
            <div >
              <img src={logo} alt="Logo" className="w-full max-w-[20rem] object-contain" />
            </div>
          </div>
        </div>

        <main className="flex items-center bg-yellow-500 px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto w-full max-w-md">
            <Outlet />
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthLayout;
