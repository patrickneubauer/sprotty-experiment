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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
var inversify_1 = require("inversify");
var types_1 = require("../types");
/**
 * Base class for all commands.
 */
var Command = /** @class */ (function () {
    function Command() {
    }
    return Command;
}());
exports.Command = Command;
/**
 * A mergeable command can accumulate subsequent commands of the same kind.
 *
 * For example, multiple subsequent move commands can be merged to yield a
 * single command, such that undo will roll them back altogether. Otherwise
 * the user would have to push CTRL-Z for each mouse move element that
 * resuted in a command.
 */
var MergeableCommand = /** @class */ (function (_super) {
    __extends(MergeableCommand, _super);
    function MergeableCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Tries to merge the given command with this.
     *
     * @param command
     * @param context
     */
    MergeableCommand.prototype.merge = function (command, context) {
        return false;
    };
    return MergeableCommand;
}(Command));
exports.MergeableCommand = MergeableCommand;
/**
 * A hidden command is used to trigger the rendering of a model on a
 * hidden canvas.
 *
 * Some graphical elements are styled using CSS, others have bounds that
 * require to layout their children before being computed. In such cases
 * we cannot tell about the size of elements without acutally rendering
 * the DOM. We render them to an invisible canvas. This can be achieved
 * using hidden commands.
 *
 * Hidden commands do not change the model directly, and are as such
 * neither undoable nor redoable. The command stack does not push them on
 * any stack and forwards the resulting model to the invisible viewer.
 */
var HiddenCommand = /** @class */ (function (_super) {
    __extends(HiddenCommand, _super);
    function HiddenCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HiddenCommand.prototype.undo = function (context) {
        context.logger.error(this, 'Cannot undo a hidden command');
        return context.root;
    };
    HiddenCommand.prototype.redo = function (context) {
        context.logger.error(this, 'Cannot redo a hidden command');
        return context.root;
    };
    return HiddenCommand;
}(Command));
exports.HiddenCommand = HiddenCommand;
var PopupCommand = /** @class */ (function (_super) {
    __extends(PopupCommand, _super);
    function PopupCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return PopupCommand;
}(Command));
exports.PopupCommand = PopupCommand;
/**
 * A system command is triggered by the system, e.g. in order to update bounds
 * in the model with data fetched from the DOM.
 *
 * As it is automatically triggered it should not count as a single command in
 * undo/redo operations. Into the bargain, such an automatic command could occur
 * after an undo and as such make the next redo command invalid because it is
 * based on a model state that has changed. The command stack handles system
 * commands in a special way to overcome these issues.
 */
var SystemCommand = /** @class */ (function (_super) {
    __extends(SystemCommand, _super);
    function SystemCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SystemCommand;
}(Command));
exports.SystemCommand = SystemCommand;
var CommandActionHandler = /** @class */ (function () {
    function CommandActionHandler(commandType) {
        this.commandType = commandType;
    }
    CommandActionHandler.prototype.handle = function (action) {
        return new this.commandType(action);
    };
    return CommandActionHandler;
}());
exports.CommandActionHandler = CommandActionHandler;
var CommandActionHandlerInitializer = /** @class */ (function () {
    function CommandActionHandlerInitializer(commandCtrs) {
        this.commandCtrs = commandCtrs;
    }
    CommandActionHandlerInitializer.prototype.initialize = function (registry) {
        this.commandCtrs.forEach(function (commandCtr) { return registry.registerCommand(commandCtr); });
    };
    CommandActionHandlerInitializer = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.multiInject(types_1.TYPES.ICommand)), __param(0, inversify_1.optional())
    ], CommandActionHandlerInitializer);
    return CommandActionHandlerInitializer;
}());
exports.CommandActionHandlerInitializer = CommandActionHandlerInitializer;
