
'use client';

import { useState, useEffect } from 'react';
import { Race } from '../app/data/races';

interface NextRaceCountdownProps {
  race: Race | null;
}

export default function NextRaceCountdown({ race }: NextRaceCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    if (!race) return;

    const calculateTimeLeft = () => {
      try {
        const [day, month, year] = race.date.split('.');
        const [hour, minute] = race.time.split(':');
        const raceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
        const now = new Date();
        const difference = raceDate.getTime() - now.getTime();

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }
      } catch (error) {
        console.error('Ошибка расчета времени:', error);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [race]);

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

  const getSeriesShortName = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'TIME ATTACK';
    if (series.includes('GT3')) return 'GT3';
    if (series.includes('Дивизион А')) return 'Туринг А';
    if (series.includes('Дивизион Б')) return 'Туринг Б';
    return series;
  };

  const getSeriesIcon = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'ri-timer-flash-line';
    if (series.includes('GT3')) return 'ri-car-line';
    if (series.includes('Дивизион А')) return 'ri-trophy-line';
    if (series.includes('Дивизион Б')) return 'ri-award-line';
    return 'ri-flag-line';
  };

  const addToGoogleCalendar = () => {
    if (!race) return;

    try {
      const formatDateForGoogle = (dateStr: string, timeStr: string) => {
        const [day, month, year] = dateStr.split('.');
        const [hour, minute] = timeStr.split(':');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
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

  if (!race) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-3xl border border-gray-700/60">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10"></div>
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-2xl"></div>

          <div className="relative p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-full flex items-center justify-center shadow-xl">
              <i className="ri-calendar-line w-10 h-10 flex items-center justify-center text-gray-400"></i>
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">Нет предстоящих гонок</h2>
            <p className="text-gray-400 text-lg">Проверьте расписание позже</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm rounded-3xl border border-gray-700/60 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-blue-500/10 to-cyan-500/15"></div>
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-2xl"></div>

        <div className="relative p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center border border-blue-500/40 shadow-lg">
                <i className="ri-timer-flash-line w-8 h-8 flex items-center justify-center text-blue-300"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Ближайшая гонка</h2>
                <p className="text-gray-400 text-lg">До старта осталось</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 rounded-full border border-green-500/30 shadow-lg">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">LIVE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center border border-red-500/30">
                      <i className={`${getSeriesIcon(race.series)} w-6 h-6 flex items-center justify-center text-red-300`}></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{race.stage}</h3>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-gray-400">{getSeriesShortName(race.series)}</span>
                        <div className={`px-3 py-1 rounded-full border ${getGameColor(race.series)}`}>
                          <span className="text-xs font-bold">{getGamePlatform(race.series)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-calendar-2-line w-5 h-5 flex items-center justify-center text-blue-400"></i>
                      <span className="text-sm text-gray-400">Дата</span>
                    </div>
                    <p className="text-white font-semibold">{race.date}</p>
                    <p className="text-sm text-gray-400">{race.dayOfWeek}</p>
                  </div>

                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <i className="ri-time-line w-5 h-5 flex items-center justify-center text-purple-400"></i>
                      <span className="text-sm text-gray-400">Время</span>
                    </div>
                    <p className="text-white font-semibold">{race.time}</p>
                    <p className="text-sm text-gray-400">МСК</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={addToGoogleCalendar}
                  type="button"
                  className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <i className="ri-google-line w-5 h-5 flex items-center justify-center"></i>
                  <span className="font-medium">Добавить в календарь</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-gray-700/50 flex flex-col items-center justify-center">
              <h4 className="text-base font-semibold text-white mb-2 flex items-center">
                <i className="ri-timer-2-line w-4 h-4 flex items-center justify-center mr-1 text-cyan-400"></i>
                Обратный отсчет
              </h4>

              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-6xl font-bold text-white mb-1" suppressHydrationWarning={true}>
                    {timeLeft.days}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">дней</div>
                </div>

                <div className="flex justify-center space-x-1">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white" suppressHydrationWarning={true}>
                      {timeLeft.hours}
                    </div>
                    <div className="text-xs text-gray-400">ч</div>
                  </div>
                  <div className="text-4xl text-gray-500 font-bold">:</div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white" suppressHydrationWarning={true}>
                      {timeLeft.minutes}
                    </div>
                    <div className="text-xs text-gray-400">м</div>
                  </div>
                  <div className="text-4xl text-gray-500 font-bold">:</div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white" suppressHydrationWarning={true}>
                      {timeLeft.seconds}
                    </div>
                    <div className="text-xs text-gray-400">с</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-gray-700/50">
                {/* Удалён блок статуса */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
