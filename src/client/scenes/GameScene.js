import Scene from "./Scene";
import loadImage from "../utils/loadImage";
import inputManager from "../InputManager";
import contextManager from "../ContextManager";
import {DataKeys, InputKeys, Scenes} from "../constants";
import clamp from "../utils/clamp";
import padBefore from "../utils/padBefore";
import rectHitRect from "../utils/rectHitRect";
import sceneManager from "../SceneManager";
import dataManager from "../DataManager";

const MAX_HEALTH = 6;

const BULLET_SPEED = 300; // px /s
const BULLET_RATE_OF_FIRE = 3; // per s
const BULLET_FASTER_RATE_OF_FIRE = 6; // per s

const BACKGROUND_SPEED = 100; // px / s

const ENEMY_SPEED = 200; // px /s
const ENEMY_SPEED_VARIABILITY = 300; // px / s
const ENEMY_SPAWN_RATE = 1; // per s
const ENEMY_SPAWN_VARIABILITY = 300; // px

const POWER_UP_LIFESPAN = 5000; // ms
const POWER_UP_SPAWN_RATE = 1 / 10; // per s
const POWER_UP_SPAWN_VARIABILITY = 1 / 10; // px

const FASTER_RATE_OF_FIRE_DURATION = 10000; // ms

const POINTS_PER_POWER_UP = 500; // per power-up
const POINTS_PER_ENEMY = 50; // per enemy

const PowerUps = {
    HEALTH: 'health',
    RATE_OF_FIRE: 'rate-of-fire'
};

class GameScene extends Scene {
    score;
    images;
    backgroundY;
    ship;
    bullets;
    enemies;
    powerUps;
    lastFired;
    lastSpawn;
    lastPowerUp;
    fasterRateOfFire;
    fasterRateOfFireStart;

    async enter() {
        const { canvas } = contextManager.context;

        await this.loadImages();

        const { ship } = this.images;

        Object.assign(
            this,
            {
                score: 0,
                backgroundY: 0,
                ship: {
                    x: canvas.width / 2 - ship.width / 2,
                    y: canvas.height - ship.height - 20,
                    width: ship.width,
                    height: ship.height,
                    lives: 4
                },
                bullets: [],
                enemies: [],
                powerUps: [],
                lastFired: 0,
                lastSpawn: 0,
                lastPowerUp: Date.now(),
                fasterRateOfFire: false,
                fasterRateOfFireStart: 0
        });
    }

    async loadImages() {
        if (this.images) return;

        const [
            background,
            battery,
            enemy,
            health,
            heart,
            laser,
            ship
        ] = await Promise.all([
            'background',
            'battery',
            'enemy',
            'health',
            'heart',
            'laser',
            'ship'
        ].map(loadImage));

        this.images = {
            background,
            battery,
            enemy,
            health,
            heart,
            laser,
            ship
        };
    }

    tick(delta) {
        this.fire();
        this.spawnEnemy();
        this.spawnPowerUp();

        this.updateBackground(delta);
        this.updateShip(delta);
        this.updateBullets(delta);
        this.updateEnemies(delta);

        this.checkCollisions();
        this.cleanUp();

        if (this.ship.lives <= 0) {
            dataManager.set(DataKeys.SCORE, this.score);

            // noinspection JSIgnoredPromiseFromCall
            sceneManager.changeScene(Scenes.GAME_OVER);
        }
    }

    fire() {
        const { bullets, lastFired, ship, fasterRateOfFire, images: { laser } } = this;
        const now = Date.now();

        if (!inputManager.isKeyDown(InputKeys.FIRE)
            || now - lastFired < 1000 / (fasterRateOfFire ? BULLET_FASTER_RATE_OF_FIRE : BULLET_RATE_OF_FIRE)) {
            return;
        }

        const bullet = {
            x: ship.x + (ship.width / 2) - (laser.width / 2),
            y: ship.y,
            width: laser.width,
            height: laser.height
        };

        bullets.push(bullet);

        this.lastFired = now;
    }

    spawnEnemy() {
        const { lastSpawn, images: { enemy: enemyImage } } = this;
        const now = Date.now();
        const { canvas } = contextManager.context;

        if (now - lastSpawn < 1000 / ENEMY_SPAWN_RATE) return;

        const enemy = {
            x: Math.floor(Math.random() * (canvas.width - enemyImage.width)),
            y: -enemyImage.height - Math.floor(Math.random() * ENEMY_SPAWN_VARIABILITY),
            width: enemyImage.width,
            height: enemyImage.height,
            speed: ENEMY_SPEED + Math.floor(Math.random() * ENEMY_SPEED_VARIABILITY)
        };

        this.enemies.push(enemy);
        this.lastSpawn = now;
    }

    spawnPowerUp() {
        const { powerUps, lastPowerUp, images: { health, battery } } = this;
        const now = Date.now();
        const { canvas } = contextManager.context;

        if (now - lastPowerUp < 1000 / (POWER_UP_SPAWN_RATE + (Math.random() * POWER_UP_SPAWN_VARIABILITY))) return;

        let powerUp;

        if (Math.floor(Math.random() * 2) === 0) { // health
            powerUp = {
                type: PowerUps.HEALTH,
                image: health,
                x: Math.floor(Math.random() * (canvas.width - health.width)),
                y: Math.floor(Math.random() * ((canvas.height / 2) - health.height)) + (canvas.height / 2),
                width: health.width,
                height: health.height,
                spawned: now
            };
        } else { // rate of fire
            powerUp = {
                type: PowerUps.RATE_OF_FIRE,
                image: battery,
                x: Math.floor(Math.random() * (canvas.width - battery.width)),
                y: Math.floor(Math.random() * ((canvas.height / 2) - battery.height)) + (canvas.height / 2),
                width: battery.width,
                height: battery.height,
                spawned: now
            };
        }

        powerUps.push(powerUp);
        this.lastPowerUp = now;
    }

