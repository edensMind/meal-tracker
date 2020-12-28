

const imagePath = '/public/img';
const defaultImage = `${imagePath}/default/default.png`;
const GetImage = (imageValue) => {
    if(imageValue) {
        const fullImagePath = `${imagePath}/${imageValue}`;
        return fullImagePath;
    }
    else {
        return defaultImage;
    }
    
    
}

//Exports
export { 
    GetImage,
};