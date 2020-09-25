<template>
    <ice-form-group :name="name" :code="code" v-bind="$attrs" ref="group">
        <div class="grid" ref="grid">
            <slot>
            </slot>
        </div>
    </ice-form-group>

</template>

<script>
    import IceFormGroup from "./IceFormGroup";

    export default {
        name: "IceGridLayout",
        props: {
            columns: {
                type: Number,
                required: true
            },
            name: String,
            code: String,
            gutter: {
                type: String,
                default: '20px'
            }
        },
        data() {
            return {}
        },
        methods: {
            recompute() {
                if (!this.$refs.grid) {
                    return
                }
                let childNodes = this.$refs.grid.childNodes;
                for (let i = 0; i < childNodes.length; i++) {
                    let childNode = childNodes[i];
                    if (!childNode.getAttribute) {
                        continue;
                    }
                    let layout = childNode.getAttribute('layout');
                    if (layout) {
                        layout = parseInt(layout);
                    } else {
                        layout = 1;
                    }

                    childNode.style.width = 'calc((100% - (' + this.columns + ' + 1) * ' + this.gutter + ') / ' + this.columns + ' * ' + layout +
                        ' + (' + layout + ' - 1 ) * ' + this.gutter + ' )';
                    childNode.style.flexBasis = childNode.style.width;

                    /*   childNode.style.marginTop = 'calc(' + this.gutter + ' / 2)';
                       childNode.style.marginBottom = 'calc(' + this.gutter + ' / 2)';*/
                    childNode.style.marginLeft = 'calc(' + this.gutter + ')';
                    childNode.style.boxSizing = 'borderBox';
                    childNode.style.padding = '0';
                }
            },
            setExpanded(expanded = true) {
                this.$refs.group.setExpanded(expanded)
            }
        },
        computed: {},
        watch: {},
        mounted() {
            this.recompute();
            this.$refs.grid.addEventListener('DOMNodeInserted', () => {
                this.recompute();
            })
            this.$refs.grid.addEventListener('DOMNodeRemoved', () => {
                this.recompute();
            })

        },
        components: {IceFormGroup}
    }

</script>


<style lang="less" scoped>
    .grid-group {
        padding: 5px 20px;
        box-sizing: border-box;
    }

    .title {
        display: flex;
        height: 26px;
        margin-bottom: 10px;

        .bar {
            height: 100%;
            width: 6px;
            background: red;
        }

        .name {
            height: 26px;
            margin-left: 10px;
            vertical-align: middle;
            line-height: 26px;
        }

    }

    .grid {
        width: 100%;
        display: flex;
        flex-flow: wrap;
        background: #FFFFFF;

    }
</style>
