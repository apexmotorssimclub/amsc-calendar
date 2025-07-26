
'use client';

import { useState } from 'react';
import { Race } from '../app/data/races';
import RaceCard from './RaceCard';

interface CalendarViewProps {
  races: Race[];
}

export default function CalendarView({ races }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [collapsedMonths, setCollapsedMonths] = useState<{ [key: string]: boolean }>({});

  const sortedRaces = [...races].sort((a, b) => {
    const dateA = new Date(a.date.split('.').reverse().join('-'));
    const dateB = new Date(b.date.split('.').reverse().join('-'));
    return dateA.getTime() - dateB.getTime();
  });

  const groupRacesByMonth = (races: Race[]) => {
    const groups: { [key: string]: Race[] } = {};
    races.forEach(race => {
      const [day, month, year] = race.date.split('.');
      const monthKey = `${year}-${month}`;
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(race);
    });
    return groups;
  };

  const isRacePassed = (race: Race) => {
    try {
      const [day, month, year] = race.date.split('.');
      const [hour, minute] = race.time.split(':');
      const raceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
      return raceDate < new Date();
    } catch {
      return false;
    }
  };

  const monthGroups = groupRacesByMonth(sortedRaces);
  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  const getMonthName = (monthKey: string) => {
    const [year, month] = monthKey.split('-');
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const addToGoogleCalendar = (race: Race) => {
    if (isRacePassed(race)) return;

    try {
      const formatDateForGoogle = (dateStr: string, timeStr: string) => {
        const [day, month, year] = dateStr.split('.');
        const [hour, minute] = timeStr.split(':');

        if (!day || !month || !year || !hour || !minute) {
          throw new Error('Неверный формат даты или времени');
        }

        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));

        if (isNaN(date.getTime())) {
          throw new Error('Некорректная дата');
        }

        const utcDate = new Date(date.getTime() - (3 * 60 * 60 * 1000));

        const year_str = utcDate.getFullYear().toString();
        const month_str = (utcDate.getMonth() + 1).toString().padStart(2, '0');
        const day_str = utcDate.getDate().toString().padStart(2, '0');
        const hour_str = utcDate.getHours().toString().padStart(2, '0');
        const minute_str = utcDate.getMinutes().toString().padStart(2, '0');
        const second_str = utcDate.getSeconds().toString().padStart(2, '0');

        return `${year_str}${month_str}${day_str}T${hour_str}${minute_str}${second_str}Z`;
      };

      const startTime = formatDateForGoogle(race.date, race.time);

      const startDate = new Date(race.date.split('.').reverse().join('-') + 'T' + race.time + ':00');
      const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000));
      const endTime = formatDateForGoogle(
        endDate.toLocaleDateString('ru-RU').split('.').reverse().join('.').split('.').reverse().join('.'),
        endDate.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
      );

      const title = encodeURIComponent(`${race.series} - ${race.stage}`);
      const description = encodeURIComponent(`Гонка AMSC на трассе ${race.stage}. Время: ${race.time} (МСК)`);

      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${description}&location=${encodeURIComponent(race.stage)}`;

      window.open(googleCalendarUrl, '_blank');
    } catch (error) {
      console.error('Ошибка добавления в календарь:', error);
      alert('Не удалось добавить гонку в календарь. Попробуйте еще раз.');
    }
  };

  const getGamePlatform = (series: string) => {
    if (series.includes('ACC')) return 'ACC';
    if (series.includes('AC')) return 'AC';
    return 'AC';
  };

  const getGameColor = (series: string) => {
    if (series.includes('ACC')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (series.includes('AC')) return 'bg-red-500/20 text-red-300 border-red-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getSeriesColor = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (series.includes('GT3')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (series.includes('Дивизион А')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (series.includes('Дивизион Б')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  const getSeriesShortName = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'TIME ATTACK';
    if (series.includes('GT3')) return 'GT3';
    if (series.includes('Дивизион А')) return 'Туринг А';
    if (series.includes('Дивизион Б')) return 'Туринг Б';
    return series;
  };

  // Проверка: все ли гонки месяца завершены
  const isMonthPassed = (monthRaces: Race[]) => monthRaces.every(isRacePassed);

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 md:mb-8">
        <h2 className="text-2xl font-bold text-white">
          Расписание гонок
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 border border-gray-700/60'
            }`}
          >
            <i className="ri-grid-line w-5 h-5 flex items-center justify-center"></i>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-3 rounded-lg transition-all duration-200 cursor-pointer ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/70 border border-gray-700/60'
            }`}
          >
            <i className="ri-list-check-2 w-5 h-5 flex items-center justify-center"></i>
          </button>
        </div>
      </div>

      {Object.entries(monthGroups).map(([monthKey, monthRaces]) => {
        const monthPassed = isMonthPassed(monthRaces);
        const isCollapsed = collapsedMonths[monthKey] ?? monthPassed;
        return (
          <div key={monthKey} className="mb-6 bg-gray-900/70 rounded-xl border border-gray-700/40 overflow-hidden">
            <div
              className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-2 md:mb-4 px-2 pt-2 md:px-4 md:pt-4 cursor-pointer select-none"
              onClick={() =>
                monthPassed && setCollapsedMonths((prev) => ({ ...prev, [monthKey]: !isCollapsed }))
              }
            >
              <h3 className="text-xl font-semibold text-white flex items-center">
                <div className="w-6 h-6 flex items-center justify-center mr-3">
                  <i className="ri-calendar-2-line w-6 h-6 flex items-center justify-center text-purple-400"></i>
                </div>
                {getMonthName(monthKey)}
                {monthPassed && (
                  <i className={`ml-2 ri-arrow-${isCollapsed ? 'down' : 'up'}-s-line text-gray-400 text-lg`}></i>
                )}
              </h3>
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800/60 rounded-full border border-gray-700/60">
                <i className="ri-flag-line w-4 h-4 flex items-center justify-center text-gray-400"></i>
                <span className="text-sm text-gray-300">
                  {monthRaces.length} {monthRaces.length === 1 ? 'гонка' : 'гонки'}
                </span>
              </div>
            </div>

            {!isCollapsed && (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 px-2 pb-2 md:px-4 md:pb-4 items-stretch">
                  {monthRaces.map((race) => (
                    <div key={race.id} className="min-w-0 flex flex-col">
                      <RaceCard race={race} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 md:space-y-3 px-2 pb-2 md:px-4 md:pb-4">
                  {monthRaces.map((race) => {
                    const isPassed = isRacePassed(race);
                    return (
                      <div key={race.id} className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.01] ${
                        isPassed
                          ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm'
                          : 'bg-gray-800/80 border-gray-700/60 backdrop-blur-sm hover:bg-gray-800/90 hover:border-gray-600/70'
                      }`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        <div className="relative p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center ${
                                isPassed ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                              }`}>
                                <i className={`ri-flag-line w-8 h-8 flex items-center justify-center ${
                                  isPassed ? 'text-gray-400' : 'text-blue-300'
                                }`}></i>
                              </div>
                              <div>
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className={`font-semibold text-lg ${
                                    isPassed ? 'text-gray-300' : 'text-white'
                                  }`}>{race.stage}</h4>
                                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${
                                    isPassed
                                      ? 'bg-gray-700/50 text-gray-400 border-gray-600/50'
                                      : getSeriesColor(race.series)
                                  }`}>
                                    <span className="text-sm font-medium">{getSeriesShortName(race.series)}</span>
                                  </div>
                                  <div className={`px-2 py-1 rounded-full border ${
                                    isPassed
                                      ? 'bg-gray-700/50 text-gray-400 border-gray-600/50'
                                      : getGameColor(race.series)
                                  }`}>
                                    <span className="text-xs font-bold">{getGamePlatform(race.series)}</span>
                                  </div>
                                  {isPassed && (
                                    <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                                      <i className="ri-checkbox-circle-fill w-3 h-3 flex items-center justify-center"></i>
                                      <span className="text-xs font-medium">Завершено</span>
                                    </div>
                                  )}
                                </div>
                                <div className={`flex items-center space-x-6 text-sm ${
                                  isPassed ? 'text-gray-400' : 'text-gray-300'
                                }`}>
                                  <div className="flex items-center space-x-2">
                                    <i className="ri-calendar-2-line w-4 h-4 flex items-center justify-center"></i>
                                    <span>{race.date} ({race.dayOfWeek})</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                                    <span>{race.time}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {!isPassed && (
                              <button
                                onClick={() => addToGoogleCalendar(race)}
                                type="button"
                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl w-full md:w-auto mt-auto"
                              >
                                <i className="ri-google-line w-4 h-4 flex items-center justify-center"></i>
                                <span className="text-sm font-medium">В календарь</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </div>
        );
      })}

      {sortedRaces.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-800/60 rounded-full flex items-center justify-center">
            <i className="ri-calendar-line w-10 h-10 flex items-center justify-center text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Нет гонок для отображения</h3>
          <p className="text-gray-400">Попробуйте изменить фильтры или проверьте расписание позже</p>
        </div>
      )}
    </div>
  );
}
