import core from 'eev-core';
import dispatcher from 'eev-dispatcher';

const { World, Component, System } = core;
const { Dispatcher } = dispatcher;

class Position extends Component {
    data = {
        x: 0,
        y: 0,
    };

    constructor(attr) {
        super(attr);
        this.data = attr;
    }
}

class Velocity extends Component {
    data = {
        dx: 1.2,
        dy: 1.7,
    };

    constructor(attr) {
        super(attr);
        this.data = attr;
    }
}

class MovementSystem extends System {
    updateCount = 0;
    dependencies = [Position, Velocity];

    run(entities) {
        for (let [_, [position, velocity]] of entities) {
            position.x += velocity.dx;
            position.y += velocity.dy;
            this.updateCount++;
        }
    }
}

export default {
    name: 'eev',
    setup() {
        this.world = new World();

        this.world.register(Position);
        this.world.register(Velocity);

        this.movement = new MovementSystem();
        this.dispatcher = new Dispatcher();
        this.dispatcher.register(this.movement);
    },
    createEntity() {
        return this.world.createEntity();
    },
    addPositionComponent(entity) {
        this.world.applyComponent(new Position({ x: 0, y: 0 }), entity);
    },
    addVelocityComponent(entity) {
        this.world.applyComponent(new Velocity({ dx: 1.2, dy: 1.7 }), entity);
    },
    removePositionComponent(entity) {
        this.world.removeComponent(Position, entity);
    },
    removeVelocityComponent(entity) {
        this.world.removeComponent(Velocity, entity);
    },
    destroyEntity(entity) {
        this.world.removeEntity(entity);
    },
    cleanup() {
        this.world = null;
    },
    updateMovementSystem() {
        this.dispatcher.dispatch(this.world);
    },
    getMovementSystemUpdateCount() {
        return this.movement.updateCount;
    },
};
