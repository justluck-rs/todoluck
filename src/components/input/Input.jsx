import React from "react";
export function Input({ ...props }) {
  return (
    <div className="w-full relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
        </svg>
      </div>
      <input
        className="w-full p-3 pl-10 border border-white/10 rounded-lg bg-white/20 backdrop-blur-sm text-white placeholder-white/60
                  shadow-inner focus:outline-none focus:ring-2 focus:ring-pink-400/50 transition-all duration-300
                  hover:bg-white/25"
        type={props.type}
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
        onKeyDown={props.onKeyPress}
      />
    </div>
  );
}
