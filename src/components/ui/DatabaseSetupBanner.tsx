import { useState } from 'react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const DatabaseSetupBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-yellow-700">
            <strong>Database Setup Required:</strong> The application is currently using demo data. 
            To enable full functionality, please:
          </p>
          <ol className="mt-2 text-sm text-yellow-700 list-decimal list-inside space-y-1">
            <li>Click "Connect to Supabase" in the top right corner</li>
            <li>Create a new Supabase project or connect to an existing one</li>
            <li>The database tables will be automatically created</li>
          </ol>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="inline-flex rounded-md bg-yellow-50 p-1.5 text-yellow-400 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};