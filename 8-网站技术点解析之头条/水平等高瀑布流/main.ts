interface ImageInfo {
    src: string,
    width: number,
    height: number
}

type Strategy = (imagesInfo:ImageInfo[], start: number, end: number, lineWidth: number) => number;

export class ImageLayoutManager {
    // 待布局的图片信息
    private images: ImageInfo[];
    // 每一行有多少张图片
    private lineNumber: number;
    // 每一行有多宽
    private lineWidth: number;
    // 当前行有多高
    private lineHeight: number;
    // 默认的图片宽高比
    private defaultRatio: number;
    // 每一行行高标准值，所有图片的高度不能超过这个值
    private stdLineHeight: number;

    // 当每行最后一个元素容不下时，对该行各个图片的宽度进行收缩
    private defaultShrinkStrategy: Strategy;
    // 当每行最后一个元素加入后，本行末尾存在空闲空间，对该行各个图片的宽度加宽
    private defaultExtendStrategy: Strategy;

    // 当每行最后一个元素加入后，本行末尾存在空闲空间，当这个空间宽度大于OFFSET时，
    // 才对本行的元素的宽度加宽。OFSSET越小，则本行图片塞得越满，视觉上更整齐美观。
    public static OFFSET: number = 5;

    public constructor() {
        this.images = [];
        this.lineNumber = 5;
        this.lineWidth = 2000;
        this.defaultRatio = 1.5;
        this.defaultExtendStrategy = defaultExtendStrategy;
        this.defaultShrinkStrategy = defaultShrinkStrategy;
    }

    public setLineNumber(lineNumber: number) {
        if(lineNumber < 0) {
            throw Error("parament cannot be negative");
        }
        this.lineNumber = Math.floor(lineNumber)
    }

    public setLineWidth(lineWidth: number) {
        if(lineWidth < 0) {
            throw Error("parament cannot be negative");
        }
        this.lineWidth = Math.floor(lineWidth);
    }

    public setDefaultRatio(defaultRatio: number) {
        if(defaultRatio < 0) {
            throw Error("parament cannot be negative");
        }
        this.defaultRatio = defaultRatio;
    }

    public wrap(images: ImageInfo[]) {
        this.images = images
    }

    public layout(): ImageInfo[] {
        this.stdLineHeight = Math.floor(this.lineWidth / this.defaultRatio);
        this.lineHeight = 0;

        let renderedImagesInfo: ImageInfo[] = [];
        // 记录一行图片的宽度总和
        let actualLineWidth = 0;
        // 记录当前行剩下多少宽度
        let leftWidth = this.lineWidth;
        // 记录行首元素索引
        let start = 0;

        for(let i = 0; i < this.images.length; i++) {
            let imageInfo = this.images[i];
            let src: string;
            let width: number;
            let height: number;
           

            if(i % this.lineNumber === 0) {
                 // 每行行首元素
                 start = i;
                 // 计算一行图片宽度的总和
                 actualLineWidth = this.images.slice(i, i + this.lineNumber).reduce( (sum, item) => ( sum + item.width), 0)
                 
                 // 定出行首元素的宽度
                 width = Math.floor( (imageInfo.width / actualLineWidth) * this.lineWidth );
                 leftWidth -= width;

                 // 根据行首元素的宽度定出行的高度，
                 // 宽高比如果比默认宽高比小，优先采用默认宽高比计算，目的是防止行高度太大
                 let actualRatio = imageInfo.width / imageInfo.height;
                 height = actualRatio < this.defaultRatio? Math.floor(width / this.defaultRatio): Math.floor(width / imageInfo.width * imageInfo.height);
                 // 如果比标准的行高还大，采用标准的行高
                 height = height < this.stdLineHeight? height: this.stdLineHeight;
                 this.lineHeight = height;
            } else {
                // 每行中间元素或者结尾元素
                width = Math.floor(this.lineHeight * imageInfo.width / imageInfo.height);
                // 剩下的宽度不够了
                while(leftWidth < width) {
                    leftWidth = this.resizeWithShrink(renderedImagesInfo, start, i);
                    this.lineHeight = renderedImagesInfo[start].height;
                    width = Math.floor(this.lineHeight * imageInfo.width / imageInfo.height);
                }
                // 结尾元素 leftWidth从新算起
                if(i % this.lineNumber === this.lineNumber - 1) {
                    while(leftWidth - width > ImageLayoutManager.OFFSET) {
                        leftWidth = this.resizeWithExtend(renderedImagesInfo, start, i);
                        this.lineHeight = renderedImagesInfo[start].height;
                        width = Math.ceil(this.lineHeight * imageInfo.width / imageInfo.height);

                        while(leftWidth < width) {
                            leftWidth = this.resizeWithShrink(renderedImagesInfo, start, i);
                            this.lineHeight = renderedImagesInfo[start].height;
                            width = Math.floor(this.lineHeight * imageInfo.width / imageInfo.height);
                        }
                    }
                    leftWidth = this.lineWidth;
                } else {
                    leftWidth -= width;
                }
            }
            src = imageInfo.src;
            height = this.lineHeight;
            renderedImagesInfo.push({ src, width, height });
        }

        return renderedImagesInfo;
    }

