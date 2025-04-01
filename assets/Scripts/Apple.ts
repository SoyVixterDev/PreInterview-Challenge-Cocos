import { _decorator, Animation, BoxCollider, BoxCollider2D, Collider2D, color, Component, Contact2DType, director, instantiate, IPhysics2DContact, Node, Prefab, random, randomRangeInt, RigidBody, RigidBody2D, UITransform, Vec2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Apple')
export class Apple extends Component {
    height: number;
    xPos: number;
    fallSpeed = 20;
    col: BoxCollider2D;

    @property({type: Prefab})
    explosion: Prefab;
    start() {
        this.col = this.getComponent(BoxCollider2D);
        this.col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.respawn();
    }

    xRange = new Vec2(-150, 150);
    y = 100;
    respawn() {
        this.xPos = randomRangeInt(this.xRange.x, this.xRange.y);
        this.height = this.y;
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {

        let explosion = instantiate(this.explosion);
        this.node.parent.addChild(explosion); 

        let worldPos = this.node.getWorldPosition();
        let localPos = this.node.parent.getComponent(UITransform)?.convertToNodeSpaceAR(worldPos) || worldPos;

        explosion.setPosition(localPos);

        this.respawn();
    }

    minY = -100;
    update(deltaTime: number) {

        this.height -= this.fallSpeed * deltaTime
        this.node.setPosition(this.xPos, Math.round(this.height), this.node.position.z);

        if (this.node.position.y <= this.minY) {
            this.respawn();
        }


    }
}


