---
title: Vue3
date: 2022-03-03 19:49:55
description: Vue3 单文件
tags:
language: vue3
---
<template lang="pug">
h1 {{msg}}
input(v-model="msg")
</template>

<script setup>
import { ref } from 'vue'

const msg = ref('Hello Vue3!')
</script>

<style lang="less">
body {
    text-align: center;

    h1 {
        color: red;
    }
}
</style>  
            