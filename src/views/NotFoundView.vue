<script setup>
import { useRouter } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const router = useRouter()
</script>

<template>
  <div class="wrap container">
    <EmptyState title="页面不存在" description="链接无效，或该页面尚未开放。">
      <BaseButton @click="router.push('/')">返回首页</BaseButton>
      <BaseButton variant="secondary" @click="router.push('/discover')">去发现页</BaseButton>
    </EmptyState>
  </div>
</template>

<style scoped>
.wrap {
  padding: 96px 0;
}
</style>
