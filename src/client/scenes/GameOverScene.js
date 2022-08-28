import Scene from "./Scene";
import contextManager from "../ContextManager";
import loadImage from "../utils/loadImage";
import pointHitsRect from "../utils/pointHitsRect";
import sceneManager from "../SceneManager";
import {DataKeys, Scenes} from "../constants";
import dataManager from "../DataManager";

class GameOverScene extends Scene {
    background;
    playAgainButton;

    async enter() {
        const { context } = contextManager;
        const { canvas } = context;
        const { width, height } = context.canvas;

        const [playAgainButton, background] = await Promise.all([
            loadImage('play-again'),
            loadImage('background')
        ]);

        this.playAgainButton = playAgainButton;
        this.background = background;

        canvas.addEventListener('click', (event) => {
            if (!pointHitsRect(event.offsetX, event.offsetY, {
                x: width / 2 - playAgainButton.width / 2,
                y: height - playAgainButton.height - 60,
                width: playAgainButton.width, height:
                playAgainButton.height
            })) return;

            sceneManager.changeScene(Scenes.GAME);
        });
    }

    render() {
        const { context } = contextManager;

        this.drawBackground(context);
        this.drawTitle(context);
        this.drawScore(context);
        this.drawPlayAgain(context);
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

        context.fillText('Game Over', width / 2, 60);
        context.strokeText('Game Over', width / 2, 60);
    }

    drawScore(context) {
        const score = dataManager.get(DataKeys.SCORE);

        context.fillStyle = '#FFF';
        context.font = '48px Arial, Helvetica, sans-serif';
        context.textBaseLine = 'middle';
        context.textAlign = 'center';

        context.fillText(`Final Score: ${score}`, context.canvas.width / 2, context.canvas.height / 2 - 50);
    }

    drawPlayAgain(context) {
        const { playAgainButton } = this;
        const { width, height } = context.canvas;

        context.drawImage(playAgainButton, width / 2 - playAgainButton.width / 2, height - playAgainButton.height - 60);
    }
}

export default GameOverScene;