
'use client';

export default function CalendarHeader() {
  return (
    <div className="relative bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/60">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
      <div className="relative max-w-7xl mx-auto px-2 py-4 md:px-6 md:py-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg mr-3 md:mr-4">
              <i className="ri-trophy-line w-6 h-6 md:w-7 md:h-7 flex items-center justify-center text-white"></i>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white">
              Календарь симрейсинга
            </h1>
          </div>
          <div className="text-xl md:text-2xl font-bold text-white mb-2">
            AMSC 2025
          </div>
          <p className="text-gray-300 text-base md:text-lg max-w-2xl">
            Полное расписание гонок и турниров сообщества
          </p>
        </div>
      </div>
    </div>
  );
}