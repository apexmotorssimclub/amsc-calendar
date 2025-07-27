
'use client';

import { useState, useEffect } from 'react';
import { Race } from '../app/data/races';
import RaceCard from './RaceCard';

interface CalendarViewProps {
  races: Race[];
}

export default function CalendarView({ races }: CalendarViewProps) {
  const [collapsedMonths, setCollapsedMonths] = useState<Set<string>>(new Set());

  // Автоматически сворачиваем прошедшие месяцы и раскрываем текущий
  useEffect(() => {
    const today = new Date();
    const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    
    const newCollapsedMonths = new Set<string>();
    
    Object.entries(monthGroups).forEach(([monthKey, monthRaces]) => {
      const monthPassed = isMonthPassed(monthRaces);
      
      // Сворачиваем только прошедшие месяцы (где все гонки завершены)
      if (monthPassed) {
        newCollapsedMonths.add(monthKey);
      }
    });
    
    setCollapsedMonths(newCollapsedMonths);
  }, [races]);

  // Если на мобильном и выбран list-view, переключить на grid
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(max-width: 640px)');
      // Removed viewMode state, so this effect is no longer relevant.
      // if (mq.matches && viewMode === 'list') {
      //   setViewMode('grid');
      // }
    }
  }, []); // Removed viewMode from dependency array

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

  const getRacesCountText = (count: number) => {
    if (count === 0) return '0 гонок';
    if (count === 1) return '1 гонка';
    if (count >= 2 && count <= 4) return `${count} гонки`;
    return `${count} гонок`;
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

  // Добавить функции getRaceType и getRaceTypeColor из RaceCard
  const getRaceType = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'TIME ATTACK';
    if (series.includes('GT3')) return 'GT3';
    if (series.includes('Дивизион А')) return 'Туринг А';
    if (series.includes('Дивизион Б')) return 'Туринг Б';
    return 'Гонка';
  };
  const getRaceTypeColor = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'bg-orange-600/80 text-orange-100 border-orange-500/50';
    if (series.includes('GT3')) return 'bg-purple-600/80 text-purple-100 border-purple-500/50';
    if (series.includes('Дивизион А')) return 'bg-green-600/80 text-green-100 border-green-500/50';
    if (series.includes('Дивизион Б')) return 'bg-yellow-600/80 text-yellow-100 border-yellow-500/50';
    return 'bg-gray-600/80 text-gray-100 border-gray-500/50';
  };

  // Проверка: все ли гонки месяца завершены
  const isMonthPassed = (monthRaces: Race[]) => monthRaces.every(isRacePassed);

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 md:px-6 md:py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4 md:mb-8">
        <h2 className="text-2xl font-bold text-white">
          Расписание гонок
        </h2>
        {/* Removed view mode buttons */}
      </div>

      {Object.entries(monthGroups).map(([monthKey, monthRaces]) => {
          const monthPassed = isMonthPassed(monthRaces);
          const isCollapsed = collapsedMonths.has(monthKey);
          return (
            <div key={monthKey} className="mb-10 bg-gray-900/70 rounded-xl border border-gray-700/40 overflow-hidden">
              <div 
                className={`px-2 pt-2 pb-4 md:px-4 md:pt-4 md:pb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between cursor-pointer select-none ${
                  monthPassed ? 'hover:bg-gray-800/40' : ''
                }`}
                onClick={() => {
                  if (monthPassed) {
                    setCollapsedMonths(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(monthKey)) {
                        newSet.delete(monthKey);
                      } else {
                        newSet.add(monthKey);
                      }
                      return newSet;
                    });
                  }
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <i className="ri-calendar-line text-2xl text-blue-400"></i>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{getMonthName(monthKey)}</h3>
                  </div>
                  <span className="text-sm text-gray-400">{getRacesCountText(monthRaces.length)}</span>
                </div>
                {monthPassed && (
                  <div className="flex items-center space-x-2">
                    <i className={`ri-arrow-down-s-line text-xl text-gray-400 transition-transform duration-200 ${isCollapsed ? '' : 'rotate-180'}`}></i>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <div className="px-2 pb-2 md:px-4 md:pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 items-stretch">
                    {monthRaces.map((race) => (
                      <div key={race.id} className="min-w-0 h-full">
                        <RaceCard race={race} />
                      </div>
                    ))}
                  </div>
                </div>
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
