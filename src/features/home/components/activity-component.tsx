'use client';

import { useState } from 'react';

export default function ActivityComponent() {
  const [path, setPath] = useState('Activity');

  return (
    <div className="scrollbar-hide relative flex overflow-x-auto transition-all w-full">
      {navData.navMain.map((item) => {
        const isActive = path === item.pathname;

        return (
          <div key={item.title} className="relative w-full text-center">
            <div
              className="absolute bottom-0 w-full"
              style={{
                transform: 'none',
                transformOrigin: '50% 50% 0px',
              }}
            >
              <div
                className={`h-0.5 ${
                  isActive ? 'bg-primary' : 'bg-muted-foreground/10'
                }`}
              ></div>
            </div>
            <div
              className={`p-3 transition-all duration-75 ${
                isActive
                  ? 'bg-primary/5'
                  : 'hover:bg-muted-foreground/10 active:bg-slate-200'
              } group`}
            >
              <button
                onClick={() => {
                  setPath(item.pathname);
                }}
                className="cursor-pointer w-full"
              >
                <p
                  className={`text-sm ${
                    isActive
                      ? 'text-primary'
                      : 'text-slate-600 hover:text-black group-hover:text-black'
                  }`}
                >
                  {item.title}
                </p>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export const navData = {
  navMain: [
    {
      title: 'Activity',
      pathname: 'Activity',
    },
    {
      title: 'Events',
      pathname: 'Events',
    },
    {
      title: 'Overview',
      pathname: 'Overview',
    },
    {
      title: 'Finance',
      pathname: 'Finance',
    },
  ],
};
