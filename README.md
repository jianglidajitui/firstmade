# 初造 FIRSTMADE

连接制造工厂与消费者的新品众筹平台 — 前端静态交互演示。

## 启动

```bash
npm install
npm run dev
```

构建：

```bash
npm run build
npm run preview
```

## 部署到 GitHub Pages

已配置 GitHub Actions（`.github/workflows/deploy-pages.yml`）。

1. 将本仓库推送到 GitHub（默认分支 `main`）
2. 打开仓库 **Settings → Pages**
3. **Source** 选择 **GitHub Actions**
4. 推送后等待 Actions 跑完，访问：

`https://<你的用户名>.github.io/<仓库名>/`

本地开发 `base` 仍为 `/`；CI 会自动注入 `VITE_BASE=/<仓库名>/`。

## 技术栈

- Vue 3（Composition API + `<script setup>`）
- Vue Router
- Vite
- 原生 CSS Variables（无 UI 组件库）

## 说明

- 业务数据为本地 mock，状态与预定/订单写入 `localStorage`
- 不接入真实登录或支付
- 部分商品图为实拍素材，磁吸充电座 / 桌面套装 / 扩展坞等为本地 SVG 示意图，后续可替换
