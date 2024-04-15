'use client';

import { ReactNode, useEffect, useState } from 'react';
import { AccountDto, me } from '@/lib/webly/api';
import { useRouter } from 'next/navigation';

export function Header() {
  return (
    <div className="relative flex flex-wrap items-center justify-between w-full bg-white group py-7 shrink-0">
      <div>
        <img className="h-12" src="/logo.png" />
      </div>
      <div className="items-center justify-between hidden gap-12 text-black md:flex">
        <a
          className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900"
          href="/project"
        >
          Projects
        </a>
        <a className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900" href="#">
          Features
        </a>
        <a className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900" href="#">
          Pricing
        </a>
        <a className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900" href="#">
          Company
        </a>
      </div>
      <div className="items-center hidden gap-8 md:flex">
        <a
          href={'/login'}
          className="flex items-center text-sm font-normal text-gray-800 hover:text-gray-900 transition duration-300"
        >
          Log In
        </a>
        <a
          href={'/signup'}
          className="flex items-center px-4 py-2 text-sm font-bold rounded-xl bg-purple-100 text-purple-blue-600 hover:bg-purple-600 hover:text-white transition duration-300"
        >
          Sign Up
        </a>
      </div>
      <button className="flex md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 8H21C21.2652 8 21.5196 7.89464 21.7071 7.70711C21.8946 7.51957 22 7.26522 22 7C22 6.73478 21.8946 6.48043 21.7071 6.29289C21.5196 6.10536 21.2652 6 21 6H3C2.73478 6 2.48043 6.10536 2.29289 6.29289C2.10536 6.48043 2 6.73478 2 7C2 7.26522 2.10536 7.51957 2.29289 7.70711C2.48043 7.89464 2.73478 8 3 8ZM21 16H3C2.73478 16 2.48043 16.1054 2.29289 16.2929C2.10536 16.4804 2 16.7348 2 17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17C22 16.7348 21.8946 16.4804 21.7071 16.2929C21.5196 16.1054 21.2652 16 21 16ZM21 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8946 2.73478 13 3 13H21C21.2652 13 21.5196 12.8946 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11Z"
            fill="black"
          ></path>
        </svg>
      </button>
      <div className="absolute flex md:hidden transition-all duration-300 ease-in-out flex-col items-start shadow-main justify-center w-full gap-3 overflow-hidden bg-white max-h-0 group-[.open]:py-4 px-4 rounded-2xl group-[.open]:max-h-64 top-full">
        <a className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900" href="#">
          Projects
        </a>
        <a className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900" href="#">
          Features
        </a>
        <a className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900" href="#">
          Pricing
        </a>
        <a className="text-sm font-normal text-dark-grey-700 hover:text-dark-grey-900" href="#">
          Company
        </a>
        <button className="flex items-center text-sm font-normal text-black">Log In</button>
        <button className="flex items-center px-4 py-2 text-sm font-bold rounded-xl bg-purple-100 text-purple-blue-600 hover:bg-purple-600 hover:text-white transition duration-300">
          Sign Up
        </button>
      </div>
    </div>
  );
}

export function HomeLayout({ children }: { children: any }) {
  return (
    <div className="bg-gray">
      <div className="container flex flex-col mx-auto bg-white">{children}</div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [account, setAccount] = useState<AccountDto>();
  useEffect(() => {
    (async () => {
      try {
        const account = await me();
        setAccount(account);
      } catch (e) {
        console.error(e);
        //router.push('/login');
      }
    })();
  }, [router]);

  return (
    <HomeLayout>
      <div>
        <Header />
        <div className="grid w-full grid-cols-1 my-auto mt-12 mb-8 md:grid-cols-2 xl:gap-14 md:gap-5">
          <div className="flex flex-col justify-center col-span-1 text-center lg:text-start">
            <div className="flex items-center justify-center mb-4 lg:justify-normal">
              <img className="h-5" src="/logo.png" alt="logo" />
              <h4 className="ml-2 text-sm font-bold tracking-widest text-primary uppercase">
                Collaborate with Webly
              </h4>
            </div>
            <h1 className="mb-8 text-4xl font-extrabold leading-tight lg:text-6xl text-dark-grey-900">
              Revolutionize Your Experience
            </h1>
            <p className="mb-6 text-base font-normal leading-7 lg:w-3/4 text-grey-900">
              Webly is here to redefine collaboration and elevate productivity in your online
              endeavors. With its seamless simultaneous Markdown editing feature, teamwork has never
              been easier. Experience the future of the web today with Webly.
            </p>
            <div className="flex flex-col items-center gap-4 lg:flex-row">
              <button className="flex items-center py-4 text-sm font-bold text-white px-7 bg-purple-500 hover:bg-purple-600 focus:ring-4 focus:ring-purple-blue-100 transition duration-300 rounded-xl">
                Get started now
              </button>
              <button className="flex items-center py-4 text-sm font-medium px-7 text-dark-grey-700 hover:text-dark-grey-900 transition duration-300 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 mr-2"
                >
                  <path
                    fill-rule="evenodd"
                    d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                Contact us
              </button>
            </div>
          </div>
          <div className="items-center justify-end hidden col-span-1 md:flex">
            <img className="w-4/5 rounded-md" src="/landing.jpg" alt="header image" />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap mx-3 my-7  ">
        <div className="w-full max-w-full sm:w-3/4 mx-auto text-center">
          <p className="text-sm text-slate-500 py-1">
            Webly from{' '}
            <a href="#" className="text-slate-700 hover:text-slate-900" target="_blank">
              GoodGoodGood
            </a>{' '}
            by{' '}
            <a href="#" className="text-slate-700 hover:text-slate-900" target="_blank">
              team GoodGoodGood
            </a>
            .
          </p>
        </div>
      </div>
    </HomeLayout>
  );
}
