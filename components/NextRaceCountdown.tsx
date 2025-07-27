
'use client';

import { useState, useEffect } from 'react';
import { Race } from '../app/data/races';
import { getChampionshipBySeries } from '../app/data/championships';
import ChampionshipModal from './ChampionshipModal';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const championship = race ? getChampionshipBySeries(race.series) : null;

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

  // Цвета для платформы игры (как в RaceCard)
  const getGameColor = (series: string) => {
    if (series.includes('ACC')) return 'bg-blue-600/80 text-blue-100 border-blue-500/50';
    if (series.includes('AC')) return 'bg-red-600/80 text-red-100 border-red-500/50';
    return 'bg-gray-600/80 text-gray-100 border-gray-500/50';
  };
  // Цвета для типа заезда (как в RaceCard)
  const getRaceTypeColor = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'bg-orange-600/80 text-orange-100 border-orange-500/50';
    if (series.includes('GT3')) return 'bg-purple-600/80 text-purple-100 border-purple-500/50';
    if (series.includes('Дивизион А')) return 'bg-green-600/80 text-green-100 border-green-500/50';
    if (series.includes('Дивизион Б')) return 'bg-yellow-600/80 text-yellow-100 border-yellow-500/50';
    return 'bg-gray-600/80 text-gray-100 border-gray-500/50';
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

  const getSeriesColor = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'bg-red-500/20 text-red-300 border-red-500/30';
    if (series.includes('GT3')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (series.includes('Дивизион А')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (series.includes('Дивизион Б')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
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
      <div className="max-w-7xl mx-auto px-2 py-4 md:px-6 md:py-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/60 to-gray-900/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-700/60">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-blue-500/10"></div>
          <div className="absolute top-0 left-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-xl md:blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-xl md:blur-2xl"></div>

          <div className="relative p-6 md:p-12 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-gray-700/50 to-gray-600/50 rounded-full flex items-center justify-center shadow-xl">
              <i className="ri-calendar-line w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-400"></i>
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-3">Нет предстоящих гонок</h2>
            <p className="text-gray-400 text-sm md:text-lg">Проверьте расписание позже</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 md:px-6 md:py-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800/90 to-gray-900/95 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-gray-700/60 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-blue-500/10 to-cyan-500/15"></div>
        <div className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full blur-2xl md:blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-tl from-purple-500/20 to-transparent rounded-full blur-2xl md:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-xl md:blur-2xl"></div>

        <div className="relative p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 md:mb-8 gap-4">
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-500/40 shadow-lg">
                <i className="ri-timer-flash-line w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-blue-300"></i>
              </div>
              <div>
                <h2 className="text-xl md:text-3xl font-bold text-white mb-1">Ближайшая гонка</h2>
                <p className="text-gray-400 text-sm md:text-lg">До старта осталось</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-2 py-1 rounded-md bg-green-600/80 text-green-100 border border-green-500/50 text-xs font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"></span>
                LIVE
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700/50">
                {/* Заголовок гонки */}
                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-lg md:text-2xl font-bold text-white mb-2">{race.stage}</h3>
                  
                  {/* Плашки серии и игры */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                    <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getRaceTypeColor(race.series)}`}>{getSeriesShortName(race.series)}</div>
                    <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getGameColor(race.series)}`}>{getGamePlatform(race.series)}</div>
                  </div>
                </div>

                {/* Дата и время */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
                  <div className="bg-gray-700/30 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <i className="ri-calendar-2-line w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-blue-400"></i>
                      <span className="text-xs md:text-sm text-gray-400">Дата</span>
                    </div>
                    <p className="text-white font-semibold text-sm md:text-base">{race.date}</p>
                    <p className="text-xs md:text-sm text-gray-400">{race.dayOfWeek}</p>
                  </div>

                  <div className="bg-gray-700/30 rounded-lg md:rounded-xl p-3 md:p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <i className="ri-time-line w-4 h-4 md:w-5 md:h-5 flex items-center justify-center text-purple-400"></i>
                      <span className="text-xs md:text-sm text-gray-400">Время</span>
                    </div>
                    <p className="text-white font-semibold text-sm md:text-base">{race.time}</p>
                    <p className="text-xs md:text-sm text-gray-400">МСК</p>
                  </div>
                </div>

                {/* Кнопки */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <button
                    onClick={addToGoogleCalendar}
                    type="button"
                    className="flex items-center justify-center space-x-2 px-4 py-3 md:px-6 md:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base font-medium"
                  >
                    <i className="ri-google-line w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"></i>
                    <span>В календарь</span>
                  </button>
                  
                  {championship && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      type="button"
                      className="flex items-center justify-center space-x-2 px-4 py-3 md:px-6 md:py-4 bg-gray-700/50 text-gray-300 rounded-lg md:rounded-xl hover:bg-gray-600/50 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 text-sm md:text-base font-medium border border-gray-600/50"
                    >
                      <i className="ri-information-line w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"></i>
                      <span>Подробнее</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Блок обратного отсчета */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-gray-700/50 flex flex-col items-center justify-center">
              <h4 className="text-sm md:text-base font-semibold text-white mb-4 flex items-center justify-center">
                <i className="ri-timer-2-line w-4 h-4 md:w-5 md:h-5 flex items-center justify-center mr-2 text-cyan-400"></i>
                Обратный отсчет
              </h4>

              <div className="space-y-3 md:space-y-4 w-full">
                {/* Дни */}
                <div className="text-center">
                  <div className="text-4xl md:text-6xl font-bold text-white mb-1" suppressHydrationWarning={true}>
                    {timeLeft.days}
                  </div>
                  <div className="text-xs text-gray-400 uppercase tracking-wide">дней</div>
                </div>

                {/* Часы, минуты, секунды */}
                <div className="flex flex-col items-center">
                  <div className="flex flex-row items-center justify-center">
                    {/* Часы */}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl md:text-4xl font-bold text-white tabular-nums leading-[1] align-middle mx-2" suppressHydrationWarning={true}>
                        {timeLeft.hours.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">ч</span>
                    </div>
                    {/* Двоеточие */}
                    <span className="flex flex-col items-center justify-center mx-1">
                      <svg width="8" height="32" viewBox="0 0 8 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="10" r="2" fill="#6B7280" />
                        <circle cx="4" cy="22" r="2" fill="#6B7280" />
                      </svg>
                    </span>
                    {/* Минуты */}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl md:text-4xl font-bold text-white tabular-nums leading-[1] align-middle mx-2" suppressHydrationWarning={true}>
                        {timeLeft.minutes.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">м</span>
                    </div>
                    {/* Двоеточие */}
                    <span className="flex flex-col items-center justify-center mx-1">
                      <svg width="8" height="32" viewBox="0 0 8 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="4" cy="10" r="2" fill="#6B7280" />
                        <circle cx="4" cy="22" r="2" fill="#6B7280" />
                      </svg>
                    </span>
                    {/* Секунды */}
                    <div className="flex flex-col items-center">
                      <span className="text-2xl md:text-4xl font-bold text-white tabular-nums leading-[1] align-middle mx-2" suppressHydrationWarning={true}>
                        {timeLeft.seconds.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs text-gray-400 mt-1">с</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно */}
      {championship && (
        <ChampionshipModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          championship={championship}
        />
      )}
    </div>
  );
}
