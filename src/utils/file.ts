export function DownloadTextFile(content : string, name : string) {
    const blob = new Blob([content], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

export function IsFilenameFormat(format : string[], filename : string) {
    const filenameSplit = filename.split(".");
    return format.includes(filenameSplit[filenameSplit.length - 1]);
}