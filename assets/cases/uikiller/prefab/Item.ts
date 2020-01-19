import Thor from '../../../uikiller/Thor'

const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends Thor {
    protected useController: Boolean = true;
    protected controllerName: String = 'ItemController';
    private _label: any;

    @property
    get string() {
        if (this._label) {
            return this._label.$Label.string;
        }
        return '';
    }

    set string(value) {
        if(this._label){
            this._label.$Label.string = value;
        }
    }

    onLoad() {
        cc.log('Item...');
    }

    //绑定控件器
    bindController() {
        if (this.useController && this.controllerName) {
            // @ts-ignore
            let {controller} = require(this.controllerName);
            controller.onRegister(this);
        }
    }
};