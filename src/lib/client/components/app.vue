<template>
<div>
    <h1>Hello Vue 3!</h1>
    <button @click="inc">Clicked {{ count }} times.</button>
</div>
</template>
//TODO: フロントエンドのVueでの置き換え
<script lang="ts">
import { ref, defineComponent } from "vue";

export default defineComponent({
    setup() {
        const count = ref(0);
        const inc = () => {
            count.value++;
        };

    return {
        count,
        inc,
    };
    },
});
</script>

<style scoped>
img {
    width: 200px;
}
h1 {
    font-family: Arial, Helvetica, sans-serif;
}
</style>