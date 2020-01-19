import Thor from './uikiller/Thor'

const {ccclass, property} = cc._decorator;
/**
 *
 */
const SCENE_INFO = {
    test1: '1-基础用法：节点、事件绑定',
    test2: '2-动态创建Prefab',
    test3: '3-使用“$”绑定同类型节点',
    test4: '4-插件：过滤器用法，排除节点',
    test5: '5-插件：多语言绑定用法',
    test6: '6-插件：音效控制',
    test7: '7-TouchStart事件的秘密',
    test8: '8-隐藏节点的绑定测试',
    test9: '9-节点缩放测试',
    test10: '10-控制器',
};


@ccclass
export default class TestScene extends Thor {
    @property(cc.Prefab)
    listItem = null;
    private _content: any;

    onLoad() {
        // 列出所有的 fire
        let games = cc.game._sceneInfos.map((sceneInfo, index) => {
            let name = cc.path.basename(sceneInfo.url, '.fire');
            cc.log('wcx0119 sceneInfo.url=' + sceneInfo.url + ' index=' + index);
            // cc.log('wcx0119 name=' + name + ' SCENE_INFO[name]=' + SCENE_INFO[name]);
            return {name, title: SCENE_INFO[name] || name};
        }).filter(item => item.name !== 'TestScene');


        // 为没一条fire建立一个item
        games.forEach((item) => {
            // 创建item
            let listItem = cc.instantiate(this.listItem);
            // 添加监听
            listItem.on(cc.Node.EventType.TOUCH_END, () => {
                cc.log('wcx0119 loadScene item.name=' + item.name)
                cc.director.loadScene(item.name);
            });
            this._content.addChild(listItem);
            listItem.getComponent(cc.Label).string = item.title;
        });

        if (!CC_EDITOR) {
            let backNode = cc.find('back');
            // 声明常驻根节点，该节点不会被在场景切换中被销毁
            // 目标节点必须位于为层级的根节点，否则无效。--和canvas同级!
            // 该按钮的事件监听在 cc属性编辑器中已经添加好了,
            // 直接调用cc系统的 loadScene 数据 TestScene
            cc.game.addPersistRootNode(backNode);
        }
    }
}