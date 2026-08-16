### Hexlet tests and linter status:
[![Actions Status](https://github.com/Mikhail-o0/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Mikhail-o0/frontend-project-11/actions) [![Node CI](https://github.com/Mikhail-o0/frontend-project-11/actions/workflows/nodejs.yml/badge.svg)](https://github.com/Mikhail-o0/frontend-project-11/actions/workflows/nodejs.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Mikhail-o0_frontend-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Mikhail-o0_frontend-project-11)

## ✨ Функционал

- 🔗 Добавление RSS-лент по URL с валидацией
- 🔄 Автообновление лент каждые 5 секунд (период настраивается)
- 📖 Просмотр постов в модальном окне без ухода с сайта
- 🌐 Проксирование запросов через AllOrigins (обход CORS)
- 🛡️ Полная обработка ошибок сети и валидации
- 🌍 Интернационализация (i18next): русский и английский языки
- 📱 Адаптивный интерфейс на Bootstrap 5

---

## 🏗 Архитектура

Приложение построено по **MVC-подобной архитектуре** без использования фреймворков:

| Модуль | Ответственность |
|--------|-----------------|
| `app.js` | Инициализация состояния, конфигурация i18next |
| `controller.js` | Обработка пользовательских событий, оркестрация |
| `view.js` | Рендеринг DOM, отображение форм, лент, постов, модальных окон |
| `api.js` | HTTP-запросы через Axios, проксирование через AllOrigins |
| `parser.js` | Парсинг XML → JavaScript-объекты (title, description, items) |
| `validation.js` | Валидация URL через Yup (уникальность, формат, доступность) |
| `locales/` | Переводы интерфейса (ru / en) |

---

## 🛠 Технический стек

| Категория | Технологии |
|-----------|-----------|
| **Язык** | JavaScript (ES6+, модули) |
| **Сборка** | Vite |
| **Стили** | Bootstrap 5 |
| **HTTP** | Axios |
| **Валидация** | Yup |
| **Реактивность** | on-change (наблюдение за состоянием) |
| **Локализация** | i18next |
| **Качество кода** | ESLint (Stylistic), SonarCloud |
| **CI/CD** | GitHub Actions |

---

## 🚀 Быстрый старт

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Mikhail-o0/rss-aggregator.git
cd rss-aggregator

# 2. Установить зависимости
make install
# или: npm install

# 3. Запустить dev-сервер
make develop
# или: npm run dev
