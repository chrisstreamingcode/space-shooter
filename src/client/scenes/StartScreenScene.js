import loadImage from "../utils/loadImage";
import pointHitsRect from "../utils/pointHitsRect";
import Scene from "./Scene";
import contextManager from "../ContextManager";
import sceneManager from "../SceneManager";
import {Scenes} from "../constants";

class StartScreenScene extends Scene {
    background;
    startButton;

    async enter() {
        const { context } = contextManager;
        const { canvas } = context;
        const { width, height } = context.canvas;

        const [startButton, background] = await Promise.all([
            loadImage('start-button'),
            loadImage('background')
        ]);

        this.startButton = startButton;
        this.background = background;

        canvas.addEventListener('click', (event) => {
            if (!pointHitsRect(event.offsetX, event.offsetY, {
                x: width / 2 - startButton.width / 2,
                y: height - startButton.height - 60,
                width: startButton.width, height:
                startButton.height
            })) return;

            sceneManager.changeScene(Scenes.GAME);
        });
    }

    render() {
        const { context } = contextManager;

        this.drawBackground(context);
        this.drawTitle(context);
        this.drawStartButton(context);
    }

    drawBackground(context) {
        const { background } = this;

        context.drawImage(background, 0, 0);
    }

    drawTitle(context) {
        const { width } = context.canvas;

        context.fillStyle = '#0080FF';
        context.strokeStyle = '#FFF';
        context.lineWidth = 2;
        context.font = 'bold 72px Arial, Helvetica, sans-serif';
        context.textBaseline = 'top';
        context.textAlign = 'center';

        context.fillText('Space Shooter', width / 2, 60);
        context.strokeText('Space Shooter', width / 2, 60);
    }

    drawStartButton(context) {
        const { startButton } = this;
        const { width, height } = context.canvas;

        context.drawImage(startButton, width / 2 - startButton.width / 2, height - startButton.height - 60);
    }
}

export default StartScreenScene;