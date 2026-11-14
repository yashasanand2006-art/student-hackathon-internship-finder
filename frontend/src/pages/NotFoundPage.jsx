import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="card-base rounded-2xl p-10 max-w-md text-center space-y-4 shadow-elevated">
        <div className="w-14 h-14 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-bold text-white">404</h1>
        <h2 className="text-sm font-semibold text-slate-200">Opportunity Not Found</h2>
        <p className="text-xs text-slate-400">
          The page or listing you were looking for doesn't exist or has moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
