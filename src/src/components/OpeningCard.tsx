import { FileText, MapPin, PlusCircle } from 'lucide-react';
import type { AppScreen } from '../types';

type Props = {
  onNavigate: (screen: AppScreen) => void;
};

export function OpeningCard({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">
      <header className="border-b-2 border-black bg-white px-6 py-6">
        <h1 className="text-2xl font-bold text-black uppercase tracking-wide text-center">
          Nanny Log
        </h1>
        <p className="text-center text-sm text-gray-600 mt-2 uppercase tracking-wide">
          Paper ledger style
        </p>
      </header>

      <main className="flex-1 p-6 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full space-y-4">
          <button
            onClick={() => onNavigate('log')}
            className="w-full border-2 border-black bg-white hover:bg-gray-50 active:bg-gray-100 px-6 py-5 flex items-center gap-4 text-left"
          >
            <div className="border-2 border-black p-3">
              <PlusCircle className="w-8 h-8 text-black" />
            </div>
            <div>
              <span className="block text-sm font-bold uppercase tracking-wide text-black">
                Log Activity
              </span>
              <span className="block text-xs text-gray-600 mt-0.5">
                Record a trip or activity
              </span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('locations')}
            className="w-full border-2 border-black bg-white hover:bg-gray-50 active:bg-gray-100 px-6 py-5 flex items-center gap-4 text-left"
          >
            <div className="border-2 border-black p-3">
              <MapPin className="w-8 h-8 text-black" />
            </div>
            <div>
              <span className="block text-sm font-bold uppercase tracking-wide text-black">
                Manage Locations
              </span>
              <span className="block text-xs text-gray-600 mt-0.5">
                Add or edit saved locations
              </span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('report')}
            className="w-full border-2 border-black bg-white hover:bg-gray-50 active:bg-gray-100 px-6 py-5 flex items-center gap-4 text-left"
          >
            <div className="border-2 border-black p-3">
              <FileText className="w-8 h-8 text-black" />
            </div>
            <div>
              <span className="block text-sm font-bold uppercase tracking-wide text-black">
                Weekly Report
              </span>
              <span className="block text-xs text-gray-600 mt-0.5">
                View miles and summary
              </span>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
