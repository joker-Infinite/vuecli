<template>
    <div class="main">
        <el-button @click="goto('/Vuex')">Vuex</el-button>
        <mel_select :value="select" @change="change" :options="options"></mel_select>
        <br>
        <mel_checkbox @change="checkChange" :options="check"
                      :all-select="true"></mel_checkbox>
        <!--        <component is="vueFirst"></component>-->
    </div>
</template>

<script>
    import common from './common/index'
    import Mel_select from "../common/element_ui/mel_select";
    import Mel_checkbox from "../common/element_ui/mel_checkbox";

    export default {
        name: "Home",
        components: {Mel_checkbox, Mel_select, ...common},
        data() {
            return {
                select: '',
                options: [
                    {
                        label: '选项一',
                        value: 'a1'
                    },
                    {
                        label: '选项二',
                        value: 'a2'
                    },
                    {
                        label: '选项三',
                        value: 'a3'
                    },
                    {
                        label: '选项四',
                        value: 'a4'
                    },
                ],
                check: [
                    12, 32, 43, 54, 65
                ]
            }
        },
        methods: {
            goto(path) {
                this.$router.push(path);
            },
            change(v, d, i) {
                this.select = v;
            },
            checkChange(v, o) {
                console.log(v);
                console.log(o);
            },
        },
        mounted() {

        }
    }
</script>

<style scoped lang="less">
    .main {
        width: 100%;
        height: 100%;
        position: fixed;
        background: #7d7d7d;
    }
</style>