/**
 * @param imagePath
 * @returns {Promise<HTMLImageElement>}
 */
const loadImage = async (imagePath) => new Promise((resolve, reject) => {
    const image = document.createElement('img');
    image.src = `public/images/${imagePath}.png`;

    const loadHandler = () => {
        image.removeEventListener('load', loadHandler);
        image.removeEventListener('error', errorHandler);

        resolve(image);
    };

    const errorHandler = (event) => {
        image.removeEventListener('load', loadHandler);
        image.removeEventListener('error', errorHandler);

        reject(event);
    };

    image.addEventListener('load', loadHandler);
    image.addEventListener('error', errorHandler);
});

export default loadImage;