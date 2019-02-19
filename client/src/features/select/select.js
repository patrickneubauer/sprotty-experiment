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
var browser_1 = require("../../utils/browser");
var keyboard_1 = require("../../utils/keyboard");
var iterable_1 = require("../../utils/iterable");
var smodel_1 = require("../../base/model/smodel");
var smodel_utils_1 = require("../../base/model/smodel-utils");
var command_1 = require("../../base/commands/command");
var mouse_tool_1 = require("../../base/views/mouse-tool");
var key_tool_1 = require("../../base/views/key-tool");
var vnode_utils_1 = require("../../base/views/vnode-utils");
var button_handler_1 = require("../button/button-handler");
var model_1 = require("../button/model");
var model_2 = require("../edit/model");
var edit_routing_1 = require("../edit/edit-routing");
var model_3 = require("./model");
/**
 * Triggered when the user changes the selection, e.g. by clicking on a selectable element. The resulting
 * SelectCommand changes the `selected` state accordingly, so the elements can be rendered differently.
 * This action is also forwarded to the diagram server, if present, so it may react on the selection change.
 * Furthermore, the server can send such an action to the client in order to change the selection programmatically.
 */
var SelectAction = /** @class */ (function () {
    function SelectAction(selectedElementsIDs, deselectedElementsIDs) {
        if (selectedElementsIDs === void 0) { selectedElementsIDs = []; }
        if (deselectedElementsIDs === void 0) { deselectedElementsIDs = []; }
        this.selectedElementsIDs = selectedElementsIDs;
        this.deselectedElementsIDs = deselectedElementsIDs;
        this.kind = SelectCommand.KIND;
    }
    return SelectAction;
}());
exports.SelectAction = SelectAction;
/**
 * Programmatic action for selecting or deselecting all elements.
 */
