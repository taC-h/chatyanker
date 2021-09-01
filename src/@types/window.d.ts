import { IpcRendererEvent } from "electron";
import { ipcMsg } from "../lib/com"

interface mainWindow {
    listener: (event: IpcRendererEvent, msg: Msg<ipcMsg, keyof ipcMsg>) => void,
}

declare global {
    interface Window {
        mainWindow: mainWindow
    }
}
