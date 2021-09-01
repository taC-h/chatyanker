import { Recipient, ipcMsg } from "../com";


function createCell(text: string): HTMLElement {
    const elm = document.createElement("div");
    elm.innerText = text;
    return elm;
}


/**
 * elementid has to exists
 */
export default class ClientStack implements Recipient<ipcMsg> {
    root: HTMLElement;
    pointer: number;
    constructor(elementid: string) {
        this.root = document.getElementById(elementid) as HTMLElement;
        this.pointer = 0;
    }
    get length() { return this.root.children.length; }

    point(pointer: ipcMsg["point"]){ this.pointer = pointer; }
    del(_: ipcMsg["del"]) {
        if(!this.pointer) return console.warn("del no obj");
        this.root.children[this.pointer - 1].remove();
        this.pointer = this.length;
    }
    push(text: ipcMsg["push"]) {
        //TODO: implements
        const p = this.length;
        this.root.appendChild(createCell(text));
        this.pointer++;
    }
    sync(data: ipcMsg["sync"]) {
        this.root.innerHTML = "";
        for(const t of data.texts){
            this.root.appendChild(createCell(t));
        }
        this.pointer = data.pointer;
    }
}
