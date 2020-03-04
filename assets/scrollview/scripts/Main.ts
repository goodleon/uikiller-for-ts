// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import Thor from '../../uikiller/Thor';

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends Thor {

  // 获取滚动界面
  @property(cc.ScrollView)
  scrollview: cc.ScrollView = null;

  // 统计所有节点个数
  @property(cc.Label)
  itemCountLabel: cc.Label = null;

  // item的摄像机
  @property(cc.Camera)
  itemCamera: cc.Camera = null;

  // 模板1
  @property(cc.Prefab)
  itemTemplet: cc.Prefab = null;

  // 模板2
  @property(cc.Prefab)
  item2Templet: cc.Prefab = null;

  // 节点总个数
  @property(cc.Integer)
  totalCount: number = 0;

  //
  texture: cc.RenderTexture = null;

  _canvas: HTMLCanvasElement = null;

  // LIFE-CYCLE CALLBACKS:

  // start() {
  //   //修改调试信息文本颜色
  //   // cc.profiler.setFpsLabelColor(true, { r: 255, g: 0, b: 0, a: 255 });
  // }

  async start () {
    // init logic
    // this.label.string = this.text;

     let itemp = await this.testAsync();
      cc.log('wcx0304 async itemp=' + itemp);
  }

  async testAsync() : Promise<string> {
    return new Promise<string>((resolve, reject)=>{
      setTimeout(() => {
        resolve("liang miao yi hou ");
      }, 2000);
    });


  // https://forum.cocos.org/t/cocos-creator-async-await/56287

  /**
   * 普通列表加载- 就直接creator templet了, 比较简单
   * 一次new出50个, 性能差
   */
  normalListLoading() {
    this.scrollview.content.destroyAllChildren();
    this.scheduleOnce(() => {
      this.scrollview.content.getComponent(cc.Layout).enabled = true;
      this.scrollview.content.getComponent(cc.Layout).type = cc.Layout.Type.VERTICAL;

      for (let i = 0; i < this.totalCount; i++) {
        let itemNode = cc.instantiate(this.itemTemplet);
        this.scrollview.content.addChild(itemNode);
      }

      this.scheduleOnce(() => {
        this.itemCountLabel.string = `总需浏览数： ${this.totalCount}，实际节点数： ${this.scrollview.content.childrenCount}`;
      }, 0);
    })
  }

  /**
   * 普通背包加载- 一次new出50个, 性能差
   */
  normalBackpackLoading() {
    this.scrollview.content.destroyAllChildren();
    this.scheduleOnce(() => {
      this.scrollview.content.getComponent(cc.Layout).enabled = true;
      this.scrollview.content.getComponent(cc.Layout).type = cc.Layout.Type.GRID;
      for (let i = 0; i < this.totalCount; i++) {
        let itemNode = cc.instantiate(this.item2Templet);
        this.scrollview.content.addChild(itemNode);
      }
      this.scheduleOnce(() => {
        this.itemCountLabel.string = `总需浏览数： ${this.totalCount}，实际节点数： ${this.scrollview.content.childrenCount}`;
      }, 0);
    }, 0)
  }

  /**
   * 复用节点加载列表
   */
  reuseNodeLoadList() {
    this.scrollview.content.destroyAllChildren();
    this.scheduleOnce(() => {
      this.scrollview.content.getComponent(cc.Layout).enabled = false;
      this.scrollview.node.getComponent("ListViewCtrl").init();
    }, 0)
  }

  //分帧加载与节点复用
  async frameLoadingAndNodeReuse() {
    this.scrollview.content.destroyAllChildren();

    this.scrollview.content.getComponent(cc.Layout).enabled = true; // 表示该组件自身是否启用
    this.scrollview.content.getComponent(cc.Layout).type = cc.Layout.Type.GRID; // 布局

    let itemNode = cc.instantiate(this.item2Templet);
    itemNode.group = "Item";

    this.node.addChild(itemNode, 1024);
    await this.executePreFrame(this._getItemGenerator(itemNode, this.totalCount), 1);
  }

  private executePreFrame(generator: Generator, duration: number) {
    return new Promise((resolve, reject) => {
      let gen = generator;
      // 创建执行函数
      let execute = () => {
        // 执行之前，先记录开始时间
        let startTime = new Date().getTime();

        // 然后一直从 Generator 中获取已经拆分好的代码段出来执行
        for (let iter = gen.next(); ; iter = gen.next()) {
          // 判断是否已经执行完所有 Generator 的小代码段，如果是的话，那么就表示任务完成
          if (iter == null || iter.done) {
            resolve();
            return;
          }

          // 每执行完一段小代码段，都检查一下是否已经超过我们分配的本帧，这些小代码端的最大可执行时间
          if (new Date().getTime() - startTime > duration) {
            // 如果超过了，那么本帧就不在执行，开定时器，让下一帧再执行
            this.scheduleOnce(() => {
              execute();
            });
            return;
          }
        }
      };

      // 运行执行函数
      execute();
    });
  }

  private* _getItemGenerator(itemNode: cc.Node, length: number) {
    this.init(itemNode);
    for (let i = 0; i < length; i++) {
      yield this.renderTextureItem(itemNode, i);
    }
    this.scheduleOnce(() => {
      itemNode.destroy();
    }, 0);
  }

  renderTextureItem(itemNode: cc.Node, i) {
    itemNode.getChildByName("title").getComponent(cc.Label).string = "cocos_" + i;
    this.createCanvas(itemNode);
    if(cc.sys.isBrowser){
      let img = this.createImg();
      this.addItem(img);
    } else {
      this.addItem(null);
    }
  }

  /**
   * 分针加载,对特殊item的操作
   * @param item
   */
  init(item: cc.Node) {
    let texture = new cc.RenderTexture();
    if (typeof cc.game['_renderContext'] !== 'undefined') {
      let gl = cc.game['_renderContext'];
      texture.initWithSize(item.width, item.height, gl.STENCIL_INDEX8);
      this.itemCamera.targetTexture = texture;
      this.texture = texture;
    }
  }

  // create the img element
  createImg() {
    // return the type and dataUrl
    var dataURL = this._canvas.toDataURL("image/png");
    var img = document.createElement("img");
    img.src = dataURL;
    return img;
  }

  // create the canvas and context, filpY the image Data
  createCanvas(visitNode: cc.Node) {
    let width = this.texture.width;
    let height = this.texture.height;
    if (!this._canvas) {
      this._canvas = document.createElement('canvas');

      this._canvas.width = width;
      this._canvas.height = height;
    }
    let ctx = this._canvas.getContext('2d');
    this.itemCamera.render(visitNode);
    let data = this.texture.readPixels();
    // write the render data
    let rowBytes = width * 4;
    for (let row = 0; row < height; row++) {
      let srow = height - 1 - row;
      let imageData = ctx.createImageData(width, 1);
      let start = srow * width * 4;
      for (let i = 0; i < rowBytes; i++) {
        imageData.data[i] = data[start + i];
      }

      ctx.putImageData(imageData, 0, row);
    }
    return this._canvas;
  }

  // show on the canvas
  addItem(img) {
    let node = null;
    if (typeof img !== null) {
      let texture = new cc.Texture2D();
      texture.initWithElement(img);

      let spriteFrame = new cc.SpriteFrame();
      spriteFrame.setTexture(texture);

      node = new cc.Node();
      let sprite = node.addComponent(cc.Sprite);
      sprite.spriteFrame = spriteFrame;
    } else {
      node = new cc.Node();
      let sprite = node.addComponent(cc.Sprite);
    }
    node.parent = this.scrollview.content;
    this.itemCountLabel.string = `总需浏览数： ${this.totalCount}，实际节点数： ${this.scrollview.content.childrenCount}`;
  }
};
