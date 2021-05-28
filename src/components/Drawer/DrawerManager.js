class DrawerManager {
    refDrawer = null;
    register(ref){
        this.refDrawer = ref;
    }

    unregister(ref){
        this.refDrawer = null;
    }

    getDrawer(){
        return this.refDrawer;
    }
}

export default new DrawerManager();