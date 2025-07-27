
'use client';

import Image from 'next/image';

export default function CalendarHeader() {
  return (
    <div className="relative bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/60">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
      <div className="relative max-w-7xl mx-auto px-2 py-4 md:px-6 md:py-8">
        {/* Мобильная версия - вертикальная компоновка */}
        <div className="flex flex-col items-center gap-4 md:hidden">
          {/* Логотип сверху */}
          <div className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="APEX MOTORS"
              width={120}
              height={60}
              className="h-10 w-auto"
              priority
            />
          </div>

          {/* Название по центру */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center justify-center mb-2">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg mr-2">
                <i className="ri-trophy-line w-4 h-4 flex items-center justify-center text-white"></i>
              </div>
              <h1 className="text-lg font-bold text-white">
                Календарь симрейсинга
              </h1>
            </div>
            <div className="text-lg font-bold text-white mb-1">
              AMSC 2025
            </div>
            <p className="text-gray-300 text-sm max-w-xs">
              Полное расписание гонок и турниров сообщества
            </p>
          </div>

          {/* Кнопка снизу */}
          <div className="flex-shrink-0">
            <a
              href="https://ac.amsim.club/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 text-sm font-medium"
            >
              <i className="ri-server-line w-4 h-4 flex items-center justify-center"></i>
              <span>Серверы AC</span>
            </a>
          </div>
        </div>

        {/* Десктопная версия - горизонтальная компоновка */}
        <div className="hidden md:flex items-center justify-between gap-4">
          {/* Логотип слева */}
          <div className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="APEX MOTORS"
              width={120}
              height={60}
              className="h-16 w-auto"
              priority
            />
          </div>

          {/* Название по центру */}
          <div className="flex-1 flex justify-center">
            <div className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg mr-4">
                  <i className="ri-trophy-line w-7 h-7 flex items-center justify-center text-white"></i>
                </div>
                <h1 className="text-4xl font-bold text-white">
                  Календарь симрейсинга
                </h1>
              </div>
              <div className="text-2xl font-bold text-white mb-2">
                AMSC 2025
              </div>
              <p className="text-gray-300 text-lg max-w-2xl">
                Полное расписание гонок и турниров сообщества
              </p>
            </div>
          </div>

          {/* Кнопка справа */}
          <div className="flex-shrink-0">
            <a
              href="https://ac.amsim.club/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 text-base font-medium"
            >
              <i className="ri-server-line w-5 h-5 flex items-center justify-center"></i>
              <span>Серверы AC</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}