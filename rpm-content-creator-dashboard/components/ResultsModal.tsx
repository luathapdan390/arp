import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { CalculationResult } from '../types';
import { XIcon } from './icons';

interface ResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: CalculationResult | null;
  years: number;
  rate: number;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ResultsModal: React.FC<ResultsModalProps> = ({ isOpen, onClose, results, years, rate }) => {
  if (!isOpen || !results) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <XIcon className="w-8 h-8" />
        </button>
        <h2 className="text-3xl font-bold text-white mb-2">Kết quả & Dự phóng</h2>
        <p className="text-gray-400 mb-8">Dưới đây là phân tích phiên làm việc và dự báo tài chính của bạn.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/50 p-6 rounded-lg">
                <h3 className="font-semibold text-white text-xl mb-4">Phân bổ thời gian</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={results.chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12}/>
                            <YAxis stroke="#9ca3af" fontSize={12} unit=" phút"/>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    borderColor: '#4b5563',
                                    color: '#ffffff'
                                }}
                                cursor={{fill: 'rgba(255,255,255,0.1)'}}
                                formatter={(value: number) => value.toFixed(2)}
                            />
                            <Legend />
                            <Bar dataKey="minutes" name="Số phút làm việc" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg flex flex-col">
                <h3 className="font-semibold text-white text-xl mb-4">Dự phóng Tương lai</h3>
                 <div className={`text-center p-4 rounded-lg mb-6 ${results.isLoss ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
                    <p className="text-sm text-gray-300">Tổng thu nhập/tổn thất ròng sau {years} năm</p>
                    <p className={`text-4xl font-bold ${results.isLoss ? 'text-red-400' : 'text-green-400'}`}>
                        {formatCurrency(results.futureValue)}
                    </p>
                </div>

                <div className="space-y-4 text-gray-300 mb-6">
                    {results.projections.map((proj, index) => (
                        <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                            <div>
                                <span className="font-semibold text-white">{proj.title}</span>
                                <span className="text-xs text-gray-400 block">{proj.minutes.toFixed(2)} phút làm việc</span>
                            </div>
                            <div className="text-right">
                                <span className={`font-semibold ${proj.futureValue < 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {formatCurrency(proj.futureValue)}
                                </span>
                                <span className={`text-xs block ${proj.dailyPrincipal < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                    {formatCurrency(proj.dailyPrincipal)} / ngày
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                
                 <div className="mt-auto space-y-3 text-gray-300 border-t border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                        <span>Trạng thái ròng:</span>
                        <span className={`font-semibold ${results.isLoss ? 'text-red-400' : 'text-green-400'}`}>
                            {results.isLoss ? 'Tổn thất' : 'Tăng trưởng'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Tổng thời gian làm việc:</span>
                        <span className="font-semibold text-white">{results.totalMinutes} phút</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Thu nhập/chi phí ròng hôm nay:</span>
                        <span className="font-semibold text-white">{formatCurrency(results.dailyPrincipal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Lãi suất kép hàng ngày:</span>
                        <span className="font-semibold text-white">{rate}%</span>
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultsModal;