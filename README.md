# 简贝 Web 前端

横版 React/Vite 前端。开发环境默认通过 Vite proxy 连接本地后端：

```bash
http://127.0.0.1:8000
```

前端代码默认请求同源 `/api` 和 `/health`，`vite.config.ts` 会转发到 `http://127.0.0.1:8000`，避免开发端口变化导致 CORS 问题。如需覆盖后端地址：

```bash
VITE_JANESHELL_API_BASE_URL=http://127.0.0.1:8000 npm run dev
```

后端不可用时，前端会自动回退到本地 mock，保证界面仍可预览。

## 常用命令

```bash
npm run dev
npm run check
npm run lint
npm run test
npm run build
```

## 后端接入点

当前前端优先使用 `/api/v1/web` 适配层：

- `POST /api/v1/web/profile/default`
- `GET /api/v1/web/users/{user_id}/bootstrap`
- `POST /api/v1/web/users/{user_id}/chat/messages`

同时直接接入：

- `POST /api/v1/profile`
- `POST /api/v1/users/{user_id}/companion/interactions`
- `POST /api/v1/users/{user_id}/companion/gifts`
- `PATCH /api/v1/users/{user_id}/plans/tasks/{task_id}`
