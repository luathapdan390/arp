
import React from 'react';
import type { Task } from '../types';
import { PlayIcon, PauseIcon } from './icons';

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle }) => {
  const { id, title, subtitle, timeRemaining, isActive, color, icon: Icon } = task;
  const initialTime = 20 * 60;
  const progressPercentage = ((initialTime - timeRemaining) / initialTime) * 100;
  
  const progressStyle = {
    background: `conic-gradient(${color} ${progressPercentage * 3.6}deg, rgba(255, 255, 255, 0.1) 0deg)`
  };

  return (
    <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-xl hover:border-gray-600 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}33` }}>
                <Icon className="w-6 h-6" style={{ color: color }} />
            </div>
          <div>
            <h3 className="font-bold text-white text-lg">{title}</h3>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className="relative flex items-center justify-center my-auto">
        <div className="absolute w-48 h-48 rounded-full" style={progressStyle}></div>
        <div className="relative w-40 h-40 bg-gray-900 rounded-full flex items-center justify-center">
          <span className="text-4xl font-bold text-white tracking-wider">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
      
      <button
        onClick={() => onToggle(id)}
        className={`w-full mt-6 py-3 rounded-lg flex items-center justify-center font-semibold text-white transition-colors duration-300 ${
          isActive
            ? 'bg-yellow-500 hover:bg-yellow-600'
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isActive ? <PauseIcon className="w-5 h-5 mr-2" /> : <PlayIcon className="w-5 h-5 mr-2" />}
        <span>{isActive ? 'Tạm dừng' : 'Bắt đầu'}</span>
      </button>
    </div>
  );
};

export default TaskCard;
