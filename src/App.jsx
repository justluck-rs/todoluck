import './index.css'
import { Header } from './components/header/Header'
import { Input } from './components/input/Input'
import { useState, useEffect, useMemo } from 'react';
import { Button } from './components/button/Button';
import { TaskItem } from './components/taskItem/TaskItem';
import { Pomodoro } from './components/pomodoro/Pomodoro';

function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState(() => {
    // Recuperar tarefas do localStorage ao iniciar
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [showPomodoro, setShowPomodoro] = useState(false);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Adicionar nova tarefa
  const handleAddTask = () => {
    if (task.trim() === '') {
      setError('Por favor, digite uma tarefa válida');
      return;
    }

    const newTask = {
      id: Date.now(),
      text: task,
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, newTask]);
    setTask('');
    setError('');
  };

  // Marcar tarefa como concluída/não concluída
  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Remover tarefa
  const removeTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Limpar todas as tarefas concluídas
  const clearCompletedTasks = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  // Adicionar com o Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  // Filtrar tarefas com base no filtro selecionado
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'active':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Contadores
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const activeTasks = totalTasks - completedTasks;

  return (
    <div className="max-w-xl mx-auto  min-h-[calc(100vh-4rem)] mt-8 px-4">
      <Header />

      {/* Botão Pomodoro */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowPomodoro(!showPomodoro)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${showPomodoro
                      ? 'bg-red-500/80 text-white shadow-md'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          {showPomodoro ? 'Ocultar Pomodoro' : 'Mostrar Pomodoro'}
        </button>
      </div>

      {/* Componente Pomodoro */}
      {showPomodoro && (
        <div className="mt-4 mb-4">
          <Pomodoro />
        </div>
      )}

      {/* Contador de tarefas */}
      <div className="flex justify-between items-center mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="flex gap-2 items-center">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-500/20 text-white text-sm font-medium">
            {totalTasks}
          </div>
          <span className="text-white/80 text-sm">tarefas</span>
        </div>

        <div className="flex gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span className="text-white/80 text-xs">{activeTasks} ativas</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-white/80 text-xs">{completedTasks} concluídas</span>
          </div>
        </div>
      </div>

      {/* Input e botão */}
      <div className="w-full mt-6 flex justify-between items-center gap-4">
        <Input
          type={"text"}
          placeholder={"Adicionar Tarefa"}
          value={task}
          onChange={(e) => { setTask(e.target.value) }}
          onKeyPress={handleKeyDown}
        />
        <Button
          onClick={handleAddTask}
        >Adicionar</Button>
      </div>

      {error && <p className="text-pink-300 text-sm mt-2">{error}</p>}

      {/* Filtros */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${filter === 'all'
                      ? 'bg-white/20 text-white shadow-md'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'}`}
          onClick={() => setFilter('all')}
        >
          Todas
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${filter === 'active'
                      ? 'bg-white/20 text-white shadow-md'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'}`}
          onClick={() => setFilter('active')}
        >
          Ativas
        </button>
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                    ${filter === 'completed'
                      ? 'bg-white/20 text-white shadow-md'
                      : 'bg-white/10 text-white/70 hover:bg-white/15'}`}
          onClick={() => setFilter('completed')}
        >
          Concluídas
        </button>
      </div>

      {/* Lista de tarefas */}
      <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-4 min-h-[200px] shadow-inner overflow-y-auto max-h-[50vh] border border-white/10">
        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/30 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-white/50 italic">
              {filter === 'all'
                ? 'Nenhuma tarefa adicionada ainda'
                : filter === 'active'
                  ? 'Nenhuma tarefa ativa'
                  : 'Nenhuma tarefa concluída'}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTaskCompletion}
                onRemove={removeTask}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Rodapé com ações */}
      {tasks.length > 0 && (
        <div className="mt-4 flex justify-between items-center text-white/70 text-sm">
          <p>{activeTasks} {activeTasks === 1 ? 'tarefa pendente' : 'tarefas pendentes'}</p>
          {completedTasks > 0 && (
            <button
              className="text-pink-300 hover:text-pink-400 transition-colors duration-300"
              onClick={clearCompletedTasks}
            >
              Limpar concluídas
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default App
