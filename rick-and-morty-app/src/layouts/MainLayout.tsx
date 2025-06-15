// src/layouts/MainLayout.tsx
import { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <header className="bg-gray-200 p-4 text-center mb-2">
        <h1 className="text-4xl font-bold text-indigo-900">The Rick and Morty Universe</h1>
      </header>
      <main className="p-2">{children}</main>
    </div>
  );
};

export default MainLayout;