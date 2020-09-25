<template>
    <vue-scroll ref="scroll" :ops="{bar:{background:'#000',opacity:0.4,keepShow:true}}" @handle-scroll="handleScroll">
        <slot></slot>
    </vue-scroll>
</template>

<script>
    import VueScroll from 'vuescroll'

    export default {
        name: "IceFormScroll",
        componentName: 'IceFormScroll',
        components: {VueScroll},
        methods: {
            handleScroll() {},
        },
        created() {
            this.$on("form-scroll", el => {
                this.$refs.scroll.scrollIntoView(el);
            })
        }
    }
</script>

<style scoped>

</style>