var SelectAllAction = /** @class */ (function () {
    /**
     * If `select` is true, all elements are selected, othewise they are deselected.
     */
    function SelectAllAction(select) {
        if (select === void 0) { select = true; }
        this.select = select;
        this.kind = SelectAllCommand.KIND;
    }
    return SelectAllAction;
}());
exports.SelectAllAction = SelectAllAction;
var SelectCommand = /** @class */ (function (_super) {
    __extends(SelectCommand, _super);
    function SelectCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        _this.selected = [];
        _this.deselected = [];
        return _this;
    }
    SelectCommand.prototype.execute = function (context) {
        var _this = this;
        var model = context.root;
        this.action.selectedElementsIDs.forEach(function (id) {
            var element = model.index.getById(id);
            if (element instanceof smodel_1.SChildElement && model_3.isSelectable(element)) {
                _this.selected.push({
                    element: element,
                    parent: element.parent,
                    index: element.parent.children.indexOf(element)
                });
            }
        });
        this.action.deselectedElementsIDs.forEach(function (id) {
            var element = model.index.getById(id);
            if (element instanceof smodel_1.SChildElement && model_3.isSelectable(element)) {
                _this.deselected.push({
                    element: element,
                    parent: element.parent,
                    index: element.parent.children.indexOf(element)
                });
            }
        });
        return this.redo(context);
    };
    SelectCommand.prototype.undo = function (context) {
        for (var i = this.selected.length - 1; i >= 0; --i) {
            var selection = this.selected[i];
            var element = selection.element;
            if (model_3.isSelectable(element))
                element.selected = false;
            selection.parent.move(element, selection.index);
        }
        this.deselected.reverse().forEach(function (selection) {
            if (model_3.isSelectable(selection.element))
                selection.element.selected = true;
        });
        return context.root;
    };
    SelectCommand.prototype.redo = function (context) {
        for (var i = 0; i < this.selected.length; ++i) {
            var selection = this.selected[i];
            var element = selection.element;
            var childrenLength = selection.parent.children.length;
            selection.parent.move(element, childrenLength - 1);
        }
        this.deselected.forEach(function (selection) {
            if (model_3.isSelectable(selection.element))
                selection.element.selected = false;
        });
        this.selected.forEach(function (selection) {
            if (model_3.isSelectable(selection.element))
                selection.element.selected = true;
        });
        return context.root;
    };
    SelectCommand.KIND = 'elementSelected';
    return SelectCommand;
}(command_1.Command));
exports.SelectCommand = SelectCommand;
var SelectAllCommand = /** @class */ (function (_super) {
    __extends(SelectAllCommand, _super);
    function SelectAllCommand(action) {
        var _this = _super.call(this) || this;
        _this.action = action;
        _this.previousSelection = {};
        return _this;
    }
    SelectAllCommand.prototype.execute = function (context) {
        this.selectAll(context.root, this.action.select);
        return context.root;
    };
    SelectAllCommand.prototype.selectAll = function (element, newState) {
        if (model_3.isSelectable(element)) {
            this.previousSelection[element.id] = element.selected;
            element.selected = newState;
        }
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this.selectAll(child, newState);
        }
    };
    SelectAllCommand.prototype.undo = function (context) {
        var index = context.root.index;
        for (var id in this.previousSelection) {
            if (this.previousSelection.hasOwnProperty(id)) {
                var element = index.getById(id);
                if (element !== undefined && model_3.isSelectable(element))
                    element.selected = this.previousSelection[id];
            }
        }
        return context.root;
    };
    SelectAllCommand.prototype.redo = function (context) {
        this.selectAll(context.root, this.action.select);
        return context.root;
    };
    SelectAllCommand.KIND = 'allSelected';
    return SelectAllCommand;
}(command_1.Command));
exports.SelectAllCommand = SelectAllCommand;
var SelectMouseListener = /** @class */ (function (_super) {
    __extends(SelectMouseListener, _super);
    function SelectMouseListener(buttonHandlerRegistry) {
        var _this = _super.call(this) || this;
        _this.buttonHandlerRegistry = buttonHandlerRegistry;
        _this.wasSelected = false;
        _this.hasDragged = false;
        return _this;
    }
    SelectMouseListener.prototype.mouseDown = function (target, event) {
        var result = [];
        if (event.button === 0) {
            if (this.buttonHandlerRegistry !== undefined && target instanceof model_1.SButton && target.enabled) {
                var buttonHandler = this.buttonHandlerRegistry.get(target.type);
                if (buttonHandler !== undefined)
                    return buttonHandler.buttonPressed(target);
            }
            var selectableTarget_1 = smodel_utils_1.findParentByFeature(target, model_3.isSelectable);
            if (selectableTarget_1 !== undefined || target instanceof smodel_1.SModelRoot) {
                this.hasDragged = false;
                var deselect = [];
                // multi-selection?
                if (!browser_1.isCtrlOrCmd(event)) {
                    deselect = iterable_1.toArray(target.root.index.all()
                        .filter(function (element) { return model_3.isSelectable(element) && element.selected
                        && !(selectableTarget_1 instanceof model_2.SRoutingHandle && element === selectableTarget_1.parent); }));
                }
                if (selectableTarget_1 !== undefined) {
                    if (!selectableTarget_1.selected) {
                        this.wasSelected = false;
                        result.push(new SelectAction([selectableTarget_1.id], deselect.map(function (e) { return e.id; })));
                        var routableDeselect = deselect.filter(function (e) { return model_2.isRoutable(e); }).map(function (e) { return e.id; });
                        if (model_2.isRoutable(selectableTarget_1))
                            result.push(new edit_routing_1.SwitchEditModeAction([selectableTarget_1.id], routableDeselect));
                        else if (routableDeselect.length > 0)
                            result.push(new edit_routing_1.SwitchEditModeAction([], routableDeselect));
                    }
                    else if (browser_1.isCtrlOrCmd(event)) {
                        this.wasSelected = false;
                        result.push(new SelectAction([], [selectableTarget_1.id]));
                        if (model_2.isRoutable(selectableTarget_1))
                            result.push(new edit_routing_1.SwitchEditModeAction([], [selectableTarget_1.id]));
                    }
                    else {
                        this.wasSelected = true;
                    }
                }
                else {
                    result.push(new SelectAction([], deselect.map(function (e) { return e.id; })));
                    var routableDeselect = deselect.filter(function (e) { return model_2.isRoutable(e); }).map(function (e) { return e.id; });
                    if (routableDeselect.length > 0)
                        result.push(new edit_routing_1.SwitchEditModeAction([], routableDeselect));
                }
            }
        }
        return result;
    };
    SelectMouseListener.prototype.mouseMove = function (target, event) {
        this.hasDragged = true;
        return [];
    };
    SelectMouseListener.prototype.mouseUp = function (target, event) {
        if (event.button === 0) {
            if (!this.hasDragged) {
                var selectableTarget = smodel_utils_1.findParentByFeature(target, model_3.isSelectable);
                if (selectableTarget !== undefined && this.wasSelected) {
                    return [new SelectAction([selectableTarget.id], [])];
                }
            }
        }
        this.hasDragged = false;
        return [];
    };
    SelectMouseListener.prototype.decorate = function (vnode, element) {
        var selectableTarget = smodel_utils_1.findParentByFeature(element, model_3.isSelectable);
        if (selectableTarget !== undefined)
            vnode_utils_1.setClass(vnode, 'selected', selectableTarget.selected);
        return vnode;
    };
    SelectMouseListener = __decorate([
        __param(0, inversify_1.inject(button_handler_1.ButtonHandlerRegistry)), __param(0, inversify_1.optional())
    ], SelectMouseListener);
    return SelectMouseListener;
}(mouse_tool_1.MouseListener));
exports.SelectMouseListener = SelectMouseListener;
var SelectKeyboardListener = /** @class */ (function (_super) {
    __extends(SelectKeyboardListener, _super);
    function SelectKeyboardListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectKeyboardListener.prototype.keyDown = function (element, event) {
        if (keyboard_1.matchesKeystroke(event, 'KeyA', 'ctrlCmd')) {
            var selected = iterable_1.toArray(element.root.index.all().filter(function (e) { return model_3.isSelectable(e); }).map(function (e) { return e.id; }));
            return [new SelectAction(selected, [])];
        }
        return [];
    };
    return SelectKeyboardListener;
}(key_tool_1.KeyListener));
exports.SelectKeyboardListener = SelectKeyboardListener;
