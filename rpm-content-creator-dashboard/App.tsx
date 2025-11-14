
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, CalculationResult, ChartData, TaskProjection } from './types';
import TaskCard from './components/TaskCard';
import ResultsModal from './components/ResultsModal';
import { TikTokIcon, ReelsIcon, FacebookIcon, ZaloIcon, RpmIcon, LivestreamIcon } from './components/icons';

const INITIAL_TIME = 20 * 60; // 20 minutes in seconds

const App: React.FC = () => {
  const initialTasks = useMemo((): Task[] => [
    { id: 'tiktok', title: 'TikTok Videos', subtitle: 'Làm app', timeRemaining: INITIAL_TIME, isActive: false, color: '#00f2ea', icon: TikTokIcon },
    { id: 'reels', title: 'Instagram Reels', subtitle: 'Làm app', timeRemaining: INITIAL_TIME, isActive: false, color: '#c13584', icon: ReelsIcon },
    { id: 'facebook', title: 'Facebook Posts', subtitle: 'Làm app', timeRemaining: INITIAL_TIME, isActive: false, color: '#1877f2', icon: FacebookIcon },
    { id: 'zalo', title: 'Zalo Messages', subtitle: 'Làm app', timeRemaining: INITIAL_TIME, isActive: false, color: '#0068ff', icon: ZaloIcon },
    { id: 'rpm', title: 'Làm app RPM', subtitle: 'Làm app', timeRemaining: INITIAL_TIME, isActive: false, color: '#f97316', icon: RpmIcon },
    { id: 'livestream', title: 'Chép Livestream', subtitle: 'Làm app', timeRemaining: INITIAL_TIME, isActive: false, color: '#ef4444', icon: LivestreamIcon },
  ], []);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [years, setYears] = useState<number>(11);
  const [dailyRate, setDailyRate] = useState<number>(0.5);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.isActive && task.timeRemaining > 0
            ? { ...task, timeRemaining: task.timeRemaining - 1 }
            : task.isActive && task.timeRemaining === 0
            ? { ...task, isActive: false } // Auto-stop timer when it reaches zero
            : task
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleToggleTimer = useCallback((id: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, isActive: !task.isActive } : task
      )
    );
  }, []);

  const calculateFutureValue = (P: number, r: number, t: number): number => {
    if (r === 0) {
      return P * t;
    }
    // Future value of an ordinary annuity formula
    return P * ((Math.pow(1 + r, t) - 1) / r);
  };

  const handleComplete = () => {
    // Stop all timers
    setTasks(prevTasks => prevTasks.map(task => ({ ...task, isActive: false })));

    const r = dailyRate / 100; // daily interest rate
    const t = years * 365; // total days
    let totalMinutes = 0;

    const projections: TaskProjection[] = tasks.map(task => {
        const minutesWorked = (INITIAL_TIME - task.timeRemaining) / 60;
        totalMinutes += minutesWorked;

        let dailyPrincipal: number;

        if (minutesWorked > 0) {
            // Gain: (minutes worked / 20) * 1M per session * 3 sessions a day
            dailyPrincipal = (minutesWorked / 20) * 1_000_000 * 3;
        } else {
            // Loss: 1M loss per session * 3 sessions a day
            dailyPrincipal = -3_000_000;
        }
        
        const futureValue = calculateFutureValue(dailyPrincipal, r, t);

        return {
            title: task.title,
            minutes: minutesWorked,
            dailyPrincipal,
            futureValue,
        };
    });

    const netFutureValue = projections.reduce((acc, p) => acc + p.futureValue, 0);
    const netDailyPrincipal = projections.reduce((acc, p) => acc + p.dailyPrincipal, 0);
    
    const chartData: ChartData[] = projections.map(p => ({
        name: p.title,
        minutes: p.minutes,
    }));

    setResults({ 
        totalMinutes, 
        dailyPrincipal: netDailyPrincipal, 
        futureValue: netFutureValue, 
        isLoss: netFutureValue < 0, 
        chartData,
        projections
    });
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-10" style={{backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')"}}></div>
      <div className="container mx-auto relative z-10">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            RPM Content Creator Dashboard
          </h1>
          <p className="text-lg text-gray-400 mt-2 max-w-2xl mx-auto">
            Tối ưu hóa năng suất, kiến tạo dòng tiền thụ động.
          </p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTimer} />
            ))}
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Dự phóng & Hoàn thành</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div>
                <label htmlFor="years" className="block text-sm font-medium text-gray-300 mb-2">Số năm dự phóng</label>
                <input
                  type="number"
                  id="years"
                  value={years}
                  onChange={e => setYears(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>
              <div>
                <label htmlFor="rate" className="block text-sm font-medium text-gray-300 mb-2">Lãi suất hàng ngày (%)</label>
                <input
                  type="number"
                  id="rate"
                  step="0.1"
                  value={dailyRate}
                  onChange={e => setDailyRate(parseFloat(e.target.value) || 0)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
                />
              </div>
              <button
                onClick={handleComplete}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-3 px-4 rounded-lg text-lg shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:scale-105"
              >
                Hoàn thành & Tính toán
              </button>
            </div>
          </div>
        </main>

        <footer className="text-center mt-10 text-gray-500 text-sm">
          <p>Sức mạnh của kỷ luật và lãi kép trong tầm tay bạn.</p>
        </footer>
      </div>
      <ResultsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        results={results}
        years={years}
        rate={dailyRate}
      />
    </div>
  );
};

export default App;
