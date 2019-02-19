"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var keyboard_1 = require("../../utils/keyboard");
var key_tool_1 = require("../../base/views/key-tool");
var UndoAction = /** @class */ (function () {
    function UndoAction() {
        this.kind = UndoAction.KIND;
    }
    UndoAction.KIND = 'undo';
    return UndoAction;
}());
exports.UndoAction = UndoAction;
var RedoAction = /** @class */ (function () {
    function RedoAction() {
        this.kind = RedoAction.KIND;
    }
    RedoAction.KIND = 'redo';
    return RedoAction;
}());
exports.RedoAction = RedoAction;
var UndoRedoKeyListener = /** @class */ (function (_super) {
    __extends(UndoRedoKeyListener, _super);
    function UndoRedoKeyListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UndoRedoKeyListener.prototype.keyDown = function (element, event) {
        if (keyboard_1.matchesKeystroke(event, 'KeyZ', 'ctrlCmd'))
            return [new UndoAction];
        if (keyboard_1.matchesKeystroke(event, 'KeyZ', 'ctrlCmd', 'shift'))
            return [new RedoAction];
        return [];
    };
    return UndoRedoKeyListener;
}(key_tool_1.KeyListener));
exports.UndoRedoKeyListener = UndoRedoKeyListener;
