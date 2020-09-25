<script>
    import {Pagination} from 'element-ui'

    export default {
        extends: Pagination,
        props: {
            pageSizes: {
                type: Array,
                default: function () {
                    return [10, 20, 50, 100]
                }
            },
            pageSize: {
                type: Number,
                default: 20
            },
            layout: {
                type: String,
                default: 'total, sizes, prev, pager, next, jumper'
            }
        }
    }
</script>
