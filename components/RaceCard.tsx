'use client';

import { Race } from '../app/data/races';

interface RaceCardProps {
  race: Race;
}

export default function RaceCard({ race }: RaceCardProps) {
  const formatDateForGoogle = (dateStr: string, timeStr: string) => {
    try {
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
    } catch (error) {
      console.error('Ошибка форматирования даты:', error);
      throw error;
    }
  };

  const isRacePassed = () => {
    try {
      const [day, month, year] = race.date.split('.');
      const [hour, minute] = race.time.split(':');
      const raceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
      return raceDate < new Date();
    } catch {
      return false;
    }
  };

  const addToGoogleCalendar = () => {
    if (isRacePassed()) return;

    try {
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

  const getSeriesIcon = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'ri-timer-flash-line';
    if (series.includes('GT3')) return 'ri-car-line';
    if (series.includes('Дивизион А')) return 'ri-trophy-line';
    if (series.includes('Дивизион Б')) return 'ri-award-line';
    return 'ri-flag-line';
  };

  const isPassed = isRacePassed();

  return (
    <div className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] ${isPassed ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-sm' : 'bg-gray-800/80 border-gray-700/60 backdrop-blur-sm hover:bg-gray-800/90 hover:border-gray-600/70'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-3 md:p-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-2 md:mb-4">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-3">
              <div className={`flex items-center space-x-2 px-2 py-1 md:px-3 md:py-1.5 rounded-full border ${isPassed ? 'bg-gray-700/50 text-gray-400 border-gray-600/50' : getSeriesColor(race.series)}`}>
                <i className={`${getSeriesIcon(race.series)} w-4 h-4 md:w-5 md:h-5 flex items-center justify-center`}></i>
                <span className="text-xs md:text-sm font-medium">{getSeriesShortName(race.series)}</span>
              </div>
              <div className={`px-2 py-1 rounded-full border ${isPassed ? 'bg-gray-700/50 text-gray-400 border-gray-600/50' : getGameColor(race.series)}`}>
                <span className="text-xs font-bold">{getGamePlatform(race.series)}</span>
              </div>
              {isPassed && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                  <i className="ri-checkbox-circle-fill w-3 h-3 flex items-center justify-center"></i>
                  <span className="text-xs font-medium">Завершено</span>
                </div>
              )}
            </div>

            <h3 className={`text-base md:text-xl font-bold mb-2 md:mb-3 ${isPassed ? 'text-gray-300' : 'text-white'}`}>{race.stage}</h3>

            <div className="space-y-1 md:space-y-2">
              <div className={`flex items-center space-x-2 ${isPassed ? 'text-gray-400' : 'text-gray-300'}`}>
                <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                  <i className="ri-calendar-2-line w-4 h-4 flex items-center justify-center"></i>
                </div>
                <span className="text-xs md:text-sm">{race.date}</span>
                <span className="text-xs text-gray-500">({race.dayOfWeek})</span>
              </div>
              <div className={`flex items-center space-x-2 ${isPassed ? 'text-gray-400' : 'text-gray-300'}`}>
                <div className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                  <i className="ri-time-line w-4 h-4 flex items-center justify-center"></i>
                </div>
                <span className="text-xs md:text-sm">{race.time}</span>
                <span className="text-xs text-gray-500">МСК</span>
              </div>
            </div>
          </div>

          {!isPassed && (
            <button
              onClick={addToGoogleCalendar}
              type="button"
              className="flex items-center space-x-2 px-3 py-2 md:px-4 md:py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 whitespace-nowrap cursor-pointer shadow-lg hover:shadow-xl"
            >
              <i className="ri-google-line w-4 h-4 flex items-center justify-center"></i>
              <span className="text-xs md:text-sm font-medium">В календарь</span>
            </button>
          )}
        </div>

        <div className={`border-t pt-2 md:pt-4 ${isPassed ? 'border-gray-700/50' : 'border-gray-700/60'}`}>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${isPassed ? 'bg-gray-700/50' : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30'}`}>
                <i className={`ri-roadster-line w-5 h-5 md:w-6 md:h-6 flex items-center justify-center ${isPassed ? 'text-gray-400' : 'text-blue-300'}`}></i>
              </div>
              <div>
                <p className={`text-xs md:text-sm font-medium ${isPassed ? 'text-gray-400' : 'text-gray-300'}`}>Трасса</p>
                <p className={`text-xs ${isPassed ? 'text-gray-500' : 'text-gray-400'}`}>Автодром</p>
              </div>
            </div>

            {isPassed && (
              <div className="flex items-center space-x-2 text-green-400">
                <i className="ri-checkbox-circle-fill w-4 h-4 md:w-5 md:h-5 flex items-center justify-center"></i>
                <span className="text-xs md:text-sm font-medium">Завершено</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}