import { useState } from 'react';
import { Race } from '../app/data/races';

const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const matrix = [];
  let week = [];
  let dayOfWeek = (firstDay.getDay() + 6) % 7; // Пн=0, Вс=6
  for (let i = 0; i < dayOfWeek; i++) week.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week.push(d);
    if (week.length === 7) {
      matrix.push(week);
      week = [];
    }
  }
  if (week.length) {
    while (week.length < 7) week.push(null);
    matrix.push(week);
  }
  return matrix;
}

export default function ClassicMonthCalendar({ races }: { races: Race[] }) {
  const today = new Date();
  const [current, setCurrent] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const matrix = getMonthMatrix(current.year, current.month);
  const monthRaces = races.filter(race => {
    const [day, month, year] = race.date.split('.');
    return +month - 1 === current.month && +year === current.year;
  });

  function getRacesForDay(day: number) {
    return monthRaces.filter(race => +race.date.split('.')[0] === day);
  }

  function prevMonth() {
    setCurrent(prev => {
      const m = prev.month - 1;
      if (m < 0) return { year: prev.year - 1, month: 11 };
      return { year: prev.year, month: m };
    });
  }
  function nextMonth() {
    setCurrent(prev => {
      const m = prev.month + 1;
      if (m > 11) return { year: prev.year + 1, month: 0 };
      return { year: prev.year, month: m };
    });
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/80 rounded-2xl p-4 md:p-8 border border-gray-700/60 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 rounded hover:bg-gray-700/40">
          <i className="ri-arrow-left-s-line text-2xl text-gray-300"></i>
        </button>
        <div className="text-lg md:text-2xl font-bold text-white">
          {today.toLocaleString('ru-RU', { month: 'long' })} {current.year}
        </div>
        <button onClick={nextMonth} className="p-2 rounded hover:bg-gray-700/40">
          <i className="ri-arrow-right-s-line text-2xl text-gray-300"></i>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2 mb-2">
        {weekDays.map((d) => (
          <div key={d} className="text-xs md:text-sm text-gray-400 text-center font-medium py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {matrix.flat().map((day, idx) => {
          const isToday = day && day === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear();
          const racesForDay = day ? getRacesForDay(day) : [];
          return (
            <div key={idx} className={`min-h-[64px] md:min-h-[80px] rounded-lg p-1 md:p-2 flex flex-col items-start border transition-all duration-200 ${isToday ? 'bg-blue-700/30 border-blue-500/60' : 'bg-gray-800/60 border-gray-700/40'}`}>
              <div className={`text-xs md:text-sm font-bold mb-1 ${isToday ? 'text-blue-300' : 'text-gray-300'}`}>{day || ''}</div>
              <div className="flex flex-col gap-1 w-full">
                {racesForDay.map(race => (
                  <div key={race.id} className="truncate text-xs md:text-sm px-1 py-0.5 rounded bg-gradient-to-r from-purple-600/60 to-blue-600/60 text-white font-medium cursor-pointer hover:scale-105 transition-all" title={race.stage}>
                    {race.stage}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 