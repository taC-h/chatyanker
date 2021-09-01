import { app, globalShortcut, Tray, Menu, dialog } from 'electron';
import * as path from 'path';
import { format as formatUrl } from 'url';
import MainStack from "./lib/stack";

let tray: Tray | null = null;

const mainStack = new MainStack(
    formatUrl({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }),
    { webPreferences: { preload: path.join(__dirname, 'preloader/pl_main.js') } },
);

function createTray(){
    tray = new Tray(path.join(__dirname, "assets", "icon.ico"));
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: "hello world",
            click() {
                dialog.showMessageBoxSync({
                    title: "chatyanker",
                    message: "hello world",
                    detail: "detail",
                });
            }
        },
        {
            type: "separator",
        },
        {
            label: "quit",
            role: "quit"
        }
    ]));
}

function registerShortcut() {
    globalShortcut.register("Alt+CommandOrControl+I", () => {
        console.log("Alt+CommandOrControl+I");
        mainStack.window.webContents.send("dbg", {
            msg: "msg"
        });
        navigator.clipboard.readText().then(text=>console.log(text));
    });
    globalShortcut.register("CommandOrControl+Up",() => mainStack.up());
    globalShortcut.register("CommandOrControl+Down",() => mainStack.down());
}

app.on("window-all-closed", () => {})

app.whenReady().then(() => {
    registerShortcut();
    createTray();
}).then(() => {
    mainStack.newWindow();
});
