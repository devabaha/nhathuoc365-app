import store from 'app-store';

export const isConfigActive = (key) => {
    const data = store.store_data;
    
    if(data){
        return !!Number(data[key]);
    }
    return false;
}

export const INPUT_ADDRESS_TYPE = {
    ONLY_MAP_ADDRESS: 0,
    ONLY_COMBO_ADDRESS :1,
    ALL_ADDRESS: 2
}