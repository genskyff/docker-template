import { Info, ListTodo } from 'lucide-react';
import type { FC } from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router';

import reactLogo from '@/assets/react.svg';
import About from '@/pages/About';
import Todos from '@/pages/Todos';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'btn btn-ghost btn-sm btn-active' : 'btn btn-ghost btn-sm';

const App: FC = () => (
  <BrowserRouter>
    <div className="bg-base-200 min-h-screen">
      <header className="navbar bg-base-100 shadow-sm">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2">
          <img src={reactLogo} alt="" className="size-6" />
          <span className="flex-1 font-semibold">Docker Template</span>
          <NavLink to="/" className={navLinkClass}>
            <ListTodo size={16} />
            Todos
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            <Info size={16} />
            About
          </NavLink>
        </div>
      </header>

      <main className="mx-auto max-w-2xl p-4">
        <Routes>
          <Route path="/" element={<Todos />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  </BrowserRouter>
);

export default App;
