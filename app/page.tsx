'use client';

import { useState, useMemo } from 'react';
import { races } from './data/races';
import CalendarHeader from '../components/CalendarHeader';
import CalendarFilters from '../components/CalendarFilters';
import CalendarView from '../components/CalendarView';
import NextRaceCountdown from '../components/NextRaceCountdown';

export default function Home() {
  const [selectedSeries, setSelectedSeries] = useState<string[]>([]);

  const allSeries = useMemo(() => {
    const uniqueSeries = [...new Set(races.map(race => race.series))];
    return uniqueSeries.sort();
  }, []);

  const filteredRaces = useMemo(() => {
    if (selectedSeries.length === 0) {
      return races;
    }
    return races.filter(race => selectedSeries.includes(race.series));
  }, [selectedSeries]);

  const nextRace = useMemo(() => {
    const now = new Date();
    const upcomingRaces = races.filter(race => {
      try {
        const [day, month, year] = race.date.split('.');
        const [hour, minute] = race.time.split(':');
        const raceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
        return raceDate > now;
      } catch {
        return false;
      }
    });
    
    return upcomingRaces.sort((a, b) => {
      const dateA = new Date(a.date.split('.').reverse().join('-'));
      const dateB = new Date(b.date.split('.').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    })[0] || null;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)] pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)] pointer-events-none"></div>
      
      <div className="relative">
        <CalendarHeader />
        <NextRaceCountdown race={nextRace} />
        <CalendarFilters
          series={allSeries}
          selectedSeries={selectedSeries}
          onSeriesChange={setSelectedSeries}
        />
        <CalendarView races={filteredRaces} />
      </div>
    </div>
  );
}