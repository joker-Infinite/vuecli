<template>
    <div :style="{width: width,height: height,fontSize:fontSize,position:'relative'}">
        <textarea ref="textarea" name="code"></textarea>
        <div class="vxe-icon--zoomin full-btn" @click="fullScreen=true" title="点击最大化编辑"></div>
        <vxe-modal v-model="fullScreen" :showHeader="false" resize remember fullscreen>
            <full-screen-editor
                    v-if="fullScreen"
                    :customKeywords="customKeywords"
                    :scopeInfo="scopeInfo"
                    :value="editor.getValue()"
                    @confirm="fullConfirm"
                    @cancel="fullCancel"
            ></full-screen-editor>
        </vxe-modal>
    </div>
</template>
<script>

    import "codemirror/lib/codemirror.css"
    import CodeMirror from "codemirror/lib/codemirror.js"
    import "./show-hint.js"
    import "./javascript-hint.js"

    import "codemirror/mode/javascript/javascript.js"
    import "codemirror/theme/idea.css"
    import "./show-hint.css"

    import "codemirror/addon/fold/foldgutter.css"
    import 'codemirror/addon/fold/foldcode.js';
    import 'codemirror/addon/fold/foldgutter.js';
    import 'codemirror/addon/fold/xml-fold.js';
    import 'codemirror/addon/fold/indent-fold.js';
    import "codemirror/addon/fold/brace-fold";
    import 'codemirror/addon/fold/markdown-fold.js';
    import 'codemirror/addon/fold/comment-fold.js';
    import 'codemirror/addon/selection/active-line';
    import 'codemirror/addon/edit/closebrackets';
    import 'codemirror/addon/edit/matchbrackets';
    import FullScreenEditor from "./FullScreenEditor";


    export default {
        name: "IceJsEditor",
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: String,
            height: {
                type: String,
                default: "400px"
            },
            width: {
                type: String,
                default: "600px"
            },
            fontSize: {
                type: String,
                default: "16px"
            },
            customKeywords: {
                type: Array,
                default: _ => {
                    return []
                }
            },
            scopeInfo: {
                type: Object,
                default: _ => {
                    return {
                        /*"this": {
                            "formData": {
                                "shuliang": null,
                                "heji": null
                            },
                            "getComponentById": null,
                        }*/
                    }
                }
            }
        },
        data() {
            return {
                editor: null,
                fullScreen: false
            }
        },
        methods: {
            setValue(value) {
                this.editor.setValue(value || "");
            },
            fullConfirm(data) {
                this.setValue(data)
                //this.$emit("change", data)
                this.fullCancel()
            },
            fullCancel() {
                this.fullScreen = false
            },
            getValue() {
                return this.editor.getValue()
            }
        },
        watch: {
            /*value() {
                this.editor.setValue(this.value);
            }*/
        },
        mounted() {
            this.editor = CodeMirror.fromTextArea(this.$refs.textarea, {
                lineNumbers: true,
                theme: 'idea',
                extraKeys: {"Alt-Q": "autocomplete"},
                mode: {name: "javascript", globalVars: true},

                styleActiveLine: true,
                indentUnit: 4,
                tabSize: 4,
                line: true,
                foldgutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
                lineWrapping: true, //代码折叠           
                foldGutter: true,
                matchBrackets: true,  //括号匹配           
                autoCloseBrackets: true,

            });
            this.editor.on("cursorActivity", () => {
                //调用显示提示

                //debugger
                var words = this.editor.getValue() + "";
                //利用正则取出用户输入的所有的英文的字母
                words = words.replace(/[a-z0-9]+[\-|\'|_]+[a-z0-9]+/ig, '').match(/([a-z0-9]+)/ig);
                //将获取到的用户的单词传入CodeMirror,并在javascript-hint中做匹配
                this.editor.ukeys = this.customKeywords.concat(words);

                CodeMirror.showHint(this.editor);
            });
            /*this.editor.on("change", () => {
                this.$emit("change", this.editor.getValue())
            })*/

            this.editor.scopeInfo = this.scopeInfo

            this.editor.setValue(this.value || "")
            if (this.editor.display) {
                this.editor.display.wrapper.style.height = this.height
            }

        },
        components: {FullScreenEditor}
    }

</script>


<style scoped>
    .full-btn {
        font-size: 20px;
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 6px;
        z-index: 2;
    }
</style>
