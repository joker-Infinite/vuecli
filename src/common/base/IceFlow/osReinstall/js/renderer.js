export default {
    data() {
        return {}
    },
    methods: {
        /**
         * 设别类型的渲染
         * @param row
         * @param column
         * @param cellValue
         * @param index
         * @returns {*|Array}
         */
        categoryFormatter(row, column, cellValue, index) {
            return this.onCategoryRenderer(row.category);
        },
        /**
         * 设备子类的渲染
         * @param row
         * @param column
         * @param cellValue
         * @param index
         * @returns {*}
         */
        childTypeFormatter(row, column, cellValue, index) {
            return this.onChildTypeRenderer(row.childType);
        },
        /**
         * 联网区域的渲染
         * @param row
         * @param column
         * @param cellValue
         * @param index
         * @returns {*}
         */
        netAreaAndTypeFormatter(row, column, cellValue, index) {
            return this.onNetRenderer(row.netArea, row.netType, row.useFor)
        },
        /**
         * 联网类型的渲染
         * @param netArea
         * @param netType
         * @returns {*}
         */
        onNetRenderer(netArea, netType) {
            let _data = this.ENUMS.NET_AREA_TYPE_DATA;
            let _value = netArea + this.ENUMS.NET_SEPARATOR() + netType;
            for (let i in _data) {
                let _cur = _data[i];
                if (_cur.code == _value) {
                    return _data[i].name;
                }
            }
            return netArea + netType;
        },
        /**
         * 密级的渲染
         * @param row
         * @param column
         * @param cellValue
         * @param index
         * @returns {*}
         */
        secretLevelFormatter(row, column, cellValue, index) {
            return this.getNameByCode(this.ENUMS.DATA_SECRET_LEVEL_DATA, row.secretLevel);
        }
    }
}