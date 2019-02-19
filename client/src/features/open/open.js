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
var mouse_tool_1 = require("../../base/views/mouse-tool");
var smodel_utils_1 = require("../../base/model/smodel-utils");
var model_1 = require("./model");
var OpenAction = /** @class */ (function () {
    function OpenAction(elementId) {
        this.elementId = elementId;
        this.kind = OpenAction.KIND;
    }
    OpenAction.KIND = 'open';
    return OpenAction;
}());
exports.OpenAction = OpenAction;
var OpenMouseListener = /** @class */ (function (_super) {
    __extends(OpenMouseListener, _super);
    function OpenMouseListener() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OpenMouseListener.prototype.doubleClick = function (target, event) {
        var openableTarget = smodel_utils_1.findParentByFeature(target, model_1.isOpenable);
        if (openableTarget !== undefined) {
            return [new OpenAction(openableTarget.id)];
        }
        return [];
    };
    return OpenMouseListener;
}(mouse_tool_1.MouseListener));
exports.OpenMouseListener = OpenMouseListener;
