import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_WORK_TIME = 25 * 60; // 25 minutos em segundos
const DEFAULT_SHORT_BREAK = 5 * 60; // 5 minutos em segundos
const DEFAULT_LONG_BREAK = 15 * 60; // 15 minutos em segundos
const DEFAULT_CYCLES_BEFORE_LONG_BREAK = 4;

export function Pomodoro() {
  const loadSavedSettings = () => {
    try {
      const savedSettings = localStorage.getItem('pomodoroSettings');
      if (savedSettings) {
        return JSON.parse(savedSettings);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações do Pomodoro:', error);
    }

    return {
      workTime: DEFAULT_WORK_TIME,
      shortBreakTime: DEFAULT_SHORT_BREAK,
      longBreakTime: DEFAULT_LONG_BREAK,
      totalCompletedCycles: 0
    };
  };

  const savedSettings = loadSavedSettings();

  const [timeLeft, setTimeLeft] = useState(savedSettings.workTime);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('work');
  const [cycles, setCycles] = useState(0);
  const [totalCompletedCycles, setTotalCompletedCycles] = useState(savedSettings.totalCompletedCycles);

  const [workTime, setWorkTime] = useState(savedSettings.workTime);
  const [shortBreakTime, setShortBreakTime] = useState(savedSettings.shortBreakTime);
  const [longBreakTime, setLongBreakTime] = useState(savedSettings.longBreakTime);
  const [showSettings, setShowSettings] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      playNotificationSound();
      showBrowserNotification();
      handleTimerComplete();
      clearInterval(interval);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Erro ao reproduzir áudio:', error);
      });
    }
  };

  const showBrowserNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const title = mode === 'work'
        ? 'Tempo de trabalho concluído!'
        : 'Tempo de pausa concluído!';

      const body = mode === 'work'
        ? 'Hora de fazer uma pausa!'
        : 'Hora de voltar ao trabalho!';

      new Notification(title, { body });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const handleTimerComplete = () => {
    if (mode === 'work') {
      const newCycles = cycles + 1;
      setCycles(newCycles);

      if (newCycles % DEFAULT_CYCLES_BEFORE_LONG_BREAK === 0) {
        setMode('longBreak');
        setTimeLeft(longBreakTime);
      } else {
        setMode('shortBreak');
        setTimeLeft(shortBreakTime);
      }
    } else {
      setMode('work');
      setTimeLeft(workTime);

      if (mode === 'longBreak') {
        setTotalCompletedCycles(prev => prev + 1);
      }
    }

    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);

    if (mode === 'work') {
      setTimeLeft(workTime);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreakTime);
    } else {
      setTimeLeft(longBreakTime);
    }
  };

  const changeMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);

    if (newMode === 'work') {
      setTimeLeft(workTime);
    } else if (newMode === 'shortBreak') {
      setTimeLeft(shortBreakTime);
    } else {
      setTimeLeft(longBreakTime);
    }
  };

  useEffect(() => {
    const settings = {
      workTime,
      shortBreakTime,
      longBreakTime,
      totalCompletedCycles
    };

    localStorage.setItem('pomodoroSettings', JSON.stringify(settings));
  }, [workTime, shortBreakTime, longBreakTime, totalCompletedCycles]);

  const saveSettings = (e) => {
    e.preventDefault();
    setShowSettings(false);

    if (mode === 'work') {
      setTimeLeft(workTime);
    } else if (mode === 'shortBreak') {
      setTimeLeft(shortBreakTime);
    } else {
      setTimeLeft(longBreakTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const minutesToSeconds = (minutes) => {
    return Math.max(1, Math.floor(parseFloat(minutes) * 60));
  };

  return (
    <div className="bg-background-dark-secondary backdrop-blur-sm rounded-lg p-5 border border-border-dark-subtle shadow-lg transition-all duration-300">
      {/* Áudio para notificação */}
      <audio ref={audioRef} preload="auto">
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3" type="audio/mpeg" />
        <source src="https://assets.mixkit.co/sfx/preview/mixkit-interface-hint-notification-911.mp3" type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {/* Cabeçalho do Pomodoro */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-text-primary-light flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
          Pomodoro
        </h2>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-text-primary-light/70 hover:text-accent-off-white transition-colors duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Configurações */}
      {showSettings && (
        <div className="mb-4 p-3 bg-background-dark-primary rounded-lg">
          <h3 className="text-text-primary-light text-sm font-medium mb-2">Configurações</h3>
          <form onSubmit={saveSettings} className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-text-primary-light/70 text-xs mb-1">Trabalho (min)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={workTime / 60}
                  onChange={(e) => setWorkTime(minutesToSeconds(e.target.value))}
                  className="w-full p-1 text-sm bg-border-dark-subtle border border-border-dark-subtle/50 rounded text-text-primary-light"
                />
              </div>
              <div>
                <label className="block text-text-primary-light/70 text-xs mb-1">Pausa curta (min)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={shortBreakTime / 60}
                  onChange={(e) => setShortBreakTime(minutesToSeconds(e.target.value))}
                  className="w-full p-1 text-sm bg-border-dark-subtle border border-border-dark-subtle/50 rounded text-text-primary-light"
                />
              </div>
              <div>
                <label className="block text-text-primary-light/70 text-xs mb-1">Pausa longa (min)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={longBreakTime / 60}
                  onChange={(e) => setLongBreakTime(minutesToSeconds(e.target.value))}
                  className="w-full p-1 text-sm bg-border-dark-subtle border border-border-dark-subtle/50 rounded text-text-primary-light"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-border-dark-subtle hover:bg-background-dark-primary text-accent-off-white text-xs py-1 px-3 rounded transition-colors duration-300"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Seletor de modo */}
      <div className="flex justify-center mb-4">
        <div className="bg-background-dark-primary rounded-lg p-1 flex">
          <button
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
              mode === 'work' ? 'bg-red-500 text-accent-off-white' : 'text-text-primary-light/70 hover:bg-border-dark-subtle'
            }`}
            onClick={() => changeMode('work')}
          >
            Trabalho
          </button>
          <button
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
              mode === 'shortBreak' ? 'bg-green-500 text-accent-off-white' : 'text-text-primary-light/70 hover:bg-border-dark-subtle'
            }`}
            onClick={() => changeMode('shortBreak')}
          >
            Pausa Curta
          </button>
          <button
            className={`px-3 py-1 rounded text-sm font-medium transition-all duration-300 ${
              mode === 'longBreak' ? 'bg-blue-500 text-accent-off-white' : 'text-text-primary-light/70 hover:bg-border-dark-subtle'
            }`}
            onClick={() => changeMode('longBreak')}
          >
            Pausa Longa
          </button>
        </div>
      </div>

      {/* Temporizador */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold mb-2 transition-colors duration-300 ${
          mode === 'work' ? 'text-red-400' :
          mode === 'shortBreak' ? 'text-green-400' : 'text-blue-400'
        }`}>
          {formatTime(timeLeft)}
        </div>

        {/* Controles do temporizador */}
        <div className="flex justify-center gap-3">
          <button
            onClick={toggleTimer}
            className="bg-border-dark-subtle hover:bg-background-dark-primary text-accent-off-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-1"
          >
            {isActive ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pausar
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Iniciar
              </>
            )}
          </button>
          <button
            onClick={resetTimer}
            className="bg-background-dark-primary hover:bg-border-dark-subtle text-accent-off-white py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reiniciar
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="flex justify-between text-text-primary-light/70 text-sm">
        <div>Ciclo atual: {cycles % DEFAULT_CYCLES_BEFORE_LONG_BREAK || DEFAULT_CYCLES_BEFORE_LONG_BREAK}/{DEFAULT_CYCLES_BEFORE_LONG_BREAK}</div>
        <div>Total: {totalCompletedCycles} ciclos</div>
      </div>
    </div>
  );
}
