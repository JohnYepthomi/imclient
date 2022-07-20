class StorageLocal{
	static setItem(key, value){
		localStorage.setItem(key, value);
	}

	static getItem(key){
		return localStorage.getItem(key);	
	}

	static stringifyItem(key, value){
		localStorage.setItem(key, JSON.stringify(value));
	}

	static parseItem(key){
		return JSON.parse(localStorage.getItem(key));
	}
}

export default StorageLocal;