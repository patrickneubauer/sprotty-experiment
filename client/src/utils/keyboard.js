"use strict";
/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var browser_1 = require("./browser");
/**
 * Returns whether the keyboard event matches the keystroke described by the given
 * code and modifiers. The code must comply to the format of the `code` property
 * of KeyboardEvent, but in contrast to that property, the actual keyboard layout is
 * considered by this function if possible.
 */
function matchesKeystroke(event, code) {
    var modifiers = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        modifiers[_i - 2] = arguments[_i];
    }
    if (getActualCode(event) !== code)
        return false;
    if (browser_1.isMac()) {
        if (event.ctrlKey !== (modifiers.findIndex(function (m) { return m === 'ctrl'; }) >= 0))
            return false;
        if (event.metaKey !== (modifiers.findIndex(function (m) { return m === 'meta' || m === 'ctrlCmd'; }) >= 0))
            return false;
    }
    else {
        if (event.ctrlKey !== (modifiers.findIndex(function (m) { return m === 'ctrl' || m === 'ctrlCmd'; }) >= 0))
            return false;
        if (event.metaKey !== (modifiers.findIndex(function (m) { return m === 'meta'; }) >= 0))
            return false;
    }
    if (event.altKey !== (modifiers.findIndex(function (m) { return m === 'alt'; }) >= 0))
        return false;
    if (event.shiftKey !== (modifiers.findIndex(function (m) { return m === 'shift'; }) >= 0))
        return false;
    return true;
}
exports.matchesKeystroke = matchesKeystroke;
/**
 * Determines a key code from the given event. This is necessary because the `code` property of
 * a KeyboardEvent does not consider keyboard layouts.
 */
function getActualCode(event) {
    if (event.keyCode) {
        var result = STRING_CODE[event.keyCode];
        if (result !== undefined)
            return result;
    }
    return event.code;
}
exports.getActualCode = getActualCode;
var STRING_CODE = new Array(256);
(function () {
    function addKeyCode(stringCode, numericCode) {
        if (STRING_CODE[numericCode] === undefined)
            STRING_CODE[numericCode] = stringCode;
    }
    addKeyCode('Pause', 3);
    addKeyCode('Backspace', 8);
    addKeyCode('Tab', 9);
    addKeyCode('Enter', 13);
    addKeyCode('ShiftLeft', 16);
    addKeyCode('ShiftRight', 16);
    addKeyCode('ControlLeft', 17);
    addKeyCode('ControlRight', 17);
    addKeyCode('AltLeft', 18);
    addKeyCode('AltRight', 18);
    addKeyCode('CapsLock', 20);
    addKeyCode('Escape', 27);
    addKeyCode('Space', 32);
    addKeyCode('PageUp', 33);
    addKeyCode('PageDown', 34);
    addKeyCode('End', 35);
    addKeyCode('Home', 36);
    addKeyCode('ArrowLeft', 37);
    addKeyCode('ArrowUp', 38);
    addKeyCode('ArrowRight', 39);
    addKeyCode('ArrowDown', 40);
    addKeyCode('Insert', 45);
    addKeyCode('Delete', 46);
    addKeyCode('Digit1', 49);
    addKeyCode('Digit2', 50);
    addKeyCode('Digit3', 51);
    addKeyCode('Digit4', 52);
    addKeyCode('Digit5', 53);
    addKeyCode('Digit6', 54);
    addKeyCode('Digit7', 55);
    addKeyCode('Digit8', 56);
    addKeyCode('Digit9', 57);
    addKeyCode('Digit0', 48);
    addKeyCode('KeyA', 65);
    addKeyCode('KeyB', 66);
    addKeyCode('KeyC', 67);
    addKeyCode('KeyD', 68);
    addKeyCode('KeyE', 69);
    addKeyCode('KeyF', 70);
    addKeyCode('KeyG', 71);
    addKeyCode('KeyH', 72);
    addKeyCode('KeyI', 73);
    addKeyCode('KeyJ', 74);
    addKeyCode('KeyK', 75);
    addKeyCode('KeyL', 76);
    addKeyCode('KeyM', 77);
    addKeyCode('KeyN', 78);
    addKeyCode('KeyO', 79);
    addKeyCode('KeyP', 80);
    addKeyCode('KeyQ', 81);
    addKeyCode('KeyR', 82);
    addKeyCode('KeyS', 83);
    addKeyCode('KeyT', 84);
    addKeyCode('KeyU', 85);
    addKeyCode('KeyV', 86);
    addKeyCode('KeyW', 87);
    addKeyCode('KeyX', 88);
    addKeyCode('KeyY', 89);
    addKeyCode('KeyZ', 90);
    addKeyCode('OSLeft', 91);
    addKeyCode('MetaLeft', 91);
    addKeyCode('OSRight', 92);
    addKeyCode('MetaRight', 92);
    addKeyCode('ContextMenu', 93);
    addKeyCode('Numpad0', 96);
    addKeyCode('Numpad1', 97);
    addKeyCode('Numpad2', 98);
    addKeyCode('Numpad3', 99);
    addKeyCode('Numpad4', 100);
    addKeyCode('Numpad5', 101);
    addKeyCode('Numpad6', 102);
    addKeyCode('Numpad7', 103);
    addKeyCode('Numpad8', 104);
    addKeyCode('Numpad9', 105);
    addKeyCode('NumpadMultiply', 106);
    addKeyCode('NumpadAdd', 107);
    addKeyCode('NumpadSeparator', 108);
    addKeyCode('NumpadSubtract', 109);
    addKeyCode('NumpadDecimal', 110);
    addKeyCode('NumpadDivide', 111);
    addKeyCode('F1', 112);
    addKeyCode('F2', 113);
    addKeyCode('F3', 114);
    addKeyCode('F4', 115);
    addKeyCode('F5', 116);
    addKeyCode('F6', 117);
    addKeyCode('F7', 118);
    addKeyCode('F8', 119);
    addKeyCode('F9', 120);
    addKeyCode('F10', 121);
    addKeyCode('F11', 122);
    addKeyCode('F12', 123);
    addKeyCode('F13', 124);
    addKeyCode('F14', 125);
    addKeyCode('F15', 126);
    addKeyCode('F16', 127);
    addKeyCode('F17', 128);
    addKeyCode('F18', 129);
    addKeyCode('F19', 130);
    addKeyCode('F20', 131);
    addKeyCode('F21', 132);
    addKeyCode('F22', 133);
    addKeyCode('F23', 134);
    addKeyCode('F24', 135);
    addKeyCode('NumLock', 144);
    addKeyCode('ScrollLock', 145);
    addKeyCode('Semicolon', 186);
    addKeyCode('Equal', 187);
    addKeyCode('Comma', 188);
    addKeyCode('Minus', 189);
    addKeyCode('Period', 190);
    addKeyCode('Slash', 191);
    addKeyCode('Backquote', 192);
    addKeyCode('IntlRo', 193);
    addKeyCode('BracketLeft', 219);
    addKeyCode('Backslash', 220);
    addKeyCode('BracketRight', 221);
    addKeyCode('Quote', 222);
    addKeyCode('IntlYen', 255);
})();
