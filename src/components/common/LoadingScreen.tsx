import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-[50vh] w-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <svg className="animate-spin h-8 w-8 text-agri-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
        </svg>
        <div>
          <p className="text-sm text-muted-foreground">Loading content…</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
