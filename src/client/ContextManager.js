class ContextManager {
    context;

    setContext(context) {
        this.context = context;
    }
}

const contextManager = new ContextManager();

export default contextManager;