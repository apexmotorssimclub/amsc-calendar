#!/bin/bash

echo "🚀 Начинаем деплой amsc-calendar..."

# Переходим в директорию проекта
cd /opt/amsc-calendar

# Получаем последние изменения
echo "📥 Получаем изменения из Git..."
git pull origin main

# Устанавливаем зависимости
echo "📦 Устанавливаем зависимости..."
npm install

# Собираем проект
echo "🔨 Собираем проект..."
npm run build

# Перезапускаем PM2 процесс
echo "🔄 Перезапускаем PM2..."
pm2 restart amsc-calendar --update-env

# Проверяем статус
echo "✅ Проверяем статус..."
pm2 status

echo "🎉 Деплой завершен!" 