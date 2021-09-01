import { ipcRenderer, contextBridge, IpcRendererEvent } from "electron";
import Stack from "../lib/client/stack";
import { Msg, messageHandler, ipcMsg } from "../lib/com"

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector: any, text: any) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }
})

ipcRenderer.on("dbg", (_event: IpcRendererEvent, arg: any) => {
    console.log(arg);
})

const stack = new Stack("root");
ipcRenderer.on("mainWindow", (_event: IpcRendererEvent, msg: Msg<ipcMsg, keyof ipcMsg>) => {
    messageHandler(msg, stack);
});

const navi = document.getElementById("navi") as HTMLDivElement;
//TODO: フロントエンドをVueでの実装に変更
const resetButton = document.createElement("button");
resetButton.onclick = () => {
    ipcRenderer.send("mainProcess", {});
};
const reloadButton = document.createElement("button");
reloadButton.onclick = () => {
    ipcRenderer.send("mainProcess", {});
};

[resetButton, reloadButton]
    .forEach(b => navi.appendChild(b));


/**
 * declared in src/@types/window.d.ts
 */
contextBridge.exposeInMainWorld(
    "mainWindow", {
        on: (listener: (event: IpcRendererEvent, msg: Msg<ipcMsg, keyof ipcMsg>) => void)=>ipcRenderer.on("mainWindow", listener),
    }
);
