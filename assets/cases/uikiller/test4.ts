import Thor from '../../uikiller/Thor';

const {ccclass} = cc._decorator;
// 有 @的节点就不被处理了..
@ccclass
export default class Test4 extends Thor {
    getOptions() {
        return {
            filter: (node) => {
                let ival = node.$ % 2
                cc.log(`wcx0119 ${node.$} ${ival} name= ${node.name}` )
                return ival; // 返回0的node才符合要求
            }
        }
    }

    onLoad() {
        for (let i = 1; i <= 8; i++) {
            cc.log('wcx0119 i=' + i)
            let imageNode = this[`_image${i}`];
            if (imageNode.num) {
                imageNode.num.getComponent(cc.Label).string = `#` + i;
            }
        }
    }
}
