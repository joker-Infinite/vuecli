<template>
    <div :style="{width: width,height: height,fontSize:fontSize}">
        <textarea ref="textarea" name="code"></textarea>
    </div>
</template>
<script>

    import "codemirror/lib/codemirror.css"
    import CodeMirror from "codemirror/lib/codemirror.js"
    import "./show-hint"
    import "./sql-hint.js"

    import "codemirror/mode/sql/sql.js"
    import "codemirror/theme/idea.css"
    import "codemirror/addon/hint/show-hint.css"

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
        name: "IceSqlEditor",
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
                default: "14px"
            }
        },
        data() {
            return {
                editor: null
            }
        },
        methods: {
            setValue(value) {
                this.editor.setValue(value);
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
                mode: {name: "sql"},
                styleActiveLine: true,
                indentUnit: 4,
                tabSize: 4,
                line: true,
                foldgutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter", "CodeMirror-lint-markers"],
                lineWrapping: false, //代码超长是否自动换行           
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
                CodeMirror.ukeys = words;
                CodeMirror.showHint(this.editor);
            });
            this.editor.on("change", () => {
                this.$emit("change", this.editor.getValue())
            })
            this.editor.setValue(this.value)
            if (this.editor.display) {
                this.editor.display.wrapper.style.height = this.height
            }

        },
        components: {}
    }

</script>


<style scoped>

</style>
