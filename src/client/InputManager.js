class InputManager {
    keysDown = [];

    constructor() {
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }

    handleKeyDown = (event) => {
        const { keysDown } = this;

        if (this.isKeyDown(event.code)) return;

        keysDown.push(event.code);
    };

    handleKeyUp = (event) => {
        const { keysDown } = this;
        const index = keysDown.indexOf(event.code);

        if (index === -1) return;

        keysDown.splice(index, 1);
    };

    isKeyDown = (code) => {
        const { keysDown } = this;

        return keysDown.includes(code);
    }
}

const inputManager = new InputManager();

export default inputManager;