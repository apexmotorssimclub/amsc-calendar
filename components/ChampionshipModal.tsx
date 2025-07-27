'use client';

import { Championship } from '../app/data/championships';

interface ChampionshipModalProps {
  championship: Championship;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChampionshipModal({ championship, isOpen, onClose }: ChampionshipModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md max-h-[90vh] bg-gray-900/95 backdrop-blur-sm rounded-2xl border border-gray-700/60 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative p-6 border-b border-gray-700/60 flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <i className="ri-trophy-line w-6 h-6 text-white flex items-center justify-center"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{championship.name}</h2>
                <p className="text-sm text-gray-400">{championship.gamePlatform}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all duration-200 bg-gray-800/50 border border-gray-700/50"
            >
              <i className="ri-close-line w-5 h-5 flex items-center justify-center"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Описание</h3>
            <p className="text-white">{championship.description}</p>
          </div>

          {/* Simulator */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Симулятор</h3>
            <p className="text-white">{championship.fullGameName}</p>
          </div>

          {/* Registration */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Регистрация</h3>
            <p className="text-white">{championship.registration}</p>
          </div>

          {/* Participants */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Участники</h3>
            <p className="text-white">{championship.participants}</p>
          </div>

          {/* Races Count */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Гонок в сезоне</h3>
            <p className="text-white">{championship.racesCount}</p>
          </div>

          {/* Prizes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Призы</h3>
            <p className="text-white">{championship.prizes}</p>
          </div>

          {/* Contacts */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Контакты</h3>
            
            {/* Manager Contact */}
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="w-8 h-8 bg-blue-600/80 rounded-lg flex items-center justify-center">
                <i className="ri-user-line w-4 h-4 text-white flex items-center justify-center"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Менеджер</p>
                <a 
                  href={`https://t.me/${championship.telegramContact.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  {championship.telegramContact}
                </a>
              </div>
            </div>

            {/* Community Channel */}
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="w-8 h-8 bg-purple-600/80 rounded-lg flex items-center justify-center">
                <i className="ri-telegram-line w-4 h-4 text-white flex items-center justify-center"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Канал сообщества</p>
                <a 
                  href="https://t.me/amsimclub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                >
                  @amsimclub
                </a>
              </div>
            </div>

            {/* Community Chat */}
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="w-8 h-8 bg-green-600/80 rounded-lg flex items-center justify-center">
                <i className="ri-chat-1-line w-4 h-4 text-white flex items-center justify-center"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Чат сообщества</p>
                <a 
                  href="https://t.me/amsimchat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 text-sm font-medium"
                >
                  @amsimchat
                </a>
              </div>
            </div>

            {/* Championship Page */}
            <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
              <div className="w-8 h-8 bg-orange-600/80 rounded-lg flex items-center justify-center">
                <i className="ri-global-line w-4 h-4 text-white flex items-center justify-center"></i>
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Страница чемпионата</p>
                <a 
                  href={championship.telegramChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                >
                  Перейти на сайт
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700/60 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
} 