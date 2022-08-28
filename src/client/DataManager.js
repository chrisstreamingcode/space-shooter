class DataManager {
    data = {};

    set(key, value) {
        this.data[key] = value;
    }

    get(key) {
        return this.data[key];
    }
}

const dataManager = new DataManager();

export default dataManager;