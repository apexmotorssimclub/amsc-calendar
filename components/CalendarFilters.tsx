
'use client';

import { useState } from 'react';

interface CalendarFiltersProps {
  series: string[];
  selectedSeries: string[];
  onSeriesChange: (series: string[]) => void;
}

export default function CalendarFilters({ 
  series, 
  selectedSeries, 
  onSeriesChange 
}: CalendarFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSeriesToggle = (seriesName: string) => {
    if (selectedSeries.includes(seriesName)) {
      onSeriesChange(selectedSeries.filter(s => s !== seriesName));
    } else {
      onSeriesChange([...selectedSeries, seriesName]);
    }
  };

  const clearFilters = () => {
    onSeriesChange([]);
  };

  const selectAll = () => {
    onSeriesChange(series);
  };

  const handleGameFilter = (game: 'AC' | 'ACC' | 'ALL') => {
    if (game === 'ALL') {
      onSeriesChange(series);
    } else {
      const filteredSeries =
        game === 'AC'
          ? series.filter(s => s.endsWith(' AC'))
          : series.filter(s => s.includes(game));
      onSeriesChange(filteredSeries);
    }
  };

  const getActiveGameFilter = () => {
    const accSeries = series.filter(s => s.includes('ACC'));
    const acSeries = series.filter(s => s.endsWith(' AC'));
    
    const selectedAcc = selectedSeries.filter(s => s.includes('ACC'));
    const selectedAc = selectedSeries.filter(s => s.endsWith(' AC'));
    
    if (selectedSeries.length === 0 || selectedSeries.length === series.length) {
      return 'ALL';
    }
    
    if (selectedAcc.length === accSeries.length && selectedAc.length === 0) {
      return 'ACC';
    }
    
    if (selectedAc.length === acSeries.length && selectedAcc.length === 0) {
      return 'AC';
    }
    
    return null;
  };

  const activeGameFilter = getActiveGameFilter();

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <i className="ri-filter-2-line w-5 h-5 flex items-center justify-center mr-2 text-purple-400"></i>
            Фильтры
          </h3>
          <button
            onClick={clearFilters}
            className="text-sm text-gray-400 hover:text-white cursor-pointer font-medium transition-colors duration-200"
          >
            Сбросить всё
          </button>
        </div>

        <div className="flex items-center space-x-6">
          {/* Быстрый фильтр по играм */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-300">Игра:</span>
            <div className="flex items-center space-x-1 bg-gray-800/60 rounded-lg p-1">
              <button
                onClick={() => handleGameFilter('ALL')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeGameFilter === 'ALL'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => handleGameFilter('AC')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeGameFilter === 'AC'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                AC
              </button>
              <button
                onClick={() => handleGameFilter('ACC')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeGameFilter === 'ACC'
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                ACC
              </button>
            </div>
          </div>

          {/* Фильтр по сериям */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-300">Серии:</span>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/60 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-all duration-200 whitespace-nowrap cursor-pointer border border-gray-700/60 hover:border-gray-600/70"
              >
                <span className="text-sm font-medium">
                  {selectedSeries.length === 0 ? 'Все серии' : 
                   selectedSeries.length === 1 ? selectedSeries[0].replace('AMSC ', '').replace(' 2025', '') :
                   `${selectedSeries.length} серий`}
                </span>
                <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line w-4 h-4 flex items-center justify-center transition-transform duration-200`}></i>
              </button>
              
              {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/60 z-50">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-white text-sm">Выберите серии</h4>
                      <div className="flex space-x-2">
                        <button
                          onClick={selectAll}
                          className="text-sm text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
                        >
                          Все
                        </button>
                        <button
                          onClick={clearFilters}
                          className="text-sm text-gray-400 hover:text-gray-300 cursor-pointer font-medium"
                        >
                          Очистить
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {series.map((seriesName) => (
                        <label key={seriesName} className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200">
                          <input
                            type="checkbox"
                            checked={selectedSeries.includes(seriesName)}
                            onChange={() => handleSeriesToggle(seriesName)}
                            className="w-4 h-4 text-blue-600 rounded border-gray-600 focus:ring-blue-500 focus:ring-2 bg-gray-700 transition-all duration-200"
                          />
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              seriesName.includes('ACC') 
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}>
                              {seriesName.includes('ACC') ? 'ACC' : 'AC'}
                            </span>
                            <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                              {seriesName.replace('AMSC ', '').replace(' 2025', '')}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Активные фильтры */}
        {selectedSeries.length > 0 && selectedSeries.length < series.length && (
          <div className="mt-4 pt-4 border-t border-gray-700/60">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-gray-400">Активные фильтры:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSeries.map((seriesName) => (
                <span
                  key={seriesName}
                  className="inline-flex items-center px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/30 backdrop-blur-sm"
                >
                  {seriesName.replace('AMSC ', '').replace(' 2025', '')}
                  <button
                    onClick={() => handleSeriesToggle(seriesName)}
                    className="ml-2 w-4 h-4 flex items-center justify-center hover:bg-blue-500/30 rounded-full cursor-pointer transition-all duration-200"
                  >
                    <i className="ri-close-line w-3 h-3 flex items-center justify-center"></i>
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
