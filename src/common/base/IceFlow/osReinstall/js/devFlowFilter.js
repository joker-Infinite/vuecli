import {mapGetters, mapMutations} from 'vuex'
export default {
    methods:{
        ...mapMutations('datamapStore', ['addUndoTypeCodes']),
        ...mapGetters('datamapStore', ['getDataMap', 'getDataMapList']),
        getMapTypeCodeList(code){
            for (let i = 0; i < this.allList.length; i++) {
                if(code === this.allList[i].code){
                    return this.allList[i].arr;
                }
            }
        },
    },
    created(){
        for (let i = 0; i < this.mapTypeCodeList.length; i++) {
            this.addUndoTypeCodes(this.mapTypeCodeList[i]);
        }
    },
    computed:{
        allList(){
            let list = [];
            for (let i = 0; i < this.mapTypeCodeList.length; i++) {
                let obj = {};
                obj.arr = this.getDataMapList()(this.mapTypeCodeList[i]);
                obj.code = this.mapTypeCodeList[i];
                list.push(obj);
            }
            return list;
        }
    },
}
