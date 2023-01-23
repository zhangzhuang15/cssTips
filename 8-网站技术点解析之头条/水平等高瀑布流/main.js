export class ImageLayoutManager {
    constructor() {
        this.images = [];
        this.lineNumber = 5;
        this.lineWidth = 2000;
        this.defaultRatio = 1.5;
        this.defaultExtendStrategy = defaultExtendStrategy;
        this.defaultShrinkStrategy = defaultShrinkStrategy;
    }
    setLineNumber(lineNumber) {
        if (lineNumber < 0) {
            throw Error("parament cannot be negative");
        }
        this.lineNumber = Math.floor(lineNumber);
    }
    setLineWidth(lineWidth) {
        if (lineWidth < 0) {
            throw Error("parament cannot be negative");
        }
        this.lineWidth = Math.floor(lineWidth);
    }
    setDefaultRatio(defaultRatio) {
        if (defaultRatio < 0) {
            throw Error("parament cannot be negative");
        }
        this.defaultRatio = defaultRatio;
    }
    wrap(images) {
        this.images = images;
    }
    layout() {
        this.stdLineHeight = Math.floor(this.lineWidth / this.defaultRatio);
        this.lineHeight = 0;
        let renderedImagesInfo = [];
        // 记录一行图片的宽度总和
        let actualLineWidth = 0;
        // 记录当前行剩下多少宽度
        let leftWidth = this.lineWidth;
        // 记录行首元素索引
        let start = 0;
        for (let i = 0; i < this.images.length; i++) {
            let imageInfo = this.images[i];
            let src;
            let width;
            let height;
            if (i % this.lineNumber === 0) {
                // 每行行首元素
                start = i;
                // 计算一行图片宽度的总和
                actualLineWidth = this.images.slice(i, i + this.lineNumber).reduce((sum, item) => (sum + item.width), 0);
                // 定出行首元素的宽度
                width = Math.floor((imageInfo.width / actualLineWidth) * this.lineWidth);
                leftWidth -= width;
                // 根据行首元素的宽度定出行的高度，
                // 宽高比如果比默认宽高比小，优先采用默认宽高比计算，目的是防止行高度太大
                let actualRatio = imageInfo.width / imageInfo.height;
                height = actualRatio < this.defaultRatio ? Math.floor(width / this.defaultRatio) : Math.floor(width / imageInfo.width * imageInfo.height);
                // 如果比标准的行高还大，采用标准的行高
                height = height < this.stdLineHeight ? height : this.stdLineHeight;
                this.lineHeight = height;
            }
            else {
                // 每行中间元素或者结尾元素
                width = Math.floor(this.lineHeight * imageInfo.width / imageInfo.height);
                // 剩下的宽度不够了
                while (leftWidth < width) {
                    leftWidth = this.resizeWithShrink(renderedImagesInfo, start, i);
                    this.lineHeight = renderedImagesInfo[start].height;
                    width = Math.floor(this.lineHeight * imageInfo.width / imageInfo.height);
                }
                // 结尾元素 leftWidth从新算起
                if (i % this.lineNumber === this.lineNumber - 1) {
                    while (leftWidth - width > ImageLayoutManager.OFFSET) {
                        leftWidth = this.resizeWithExtend(renderedImagesInfo, start, i);
                        this.lineHeight = renderedImagesInfo[start].height;
                        width = Math.ceil(this.lineHeight * imageInfo.width / imageInfo.height);
                        while (leftWidth < width) {
                            leftWidth = this.resizeWithShrink(renderedImagesInfo, start, i);
                            this.lineHeight = renderedImagesInfo[start].height;
                            width = Math.floor(this.lineHeight * imageInfo.width / imageInfo.height);
                        }
                    }
                    leftWidth = this.lineWidth;
                }
                else {
                    leftWidth -= width;
                }
            }
            src = imageInfo.src;
            height = this.lineHeight;
            renderedImagesInfo.push({ src, width, height });
        }
        return renderedImagesInfo;
    }
    resizeWithShrink(renderedImagesInfo, start, end) {
        return this.defaultShrinkStrategy(renderedImagesInfo, start, end, this.lineWidth);
    }
    resizeWithExtend(renderedImagesInfo, start, end) {
        return this.defaultExtendStrategy(renderedImagesInfo, start, end, this.lineWidth);
    }
}
ImageLayoutManager.OFFSET = 5;
function defaultShrinkStrategy(renderedImagesInfo, start, end, lineWidth) {
    // 选出宽度最大的收缩
    let dest = start;
    let maxValue = renderedImagesInfo[start].width;
    for (let i = start; i < end; i++) {
        if (renderedImagesInfo[i].width > maxValue) {
            maxValue = renderedImagesInfo[i].width;
            dest = i;
        }
    }
    let destHeight = 0;
    let destWidth = 0;
    let ratio = renderedImagesInfo[dest].width / renderedImagesInfo[dest].height;
    renderedImagesInfo[dest].width -= 1;
    destHeight = renderedImagesInfo[dest].height = Math.floor(renderedImagesInfo[dest].width / ratio);
    destWidth = renderedImagesInfo[dest].width;
    lineWidth -= destWidth;
    for (let i = start; i < end; i++) {
        if (i !== dest) {
            let oldHeight = renderedImagesInfo[i].height;
            let oldWidth = renderedImagesInfo[i].width;
            renderedImagesInfo[i].width = Math.floor(destHeight / oldHeight * oldWidth);
            renderedImagesInfo[i].height = destHeight;
            lineWidth -= renderedImagesInfo[i].width;
        }
    }
    return lineWidth;
}
function defaultExtendStrategy(renderedImagesInfo, start, end, lineWidth) {
    // 选出宽度最小的扩展
    let dest = start;
    let minValue = renderedImagesInfo[start].width;
    for (let i = start; i < end; i++) {
        if (renderedImagesInfo[i].width < minValue) {
            minValue = renderedImagesInfo[i].width;
            dest = i;
        }
    }
    let ratio = renderedImagesInfo[dest].width / renderedImagesInfo[dest].height;
    renderedImagesInfo[dest].width += 1;
    renderedImagesInfo[dest].height = Math.floor(renderedImagesInfo[start].width / ratio);
    let destHeight = renderedImagesInfo[dest].height;
    let destWidth = renderedImagesInfo[dest].width;
    lineWidth -= destWidth;
    for (let i = start; i < end; i++) {
        if (i !== dest) {
            let oldHeight = renderedImagesInfo[i].height;
            let oldWidth = renderedImagesInfo[i].width;
            renderedImagesInfo[i].width = Math.floor(destHeight / oldHeight * oldWidth);
            renderedImagesInfo[i].height = destHeight;
            lineWidth -= renderedImagesInfo[i].width;
        }
    }
    return lineWidth;
}
