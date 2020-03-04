import Thor from "../../uikiller/Thor";
import array = cc.js.array;


const {ccclass,property} = cc._decorator;

@ccclass
export default class Test1 extends Thor {
    private _image: any; //拖拽测试
    private _label: any; // 长按不响应btn的label
    private _button: any; //长按后不响应, touch end
    private _buttonLabel: any;//长按后不响应, touch end 的label

    private _disableBtn: any; // 被禁用的按钮
    private _tipLabel: any;
    private _imageTag: any; // 目标
    private _btnAdd: any; // 添加一种食物
    // public iEditbox: any; // 菜名输入框
    private _Foods : Array<string> = [];

    // 食材名, 输入框
    @property(cc.EditBox)
    iFoodEditbox: cc.EditBox = null;

    // 食材列表
    @property(cc.EditBox)
    iFoodScrollview: cc.EditBox = null;

    //长按后响应的 按钮的 label

    onLoad() {
        //直接访问节点
        // cc.log('wcx0119 _image =' + this._image.name);
        // cc.log('wcx0119 _label =' + this._label.name);
        // cc.log('wcx0119 _button =' + this._button.name);
        cc.log('wcx0119 _imageTag =' + this._imageTag.name);
        //在节点上使用“$组件名”访问组件
        cc.log('wcx0119 _label =' + this._label.$Label.string);

        cc.log('wcx0304 _btnOK.name =' + this._btnAdd.name); //

        cc.log('wcx0304 iFoodEditbox.name =' + this.iFoodEditbox.name); // 组件名
        cc.log('wcx0304 this.iFoodEditbox.string=' + this.iFoodEditbox.string) // 文本
        cc.log('wcx0304 this.iFoodEditbox.placeholder=' + this.iFoodEditbox.placeholder) // 提示符
        // cc.log('wcx0119 _iEditbox.maxLength =' + this.iEditbox.$editbox.maxLength);
        //禁用按钮
        if (!CC_EDITOR) {
            this._disableBtn.$Button.interactable = false;
        }
    }

    /***
     * 接受用户输入 食物名称的回调函数
     */
    onFoodEidtBoxBegan(){
        cc.log('wcx0304 = onFoodEidtBoxBegan ' + this.iFoodEditbox.string);
    }
    onFoodEidtBoxTextChanged(){
        if(this.iFoodEditbox.string.length >= this.iFoodEditbox.maxLength ){
            cc.log('wcx0304 = onFoodEidtBoxTextChanged  ' + this.iFoodEditbox.string + '最大长度为' + this.iFoodEditbox.maxLength);
        } else {
            cc.log('wcx0304 = onFoodEidtBoxTextChanged  ' + this.iFoodEditbox.string);
        }
    }
    onFoodEidtBoxDidEnded(){
        cc.log('wcx0304 =  onFoodEidtBoxDidEnded=  ' + this.iFoodEditbox.string);
    }
    onFoodEidtBoxReturn(){
        cc.log('wcx0304 = onFoodEidtBoxReturn= ' + this.iFoodEditbox.string);
    }
    /**
     * 食物确定按钮
     */
    _onBtnAddTouchEnd() {
        if(this.iFoodEditbox.string.length <= 0){
            cc.log('wcx0304 =' + '确定按钮被点击了，请输入,食物名称！');
        }
        else {
            cc.log('wcx0304 = _onBtnAddTouchEnd= ' + this.iFoodEditbox.string);
            let splitted = this.iFoodEditbox.string.split(' ');
            this._Foods = this._Foods.concat(splitted);
            cc.log('wcx0304 = _Foods= ' + this._Foods);
            this.iFoodEditbox.string = ''
        }
    }

    // 禁止按钮的 touch end
    _onDisableBtnTouchEnd() {
        cc.log('wcx0119 =' + '禁用按钮被点击了，不太可能吧！');
    }

    // 为一个label添加了 touchend事件
    _onLabelTouchEnd(sender) {
        cc.assert(sender === this._label);
        sender.$Label.string = '你轻触了我';
    }

    // 为一个label添加了 touch long事件
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
    _isintersect (aS, aT){
        if(typeof aS === 'undefined' || typeof aT === 'undefined'){
            return false;
        }

        if(aS.position.x >= (aT.position.x - aT.width/2) &&
            aS.position.x <= (aT.position.x + aT.width/2) ){
            if(aS.position.y >= (aT.position.y - aT.height/2) &&
                aS.position.y <= (aT.position.y + aT.height/2) ){
                return true;
            }
        }
    }
    _onImageTouchMove(sender, event) {
        cc.assert(sender === this._image);
        this._image.position = this._image.position.add(event.getDelta());
        //sender.parent.convertToNodeSpaceAR(event.getLocation());
        cc.log('wcx this._image.position=' + JSON.stringify(this._image.position));
        if (this._isintersect(this._image, this._imageTag)) {
            this._image.position = this._imageTag.position;
            this._image.interactable = false;
        }
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