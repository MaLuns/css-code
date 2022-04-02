---
title: 拟物按钮
date: 2022-03-03 19:49:55
description: 新拟物风按钮实现
tags:
---

<template>
    <button @click="add">拟物风按钮 {{ data }}</button>
</template>
<script>
export default {
    data () {
        return {
            data: 0
        }
    },
    methods: {
        add () {
            this.data++;
        }
    }
}
</script>
<style lang="less">
body {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #ddd;

    button {
        color: #090909;
        padding: 0.7em 1.7em;
        font-size: 18px;
        border-radius: 0.5em;
        background: #e8e8e8;
        border: 1px solid #e8e8e8;
        transition: all 0.3s;
        box-shadow: 6px 6px 12px #c5c5c5, -6px -6px 12px #ffffff;

        &:active {
            color: #666;
            box-shadow: inset 4px 4px 12px #c5c5c5, inset -4px -4px 12px #ffffff;
        }
    }
}
</style>