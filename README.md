# Avito Tech Test

Монорепозиторий из двух приложений:
- `frontend` (Vite + React), порт `5173`
- `server` (Fastify + TypeScript), порт `8080`

## 1. Структура проекта

```text
.
├─ frontend/
├─ server/
├─ docker-compose.yml
└─ README.md
```

## 2. Рекомендуемый запуск через Docker

### Что нужно заранее

1. Windows 10/11.
2. Docker Desktop.
3. В Docker Desktop включен Linux engine (WSL2 backend).
4. Для AI-эндпоинтов запущен Ollama на хосте:

```powershell
ollama pull llama3
ollama serve
```

### Первый запуск

```powershell
cd C:\MyProjects\avito.tech-test
docker compose up --build
```

После старта:
- Frontend: `http://localhost:5173`
- API: `http://localhost:8080`

### Полезные команды

Запуск в фоне:

```powershell
docker compose up --build -d
```

Логи:

```powershell
docker compose logs -f
```

Остановка:

```powershell
docker compose down
```

Пересборка без кеша:

```powershell
docker compose build --no-cache
docker compose up
```

## 3. Локальный запуск без Docker

### Server

```powershell
cd server
npm install
```

Создайте `server/.env` из `server/.env.example` и при необходимости поправьте значения.

```powershell
npm start
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

## 4. Качество и проверки

Frontend:

```powershell
cd frontend
npm run check
npm run build
```

Server:

```powershell
cd server
npx tsc --noEmit
```

## 5. Переменные окружения

В Docker Compose для бэка уже выставлено:

`OLLAMA_URL=http://host.docker.internal:11434/api/generate`

Это значит, что `server` в контейнере ходит в Ollama на вашей хост-машине.

Если Ollama не запущен:
- обычные endpoints (`/items`) продолжают работать;
- AI-endpoints возвращают ошибку подключения.

## 6. Ошибка `dockerDesktopLinuxEngine`

Если видите:

```text
unable to get image 'avitotech-test-server': error during connect:
Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/...":
open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

Это значит, что Docker daemon не запущен или выбран неверный context.

Сделайте по шагам:

1. Запустите Docker Desktop и дождитесь `Engine running`.
2. Проверьте daemon:

```powershell
docker version
docker info
docker compose version
```

3. Проверьте и переключите context:

```powershell
docker context ls
docker context use desktop-linux
```

4. Если нужно, проверьте сервис Docker (PowerShell от администратора):

```powershell
Get-Service com.docker.service
Start-Service com.docker.service
```

5. Если ошибка не ушла:

```powershell
wsl --status
wsl --update
```

Перезапустите Docker Desktop и повторите `docker compose up --build`.
