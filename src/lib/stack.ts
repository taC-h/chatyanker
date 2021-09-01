import { KeyShortCut, Stack, msg, ipcMsg } from "./com"
import Electron from "electron"
import { getForegroundWindow, setForegroundWindow, sendKey, key, VK_CONTROL} from "./native";

export default class MainStack implements KeyShortCut, Stack {
    _window: Electron.BrowserWindow | null;
    pointer: number;
    texts: string[];
    inFocus: boolean;
    constructor(
        public url: string,
        public windowOption?: Electron.BrowserWindowConstructorOptions | undefined,
        public renderOption?: Electron.LoadURLOptions | undefined,
    ) {
        this.pointer = 0;
        this.texts = [];
        this._window = null;
        this.inFocus = false;
    }
    get window(): Electron.BrowserWindow {
        return this._window ?? this.newWindow();
    }
    newWindow() {
        if (this._window) return this._window;
        const hwnd = getForegroundWindow();
        const window = new Electron.BrowserWindow(this.windowOption);
        this._window = window;
        window.loadURL(this.url, this.renderOption).then(() => {
            setForegroundWindow(hwnd);
            const {pointer, texts} = this;
            this.send("sync", {pointer, texts});
        });
        window.on("closed", () => {
            this._window = null;
        });
        return window;
    }
    send<K extends keyof ipcMsg>(request: K, data: ipcMsg[K]) {
        this.window.webContents.send("mainWindow", msg(request, data));
    }
    up() {
        //TODO: impliments
    }
    down() {
        //TODO: impliments
        sendKey([VK_CONTROL, key("A"), key("X")]);
        navigator.clipboard.readText().then(text=>{
            this.texts.push(text);
        });
    }
    enter() {
        //TODO: impliments
        this.send("del", undefined);
        this.inFocus = false;
    }
}
