import store from 'app-store';

export const isConfigActive = (key) => {
    const data = store.store_data;
    if(data){
        return !!data[key];
    }
    return false;
}