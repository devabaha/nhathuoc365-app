import store from 'app-store';

export const isConfigActive = (key) => {
    const data = store.store_data;
    
    if(data){
        return !!Number(data[key]);
    }
    return false;
}