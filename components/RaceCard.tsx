'use client';

import { useState } from 'react';
import { Race } from '../app/data/races';
import { getChampionshipBySeries } from '../app/data/championships';
import ChampionshipModal from './ChampionshipModal';

interface RaceCardProps {
  race: Race;
}

export default function RaceCard({ race }: RaceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const championship = getChampionshipBySeries(race.series);

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

  // Получение платформы игры (AC/ACC)
  const getGamePlatform = (series: string) => {
    if (series.includes('ACC')) return 'ACC';
    if (series.includes('AC')) return 'AC';
    return 'AC';
  };

  // Получение типа заезда
  const getRaceType = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'TIME ATTACK';
    if (series.includes('GT3')) return 'GT3';
    if (series.includes('Дивизион А')) return 'Туринг А';
    if (series.includes('Дивизион Б')) return 'Туринг Б';
    return 'Гонка';
  };

  // Получение РСКГ для туринговых серий
  const getRSCG = (series: string) => {
    if (series.includes('Туринг')) return 'РСКГ';
    return null;
  };

  // Цвета для платформы игры
  const getGameColor = (series: string) => {
    if (series.includes('ACC')) return 'bg-blue-600/80 text-blue-100 border-blue-500/50';
    if (series.includes('AC')) return 'bg-red-600/80 text-red-100 border-red-500/50';
    return 'bg-gray-600/80 text-gray-100 border-gray-500/50';
  };

  // Цвета для типа заезда
  const getRaceTypeColor = (series: string) => {
    if (series.includes('TIME ATTACK')) return 'bg-orange-600/80 text-orange-100 border-orange-500/50';
    if (series.includes('GT3')) return 'bg-purple-600/80 text-purple-100 border-purple-500/50';
    if (series.includes('Дивизион А')) return 'bg-green-600/80 text-green-100 border-green-500/50';
    if (series.includes('Дивизион Б')) return 'bg-yellow-600/80 text-yellow-100 border-yellow-500/50';
    return 'bg-gray-600/80 text-gray-100 border-gray-500/50';
  };

  // Цвета для РСКГ
  const getRSCGColor = () => {
    return 'bg-indigo-600/80 text-indigo-100 border-indigo-500/50';
  };

  const isPassed = isRacePassed();

  return (
    <div className={`h-full flex flex-col bg-gray-800/90 border border-gray-700/60 rounded-xl p-4 transition-all duration-300 hover:bg-gray-800/95 hover:border-gray-600/70 ${isPassed ? 'opacity-75' : ''}`}>
      
      {/* Плашки вверху */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Платформа игры */}
          <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getGameColor(race.series)}`}>
            {getGamePlatform(race.series)}
          </div>
          
          {/* РСКГ для туринговых серий */}
          {getRSCG(race.series) && (
            <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getRSCGColor()}`}>
              {getRSCG(race.series)}
            </div>
          )}
          
          {/* Тип заезда */}
          <div className={`px-2 py-1 rounded-md border text-xs font-medium ${getRaceTypeColor(race.series)}`}>
            {getRaceType(race.series)}
          </div>
        </div>
        
        {/* Плашка "Завершено" */}
        {isPassed && (
          <div className="px-2 py-1 rounded-md bg-green-600/80 text-green-100 border border-green-500/50 text-xs font-medium">
            Завершено
          </div>
        )}
      </div>

      {/* Название трассы */}
      <h3 className={`text-lg font-bold mb-4 ${isPassed ? 'text-gray-300' : 'text-white'} truncate`}>
        {race.stage}
      </h3>

      {/* Дата и время */}
      <div className="space-y-2 mb-4">
        <div className={`flex items-center gap-2 ${isPassed ? 'text-gray-400' : 'text-gray-300'}`}>
          <i className="ri-calendar-2-line text-sm"></i>
          <span className="text-sm">{race.date} ({race.dayOfWeek})</span>
        </div>
        <div className={`flex items-center gap-2 ${isPassed ? 'text-gray-400' : 'text-gray-300'}`}>
          <i className="ri-time-line text-sm"></i>
          <span className="text-sm">{race.time} МСК</span>
        </div>
      </div>

      {/* Кнопка "В календарь" */}
      {!isPassed && (
        <div className="mt-auto space-y-2">
          <button
            onClick={addToGoogleCalendar}
            className="w-full px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
          >
            <i className="ri-google-line"></i>
            В календарь
          </button>
          
          {championship && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-3 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 border border-gray-600/50"
            >
              <i className="ri-information-line"></i>
              Подробнее о чемпионате
            </button>
          )}
        </div>
      )}

      {/* Модальное окно с информацией о чемпионате */}
      {championship && (
        <ChampionshipModal
          championship={championship}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}