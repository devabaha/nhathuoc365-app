import  handleSaveSingleImage  from "./handleSaveSingleImage";
const handleSaveAllImage = (arrURL, callback = () => {}, dD = () => {}) => {
    arrURL.map((item, index) => {
        handleSaveSingleImage(item.url, () => {}, true).then(() => console.log(`download xong anh ${index}`)).catch(err => console.log(err));
        callback(index);
    })
    dD('done')
}
export {handleSaveAllImage};