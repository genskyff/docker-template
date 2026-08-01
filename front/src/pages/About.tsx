import type { FC } from 'react';

const stack = [
  ['Rsbuild', 'Build tool'],
  ['React Router', 'Routing'],
  ['TanStack Query', 'Server state'],
  ['Tailwind CSS + daisyUI', 'Styling'],
  ['Lucide', 'Icons'],
  ['Lodash', 'Utilities'],
];

const About: FC = () => (
  <div className="card bg-base-100 shadow-sm">
    <div className="card-body">
      <h2 className="card-title">About</h2>
      <p className="text-sm opacity-70">
        A starting point for new projects. Delete <code>src/pages</code> and <code>src/api</code> to
        begin.
      </p>
      <ul className="mt-2 space-y-1 text-sm">
        {stack.map(([name, role]) => (
          <li key={name} className="flex justify-between">
            <span>{name}</span>
            <span className="opacity-50">{role}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default About;
