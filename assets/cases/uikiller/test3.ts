import Thor from '../../uikiller/Thor';
const { ccclass } = cc._decorator;

@ccclass
export default class Test3 extends Thor {

    useController = true;
    private _content: any;
    private _logLabel: any;
    onLoad() {
        for(let i = 1; i <= this._content.childrenCount; i++) {
            let name = '_image' + i;
            cc.log(`wcx0119 name=${name}`)
            let node = this[name];
            //节点下的节点用Name就可以访问，但是Label没“_”开头，不能用$访问节点下的组件
            node.num.getComponent(cc.Label).string = i.toString();
        }
        this._logLabel.$Label.string = `有${this._content.childrenCount} 个节点`;
    }

    _onImageTouchEnd(sender) { // $ 同类型, _image$1,_image$2, _image$3,
        this._logLabel.$Label.string = `你点击了${sender.$}，他的节点名字为"${sender.name}"`;
    }
};
