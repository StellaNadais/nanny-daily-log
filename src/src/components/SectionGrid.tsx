import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function SectionGrid({ title, children, className = '' }: Props) {
  return (
    <div className={`border-2 border-black bg-white ${className}`}>
      <div className="bg-gray-100 border-b-2 border-black px-4 py-3">
        <h2 className="text-sm font-bold text-black uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
