<template>
    <div class="full-editor" ref="full-editor">
        <textarea ref="textarea" name="code"></textarea>
        <div class="ice-button-bar">
            <el-button type="primary" @click="$emit('confirm',getValue())">确认</el-button>
            <el-button @click="$emit('cancel')">取消</el-button>
        </div>
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


    export default {
        name: "FullScreenEditor",
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            value: String,
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
                innerValue: this.value
            }
        },
        methods: {
            setValue(value) {
                this.editor.setValue(value);
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

                var words = this.editor.getValue() + "";
                //利用正则取出用户输入的所有的英文的字母
                words = words.replace(/[a-z0-9]+[\-|\'|_]+[a-z0-9]+/ig, '').match(/([a-z0-9]+)/ig);
                //将获取到的用户的单词传入CodeMirror,并在javascript-hint中做匹配
                this.editor.ukeys =this.customKeywords.concat(words);

                CodeMirror.showHint(this.editor);
            });
            /*this.editor.on("change", () => {
                // this.$emit("change", this.editor.getValue())
                this.innerValue = this.editor.getValue()
            })*/
            this.editor.scopeInfo = this.scopeInfo
            this.editor.setValue(this.innerValue || "")


            // if (this.editor.display) {
            // this.$nextTick(_ => {
            //   this.$nextTick(_ => {
            /*onsole.log(this.$refs["full-editor"].offsetHeight)
            console.log(this.editor)*/
            // console.log(this.editor)
            this.editor.display.wrapper.style.flexGrow = "1"
            this.editor.display.wrapper.style.height = "100%"
            this.editor.display.wrapper.style.width = "100%"
            this.$nextTick(_ => {
                this.editor.refresh()
                this.$nextTick(_ => {
                    this.editor.focus()
                })
            })
            // })
            // })
            // }


        },
        components: {}
    }

</script>


<style scoped lang="less">
    .full-editor {
        font-size: 14px;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        /* padding: 10px 20px;*/

        textarea {
            height: 100%;
            width: 100%;
        }
    }
</style>
