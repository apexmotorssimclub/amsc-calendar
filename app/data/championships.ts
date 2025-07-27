export interface Championship {
  id: string;
  name: string;
  description: string;
  registration: string;
  telegramContact: string;
  telegramChannel: string;
  prizes: string;
  participants: string;
  racesCount: number;
  gamePlatform: 'AC' | 'ACC';
  fullGameName: string;
}

export const championships: Championship[] = [
  {
    id: 'time-attack',
    name: 'TIME ATTACK',
    description: 'Индивидуальные заезды на лучшее время',
    registration: 'Регистрация на каждый этап отдельно',
    telegramContact: '@timeattack_manager',
    telegramChannel: 'https://yoklmnracing.ru/c/442',
    prizes: 'По результатам чемпионата кубки',
    participants: 'До 100 на каждый этап',
    racesCount: 10,
    gamePlatform: 'ACC',
    fullGameName: 'Assetto Corsa Competizione'
  },
  {
    id: 'gt3',
    name: 'GT3',
    description: 'Командные и индивидуальный чемпионат GT3',
    registration: 'Поздняя регистрация доступна',
    telegramContact: '@gt3_manager',
    telegramChannel: 'https://yoklmnracing.ru/c/396',
    prizes: 'Кубки и денежные сертификаты каждый этап',
    participants: 'До 50',
    racesCount: 8,
    gamePlatform: 'ACC',
    fullGameName: 'Assetto Corsa Competizione'
  },
  {
    id: 'touring-a',
    name: 'Туринг Дивизион А',
    description: 'Туринговые гонки на AC',
    registration: 'Лист ожидания',
    telegramContact: '@touring_manager',
    telegramChannel: 'https://yoklmnracing.ru/c/403',
    prizes: 'Кубки, медали и сертификаты каждый этап',
    participants: '20',
    racesCount: 6,
    gamePlatform: 'AC',
    fullGameName: 'Assetto Corsa'
  },
  {
    id: 'touring-b',
    name: 'Туринг Дивизион Б',
    description: 'Туринговые гонки на AC',
    registration: 'Лист ожидания',
    telegramContact: '@touring_manager',
    telegramChannel: 'https://yoklmnracing.ru/c/422',
    prizes: 'Медали каждый этап',
    participants: '30',
    racesCount: 6,
    gamePlatform: 'AC',
    fullGameName: 'Assetto Corsa'
  }
];

export const getChampionshipBySeries = (series: string): Championship | null => {
  if (series.includes('TIME ATTACK')) {
    return championships.find(c => c.id === 'time-attack') || null;
  }
  if (series.includes('GT3')) {
    return championships.find(c => c.id === 'gt3') || null;
  }
  if (series.includes('Дивизион А')) {
    return championships.find(c => c.id === 'touring-a') || null;
  }
  if (series.includes('Дивизион Б')) {
    return championships.find(c => c.id === 'touring-b') || null;
  }
  return null;
}; 