/*
https://github.com/gabrielecirulli/2048/blob/master/js/local_storage_manager.js
*/

class FakeStorage {
    constructor() {
        this.data = {};
    }

    setItem(id, val) {
        this.data[id] = String(val);
    }

    getItem(id) {
        return Object.prototype.hasOwnProperty.call(this.data, id) ? this.data[id] : undefined;
    }
}

export default class LocalStorage {
    constructor() {
        const supported = LocalStorage.localStorageSupported();
        this.storage = supported ? window.localStorage : new FakeStorage();
    }

    static localStorageSupported() {
        try {
            const testKey = "test";
            const storage = window.localStorage;
            storage.setItem(testKey, "1");
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Best score getters/setters
    getBestScore(id) {
        return this.storage.getItem(id) || 0;
    }

    setBestScore(id, score) {
        const current = parseInt(this.getBestScore(id), 10);
        if (!current || score < current) {
            this.storage.setItem(id, score);
        }
    }
}
