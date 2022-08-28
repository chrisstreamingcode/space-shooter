import StartScreenScene from "./scenes/StartScreenScene";
import GameScene from "./scenes/GameScene";
import GameOverScene from "./scenes/GameOverScene";
import sceneManager from "./SceneManager";
import contextManager from "./ContextManager";
import { Scenes } from "./constants";

let lastTime = Date.now();

const prepareContext = () => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    contextManager.setContext(context);
}

const addScenes = () => {
    sceneManager.addScene(Scenes.START_SCREEN, new StartScreenScene());
    sceneManager.addScene(Scenes.GAME, new GameScene());
    sceneManager.addScene(Scenes.GAME_OVER, new GameOverScene());
};

const tick = () => {
    const now = Date.now();
    const delta = now - lastTime;
    lastTime = now;

    sceneManager.currentScene.tick(delta / 1000);

    render();

    requestAnimationFrame(tick);
};

const render = () => {
    const context = contextManager.context;

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    sceneManager.currentScene.render(context);
};

(async () => {
    prepareContext();
    addScenes();

    await sceneManager.changeScene(Scenes.START_SCREEN);

    tick();
})()
    .catch(err => console.error('Error', err));