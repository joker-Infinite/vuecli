export default {
    provide() {
        return {
            uploading_file: this
        }
    },
    data() {
        return {
            uploadList: [],
        }
    },
    methods: {
        getUploadFile(t) {
            this.uploadList.push(t);
        },
        getUploadStatus() {
            for (let i = 0; i < this.uploadList.length; i++) {
                if (this.uploadList[i].getStatus()) {
                    return true;
                }
            }
            return false;
        },
    }
}
