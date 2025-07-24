
'use client';

export default function CalendarHeader() {
  return (
    <div className="relative bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/60">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
              <div className="w-10 h-10 flex items-center justify-center mr-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <i className="ri-trophy-line w-6 h-6 flex items-center justify-center text-white"></i>
              </div>
              Календарь симрейсинга AMSC 2025
            </h1>
            <p className="text-gray-300 text-lg">
              Полное расписание гонок и турниров сообщества
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/60">
              <div className="flex items-center space-x-2 text-gray-300">
                <i className="ri-calendar-check-line w-5 h-5 flex items-center justify-center text-green-400"></i>
                <span className="text-sm">Живое расписание</span>
              </div>
            </div>
            
            <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/60">
              <div className="flex items-center space-x-2 text-gray-300">
                <i className="ri-time-line w-5 h-5 flex items-center justify-center text-purple-400"></i>
                <span className="text-sm">Время: МСК</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}