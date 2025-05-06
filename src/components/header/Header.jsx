import React from 'react'

export function Header(){
  return(
    <header className="bg-white/20 backdrop-blur-sm text-white p-6 rounded-lg shadow-lg transition-all duration-300 hover:bg-white/25 border border-white/10">
      <div className="flex items-center justify-center gap-3 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">TodoLuck</h1>
      </div>
      <p className="text-white/80 text-center text-sm mt-1 font-light">Organize seu dia de forma simples e elegante</p>
    </header>
  )
}