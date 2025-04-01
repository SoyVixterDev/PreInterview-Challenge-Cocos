import { _decorator, Animation, AnimationClip, Component, EventKeyboard, input, Input, KeyCode, log, Node, Sprite, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    speed = 1;
    velocity = new Vec2(0, 0);
    inputVec = new Vec2(0, 0);

    minPos = new Vec2(-165, -70);
    maxPos = new Vec2(165, -25);

    sprite: Node;
    anim: Animation;

    idleAnim: AnimationClip;
    walkAnim: AnimationClip;

    start() {
        this.sprite = this.node.children[1];
        this.anim = this.getComponentInChildren(Animation);

        this.idleAnim = this.anim.clips[0];
        this.walkAnim = this.anim.clips[1];
    }

    onLoad() {
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
    }

    clamp(a, min, max) {
        return Math.min(max, Math.max(a, min));
    }

    onKeyUp(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.inputVec.x -= -1;
                break;
            case KeyCode.KEY_D:
                this.inputVec.x -= 1;
                break;
            case KeyCode.KEY_W:
                this.inputVec.y -= 1;
                break;
            case KeyCode.KEY_S:
                this.inputVec.y -= -1;
                break;
        }

    }

    onKeyDown(event: EventKeyboard) {
        switch (event.keyCode) {
            case KeyCode.KEY_A:
                this.inputVec.x += -1;
                break;
            case KeyCode.KEY_D:
                this.inputVec.x += 1;
                break;
            case KeyCode.KEY_W:
                this.inputVec.y += 1;
                break;
            case KeyCode.KEY_S:
                this.inputVec.y += -1;
                break;
        }

        this.inputVec.x = this.clamp(this.inputVec.x, -1, 1);
        this.inputVec.y = this.clamp(this.inputVec.y, -1, 1);
    }

    update(deltaTime: number) {
        this.velocity = this.inputVec.clone().normalize().multiplyScalar(this.speed);

        let scale = this.inputVec.x > 0 ? 1 : (this.inputVec.x < 0 ? -1 : this.sprite.scale.x);

        this.sprite.setScale(scale, 1, 1);

        if (this.velocity.length() > 0) {
            if (!this.anim.getState(this.walkAnim.name).isPlaying) {

                this.anim.stop();
                this.anim.play(this.walkAnim.name);
            }
        }
        else {
            if (!this.anim.getState(this.idleAnim.name).isPlaying) {

                this.anim.stop();
                this.anim.play(this.idleAnim.name);
            }
        }

        this.updatePos();
    }


    updatePos() {

        let x = Math.round(this.node.x + this.velocity.x);

        if (x <= this.minPos.x)
            x = this.maxPos.x - 1;
        else if (x >= this.maxPos.x)
            x = this.minPos.x + 1;

        x = this.clamp(x, this.minPos.x, this.maxPos.x);
        let y = Math.round(this.node.y + this.velocity.y);
        y = this.clamp(y, this.minPos.y, this.maxPos.y);
        let z = Math.round(this.node.z);

        this.node.setPosition(x,y,z);
    }
}