    updateBackground(delta) {
        const { background } = this.images;

        this.backgroundY += delta * BACKGROUND_SPEED;
        this.backgroundY %= background.height;
    }

    updateShip() {
        const { ship } = this;
        const { canvas } = contextManager.context;

        if (inputManager.isKeyDown(InputKeys.MOVE_LEFT)) {
            ship.x -= 3;
        }

        if (inputManager.isKeyDown(InputKeys.MOVE_RIGHT)) {
            ship.x += 3;
        }

        if (inputManager.isKeyDown(InputKeys.MOVE_UP)) {
            ship.y -= 3;
        }

        if (inputManager.isKeyDown(InputKeys.MOVE_DOWN)) {
            ship.y += 3;
        }

        ship.x = clamp(ship.x, 0, canvas.width - ship.width);
        ship.y = clamp(ship.y, canvas.height / 2, canvas.height - ship.height);
    }

    updateBullets(delta) {
        const { bullets } = this;

        bullets.forEach(bullet => {
            bullet.y -= BULLET_SPEED * delta;
        });
    }

    updateEnemies(delta) {
        const { enemies } = this;

        enemies.forEach(enemy => {
            enemy.y += delta * enemy.speed
        });
    }

    checkCollisions() {
        this.checkPowerUpCollisions();
        this.checkEnemyCollisions();
        this.checkBulletCollisions();
    }

    checkPowerUpCollisions() {
        const { ship, powerUps } = this;

        powerUps.forEach(powerUp => {
            if (!rectHitRect(powerUp, ship)) return;

            if (powerUp.type === PowerUps.HEALTH) {
                ship.lives = Math.min(ship.lives + 1, MAX_HEALTH);
            } else {
                this.fasterRateOfFire = true;
                this.fasterRateOfFireStart = Date.now();
            }

            powerUp.destroyed = true;
        });
    }

    checkEnemyCollisions() {
        const { enemies, ship, bullets } = this;
        const { canvas } = contextManager.context;

        enemies.forEach(enemy => {
            bullets.forEach(bullet => {
                if (bullet.destroyed
                    || enemy.destroyed
                    || !rectHitRect(bullet, enemy)) {
                    return;
                }

                bullet.destroyed = true;
                enemy.destroyed = true;
                this.score += POINTS_PER_ENEMY;
            });

            if (!enemy.destroyed && rectHitRect(ship, enemy)) {
                enemy.destroyed = true;
                ship.lives--;
            }

            if (enemy.y >= canvas.height) {
                enemy.destroyed = true;
            }
        });
    }

    checkBulletCollisions() {
        const { bullets } = this;

        bullets.forEach(bullet => {
            if (bullet.y - bullet.height <= 0) {
                bullet.destroyed = true;
            }
        });
    }

    cleanUp() {
        const { enemies, bullets, powerUps } = this;
        const now = Date.now();

        this.powerUps = powerUps.filter(powerUp =>
            !powerUp.destroyed
                && now - powerUp.spawned <= POWER_UP_LIFESPAN
        );

        this.enemies = enemies.filter(enemy => !enemy.destroyed);
        this.bullets = bullets.filter(bullet => !bullet.destroyed);

        if (now - this.fasterRateOfFireStart >= FASTER_RATE_OF_FIRE_DURATION) {
            this.fasterRateOfFire = false;
        }
    }

    render() {
        const { context } = contextManager;

        this.drawBackground(context);
        this.drawBullets(context);
        this.drawEnemies(context);
        this.drawPowerUps(context);
        this.drawShip(context);
        this.drawLives(context);
        this.drawScore(context);
    }

    drawBackground(context) {
        const { backgroundY, images: { background } } = this;

        context.drawImage(background, 0, backgroundY);
        context.drawImage(background, 0, backgroundY - background.height);
    }

    drawBullets(context) {
        const { bullets, images: { laser } } = this;

        bullets.forEach(bullet => {
            context.drawImage(laser, bullet.x, bullet.y);
        });
    }

    drawEnemies(context) {
        const { enemies, images: { enemy: enemyImage } } = this;

        enemies.forEach(enemy => {
            context.drawImage(enemyImage, enemy.x, enemy.y);
        });
    }

    drawPowerUps(context) {
        const { powerUps } = this;

        powerUps.forEach(powerUp => {
            context.drawImage(powerUp.image, powerUp.x, powerUp.y);
        });
    }

    drawShip(context) {
        const { ship, images: { ship: shipImage } } = this;

        context.drawImage(shipImage, ship.x, ship.y);
    }

    drawLives(context) {
        const { ship, images: { heart } } = this;

        for (let i = 0; i < ship.lives; i++) {
            context.drawImage(heart, 10 + (i * heart.width * .8), 10, heart.width * .8, heart.height * .8);
        }
    }

    drawScore(context) {
        const { score } = this;

        context.fillStyle = '#FFF';
        context.textAlign = 'center';
        context.textBaseline = 'top';
        context.font = '40px Arial, Helvetica, sans-serif';

        context.fillText(padBefore(score, 10, '0'), context.canvas.width / 2, 10);
    }
}

export default GameScene;