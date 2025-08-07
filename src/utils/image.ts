export function WaitImgByFile(file : File) : Promise < HTMLImageElement > {
    return new Promise((resolv, reject) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => resolv(img);
        img.onerror = reject;
    });
}

export function ImageToString(img : HTMLImageElement) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    if(!ctx) 
        return null;

    ctx.drawImage(img, 0, 0);

    return canvas.toDataURL();
}