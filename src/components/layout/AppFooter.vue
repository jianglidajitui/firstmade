<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

async function goHow() {
  if (router.currentRoute.value.path !== '/') {
    await router.push({ path: '/', hash: '#how-it-works' })
  } else {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div>
        <div class="brand">
          <span>初造</span>
          <span class="mono">FIRSTMADE</span>
        </div>
        <p>连接制造工厂与消费者的新品众筹平台。让好产品，从你的支持开始。</p>
      </div>
      <div>
        <h4>探索</h4>
        <RouterLink to="/discover">发现新品</RouterLink>
        <RouterLink to="/discover?status=in_stock">现货好物</RouterLink>
        <button type="button" @click="goHow">如何参与</button>
      </div>
      <div>
        <h4>工厂</h4>
        <RouterLink to="/studio">工厂工作台</RouterLink>
        <RouterLink to="/studio">发布新品</RouterLink>
      </div>
    </div>
    <div class="container footer__note">
      <span>当前为交互演示，数据保存在本地</span>
      <span class="mono">© FIRSTMADE DEMO</span>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--line);
  padding: 64px 0 28px;
  background: #efefe9;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 48px;
}

.brand {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}

.brand span:first-child {
  font-size: 20px;
  font-weight: 650;
  letter-spacing: 0.08em;
}

.brand .mono {
  font-size: 11px;
  letter-spacing: 0.16em;
  color: var(--muted);
}

.footer p {
  color: var(--muted);
  font-size: 14px;
  max-width: 28em;
  line-height: 1.7;
}

h4 {
  font-size: 13px;
  margin-bottom: 14px;
  color: var(--muted);
  font-weight: 500;
}

a,
button {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  text-align: left;
}

a:hover,
button:hover {
  color: var(--accent);
}

.footer__note {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 12px;
}

@media (max-width: 768px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer__note {
    flex-direction: column;
  }
}
</style>
