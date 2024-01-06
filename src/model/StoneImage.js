export default class StoneImage {
    constructor(imageUrl ,stainColorDiffer, point, stainAreaProportion, crackAreaProportion, crackNum,lengthCaculate, widthCaculate, status) {
        this.imageUrl = imageUrl;
        this.point = point;
        this.stainColorDiffer = stainColorDiffer;
        // 百分比
        this.stainAreaProportion = stainAreaProportion;
        // 百分比
        this.crackAreaProportion = crackAreaProportion;
        this.crackNum = crackNum;
        this.lengthCaculate = lengthCaculate;
        this.widthCaculate = widthCaculate;
        this.status = status;
    }
}