    private resizeWithShrink(
        renderedImagesInfo: ImageInfo[], 
        start: number, 
        end: number): number {
           return this.defaultShrinkStrategy(renderedImagesInfo, start, end, this.lineWidth);
        }

    private resizeWithExtend(
        renderedImagesInfo: ImageInfo[], 
        start: number, 
        end: number): number {
            return this.defaultExtendStrategy(renderedImagesInfo, start, end, this.lineWidth);
    }

    public shrinkBy(shrinkStrategy: Strategy) {
        this.defaultShrinkStrategy = shrinkStrategy;
    }

    public extendBy(extendStrategy: Strategy) {
        this.defaultExtendStrategy = extendStrategy;
    }

    public useDefaultShrinkStrategy() {
        this.defaultShrinkStrategy = defaultShrinkStrategy;
    }

    public useDefaultExtendStrategy() {
        this.defaultExtendStrategy = defaultExtendStrategy;
    }

}


function defaultShrinkStrategy(
    renderedImagesInfo: ImageInfo[], 
    start: number, 
    end: number,
    lineWidth: number): number {
        // 选出宽度最大的，让它的宽度-1
        let dest = start;
        let maxValue = renderedImagesInfo[start].width;
        for(let i = start; i < end; i++) {
            if(renderedImagesInfo[i].width > maxValue) {
                maxValue = renderedImagesInfo[i].width
                dest = i;
            }
        }
        let destHeight = 0;
        let destWidth = 0;
        let ratio = renderedImagesInfo[dest].width / renderedImagesInfo[dest].height;

        renderedImagesInfo[dest].width -= 1;
        destHeight = renderedImagesInfo[dest].height = Math.floor(renderedImagesInfo[dest].width / ratio);
        destWidth = renderedImagesInfo[dest].width
        lineWidth -= destWidth;

        for(let i = start; i < end; i++) {
            if(i !== dest) {
                let oldHeight = renderedImagesInfo[i].height;
                let oldWidth = renderedImagesInfo[i].width;
                renderedImagesInfo[i].width = Math.floor(destHeight / oldHeight * oldWidth);
                renderedImagesInfo[i].height = destHeight;
                lineWidth -= renderedImagesInfo[i].width;
            }
            
        }
        return lineWidth;
        
}

function defaultExtendStrategy(
    renderedImagesInfo: ImageInfo[], 
    start: number, 
    end: number,
    lineWidth: number
): number {
    // 选出宽度最小的, 让它的宽度+1
    let dest = start;
    let minValue = renderedImagesInfo[start].width;
    for(let i = start; i < end; i++) {
        if(renderedImagesInfo[i].width < minValue) {
            minValue = renderedImagesInfo[i].width
            dest = i;
        }
    }
   
    let ratio = renderedImagesInfo[dest].width / renderedImagesInfo[dest].height;
    renderedImagesInfo[dest].width += 1;
    renderedImagesInfo[dest].height = Math.floor(renderedImagesInfo[start].width / ratio);
        
    let destHeight = renderedImagesInfo[dest].height;
    let destWidth = renderedImagesInfo[dest].width;

    lineWidth -= destWidth;

    for(let i = start; i < end; i++) {
        if(i !== dest) {
            let oldHeight = renderedImagesInfo[i].height;
            let oldWidth = renderedImagesInfo[i].width;
            renderedImagesInfo[i].width = Math.floor(destHeight / oldHeight * oldWidth);
            renderedImagesInfo[i].height = destHeight;
            lineWidth -= renderedImagesInfo[i].width;
        }
        
    }
    return lineWidth;
}

