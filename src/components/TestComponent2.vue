<script>
    import { useCounterStore } from '@/stores/counter'

    export default {
        setup() {
            const a = 1;
            const counter = useCounterStore();
            return {c: counter, a: a};
        }
    }
</script>

<template>
    <button @click="c.increment">Test 2: {{c.counter}}</button>
</template>