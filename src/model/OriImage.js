// 原图类
export default class OriImage {
    constructor(oriImageID, taskID, imageUrl, glassNum, stoneNum, status) {
        this.oriImageID = oriImageID;
        this.taskID = taskID;
        this.imageUrl = imageUrl;
        this.glassNum = glassNum;
        this.stoneNum = stoneNum;
        this.status = status;
    }
}