import React from "react";
export function Button({ ...props }) {
  return (
    <button
      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700
                text-accent-off-white font-medium py-3 px-6 rounded-lg shadow-md transform transition-all duration-300
                hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400
                border border-border-dark-subtle flex items-center gap-2"
      onClick={props.onClick}
    >
      <span className="relative">
        {props.children}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
      </svg>
    </button>
  );
}