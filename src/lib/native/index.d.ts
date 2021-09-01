declare export interface Hwnd {};
declare export type vk = number;
declare export type keyChar =
    "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" |
    "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" |
    "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" |
    "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
declare export function getForegroundWindow(): Hwnd;
declare export function setForegroundWindow(hwnd: Hwnd): boolean;
declare export function getWindowText(hwnd: Hwnd): string;
declare export function key(s: keyChar): vk;
declare export function sendKey(s: vk[]): void;
declare export const VK_LEFT: vk;
declare export const VK_UP: vk;
declare export const VK_RIGHT: vk;
declare export const VK_DOWN: vk;
declare export const VK_RETURN: vk;
declare export const VK_CONTROL: vk;
declare export const VK_SHIFT: vk;
