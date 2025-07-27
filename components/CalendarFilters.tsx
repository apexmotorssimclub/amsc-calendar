
'use client';

import { useState } from 'react';
import { getChampionshipBySeries } from '../app/data/championships';
import ChampionshipModal from './ChampionshipModal';
import { races } from '../app/data/races';

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
  const [modalChampionship, setModalChampionship] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleChampionshipInfo = (seriesName: string) => {
    const championship = getChampionshipBySeries(seriesName);
    if (championship) {
      setModalChampionship(championship);
      setIsModalOpen(true);
    }
  };

  const downloadCalendar = () => {
    // Генерация ICS-файла
    const pad = (num: number) => num.toString().padStart(2, '0');
    const events = races.map(race => {
      // Формат даты: 20250522T180000Z
      const [day, month, year] = race.date.split('.');
      const [hour, minute] = race.time.split(':');
      // Начало события в UTC (МСК -3)
      const start = new Date(Date.UTC(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour) - 3,
        parseInt(minute)
      ));
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 часа
      const dtStart = `${start.getUTCFullYear()}${pad(start.getUTCMonth() + 1)}${pad(start.getUTCDate())}T${pad(start.getUTCHours())}${pad(start.getUTCMinutes())}00Z`;
      const dtEnd = `${end.getUTCFullYear()}${pad(end.getUTCMonth() + 1)}${pad(end.getUTCDate())}T${pad(end.getUTCHours())}${pad(end.getUTCMinutes())}00Z`;
      return `BEGIN:VEVENT\nSUMMARY:${race.series} - ${race.stage}\nDTSTART:${dtStart}\nDTEND:${dtEnd}\nDESCRIPTION:Гонка AMSC на трассе ${race.stage}. Время: ${race.time} (МСК)\nLOCATION:${race.stage}\nEND:VEVENT`;
    });
    const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nPRODID:-//AMSC Calendar//RU\n${events.join('\n')}\nEND:VCALENDAR`;
    // Скачивание файла
    const blob = new Blob([ics.replace(/\\n/g, '\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'amsc-calendar.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  return (
    <div className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/60">
      <div className="max-w-7xl mx-auto px-4 py-6 md:px-8 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 md:gap-0">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:space-x-8">
            {/* Быстрый фильтр по играм */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-300">Игра:</span>
              <div className="flex items-center space-x-2 bg-gray-800/60 rounded-lg p-2">
                <button
                  onClick={() => handleGameFilter('ALL')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    activeGameFilter === 'ALL'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  Все
                </button>
                <button
                  onClick={() => handleGameFilter('AC')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    activeGameFilter === 'AC'
                      ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }`}
                >
                  AC
                </button>
                <button
                  onClick={() => handleGameFilter('ACC')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-pointer ${
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
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-300">Серии:</span>
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-3 px-5 py-2.5 bg-gray-800/60 text-gray-300 rounded-lg hover:bg-gray-700/70 transition-all duration-200 whitespace-nowrap cursor-pointer border border-gray-700/60 hover:border-gray-600/70"
                >
                  <span className="text-sm font-medium">
                    {selectedSeries.length === 0 ? 'Все серии' : 
                     selectedSeries.length === 1 ? selectedSeries[0].replace('AMSC - ', '').replace(' 2025', '').replace(' ACC', '').replace(' AC', '').trim() :
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
                              <span className={`px-2 py-1 rounded-md border text-xs font-medium ${
                                seriesName.includes('ACC') 
                                  ? 'bg-blue-600/80 text-blue-100 border-blue-500/50'
                                  : 'bg-red-600/80 text-red-100 border-red-500/50'
                              }`}>
                                {seriesName.includes('ACC') ? 'ACC' : 'AC'}
                              </span>
                              <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
                                {seriesName.replace('AMSC - ', '').replace(' 2025', '').replace(' ACC', '').replace(' AC', '').trim()}
                              </span>
                              <button
                                onClick={() => handleChampionshipInfo(seriesName)}
                                className="ml-2 text-gray-400 hover:text-gray-300 cursor-pointer font-medium"
                              >
                                <i className="ri-information-line w-4 h-4"></i>
                              </button>
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
          {/* Кнопка скачать календарь (адаптивно, всегда под фильтрами на мобилке) */}
          <div className="flex items-center mt-4 md:mt-0 md:justify-end">
            <button
              onClick={downloadCalendar}
              className="px-4 py-2 rounded-md bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium shadow-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm flex items-center gap-2"
            >
              <i className="ri-download-2-line w-4 h-4"></i>
              Скачать весь календарь
            </button>
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
                  className="inline-flex items-center px-3 py-1.5 bg-blue-600/80 text-blue-100 rounded-md text-sm border border-blue-500/50 backdrop-blur-sm"
                >
                  {seriesName.replace('AMSC - ', '').replace(' 2025', '').replace(' ACC', '').replace(' AC', '').trim()}
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
      <ChampionshipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        championship={modalChampionship}
      />
    </div>
  );
}
