// src/layouts/MainLayout.tsx
import { ReactNode } from 'react';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-semibold text-center">Rick And Morty Application</h1>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
};

export default MainLayout;
