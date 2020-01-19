// import Thor from '../../uikiller/Thor';
import Thor from "../../uikiller/Thor";


const {ccclass} = cc._decorator;

@ccclass
export default class Test1 extends Thor {
    private _image: any;
    private _label: any;
    private _button: any;
    private _disableBtn: any;
    private _tipLabel: any;
    private _buttonLabel: any;

    onLoad() {
        //直接访问节点
        cc.log('wcx0119 _image =' + this._image.name);
        cc.log('wcx0119 _label =' + this._label.name);
        cc.log('wcx0119 _button =' + this._button.name);
        //在节点上使用“$组件名”访问组件
        cc.log('wcx0119 _label =' + this._label.$Label.string);
        //禁用按钮
        if (!CC_EDITOR) {
            this._disableBtn.$Button.interactable = false;
        }
    }

    _onDisableBtnTouchEnd() {
        cc.log('wcx0119 =' + '禁用按钮被点击了，不太可能吧！');
    }


    _onLabelTouchEnd(sender) {
        cc.assert(sender === this._label);
        sender.$Label.string = '你抚摸了我';
    }

    _onLabelTouchLong(sender) {
        cc.assert(sender === this._label);
        sender.$Label.string = '你长按了我';
        this.scheduleOnce(() => {
            this._label.$Label.string = 'Label';
        }, 3);
    }

    _onButtonTipsTouchLong() {
        this._tipLabel.active = true;
        //注意返回true后，可继续触发_onButtonTipsTouchEnd
        return true;
    }

    _onButtonTipsTouchEnd() {
        this._tipLabel.active = false;
    }

    _onImageTouchMove(sender, event) {
        cc.assert(sender === this._image);
        this._image.position = this._image.position.add(event.getDelta());  //sender.parent.convertToNodeSpaceAR(event.getLocation());
    }

    _onButtonTouchEnd() {
        this._buttonLabel.$Label.string = '你抚摸了我';
        this.scheduleOnce(() => {
            this._buttonLabel.$Label.string = 'button';
        }, 1);
    }

    _onButtonTouchLong() {
        this._buttonLabel.$Label.string = '你长按了我';
        this.scheduleOnce(() => {
            this._buttonLabel.$Label.string = 'button';
        }, 3);
    }
}