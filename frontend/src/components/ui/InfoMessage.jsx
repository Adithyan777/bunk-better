import React from 'react';
import { Info } from 'lucide-react';

const InfoMessage = ({ message ,submessage}) => {

  return (
    <div className="flex items-center gap-4 rounded-lg bg-gray-100 p-4 dark:bg-gray-800 m-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700">
        <Info className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
          {message}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{submessage}</p>
      </div>
    </div>
  );
};

export default InfoMessage;
