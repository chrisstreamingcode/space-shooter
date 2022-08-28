class SceneManager {
    scenes = {};
    currentScene;

    addScene(name, scene) {
        const { scenes } = this;

        scenes[name] = scene;
    }

    async changeScene(name) {
        const { scenes, currentScene } = this;

        const nextScene = scenes[name];

        await Promise.all([
          currentScene && currentScene.leave(),
          nextScene.enter()
        ].filter(Boolean));

        this.currentScene = nextScene;
    }
}

const sceneManager = new SceneManager();

export default sceneManager;