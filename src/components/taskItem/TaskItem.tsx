import React, { useState, useEffect } from "react";

interface TaskProps {
  task: {
    id: number;
    text: string;
    completed: boolean;
    createdAt: string;
  };
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
}

export function TaskItem({ task, onToggle, onRemove }: TaskProps) {
  const [animate, setAnimate] = useState(false);

  // Efeito para animação quando a tarefa for concluída
  useEffect(() => {
    if (task.completed) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [task.completed]);

  // Formatar a data de criação
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // Calcular tempo relativo (ex: "há 2 horas")
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const taskDate = new Date(dateString);
    const diffInMs = now.getTime() - taskDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInMinutes < 1) return 'agora mesmo';
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours}h`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'ontem';
    if (diffInDays < 30) return `há ${diffInDays} dias`;

    return formatDate(dateString);
  };

  return (
    <li
      className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 shadow-md transition-all duration-300
                border border-white/10 hover:border-white/20
                ${task.completed ? 'border-l-4 border-green-400' : 'border-l-4 border-yellow-400'}
                ${animate ? 'completed-task-animation' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="cursor-pointer"
          />
          <div className="flex-1">
            <p className={`text-white font-medium transition-all duration-300
                         ${task.completed ? 'line-through text-white/60' : ''}`}>
              {task.text}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white/50" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <p className="text-white/50 text-xs">
                {getRelativeTime(task.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => onRemove(task.id)}
          className="text-white/70 hover:text-pink-400 transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
          title="Remover tarefa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}
