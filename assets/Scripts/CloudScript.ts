import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('CloudScript')
export class CloudScript extends Component {
    pixelSize = 4;
    pixel = 0;
    speed = 7.5;

    cloudParent;
    cloudSize = 320;

    start() {
        this.cloudParent = this.node.children[0];
    }

    update(deltaTime: number) {
        this.pixel += this.speed * deltaTime;
        this.pixel = this.pixel % this.cloudSize;
        this.cloudParent.setPosition(Math.round(this.pixel), 0, 0);
    }
}


