const ZOOM_MAX = 3;
const ZOOM_MIN = 1;

import Thor from '../../uikiller/Thor';
const { ccclass } = cc._decorator;

@ccclass
export default class Test9 extends Thor {
    private _lastDistance: null;
    private _count: number;
    private _label: any;
    private _closeDrag: boolean;
    private _firstPoint: any;
    private _layout: any;

    _onLayoutTouchStart(sender, event) {
        this._lastDistance = null;
        this._count = 0;
        this._closeDrag = false;
        this._label.$Label.string = event.getTouches().length;
    }

    _onLayoutTouchMove(sender, event) {
        let touches = event.getTouches();
        let locations = touches.map(t => t.getLocation());
        if (locations.length === 2) {
            this._closeDrag = true;
            this._firstPoint = locations[0].add(locations[1]).mul(0.5);   
        }
        //采样10次    
        if (this._count++ < 10) {
            return;
        }
        if (touches.length === 1 && !this._closeDrag) {
            this._onLayoutTouchDrag(sender, touches[0]);
        } else if (touches.length === 2) {
            
            let distance = locations[0].sub(locations[1]).mag();
            if (!this._lastDistance) {
                this._lastDistance = distance;
                return;
            }
            
            //cc.log(distance, this._lastDistance);
            // @ts-ignore
            let dt = (distance - this._lastDistance) * 0.01;
            this._onLayoutTouchZoom(sender, dt, this._firstPoint);
            this._lastDistance = distance;
        }
    }

    _onLayoutTouchDrag(sender, touch) {
        cc.log('_onLayoutTouchDrag', this._lastDistance);
        this._layout.position = sender.parent.convertToNodeSpaceAR(touch.getLocation());
    }

    _onLayoutTouchZoom(sender, zoom, zoomCenter) {
        zoom = this._layout.scale + zoom;
        if (zoom < ZOOM_MIN || zoom > ZOOM_MAX) {
            return;
        }
        this._layout.scale = zoom;
        this._label.$Label.string = this._layout.scale;  
    }

    // update (dt) {}
}
