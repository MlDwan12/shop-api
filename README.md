# Shop API

## Инструкция по развертыванию

---

### Локальная установка (без Docker)

#### Предварительные требования

- Node.js **v18+**
- PostgreSQL **15+**
- npm

#### 2️⃣ Установка зависимостей

```bash
npm install
```

### Настройте переменные окружения в файле .env: пример в .env.example

### Запуск миграций и сидов

```bash
npm run migrate:latest
npm run migrate:rollback
npm run seed:start
```

###  Запуск приложения

```bash
npm run dev:nodemon
npm run migrate:rollback

npm run build
npm run start
```

Или

```bash
npm run build
npm run start
```

### Сборка и запуск контейнеров

```bash
docker compose down -v && docker compose up --build
```

### Доступ к API
Основной URL: http://localhost:3000

Swagger документация: http://localhost:3000/api-docs

### Тестирование

```bash
npm run test
```
