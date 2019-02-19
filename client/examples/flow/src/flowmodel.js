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
var src_1 = require("../../../src");
var TaskNode = /** @class */ (function (_super) {
    __extends(TaskNode, _super);
    function TaskNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '';
        return _this;
    }
    TaskNode.prototype.hasFeature = function (feature) {
        if (feature === src_1.moveFeature)
            return false;
        else
            return _super.prototype.hasFeature.call(this, feature);
    };
    return TaskNode;
}(src_1.CircularNode));
exports.TaskNode = TaskNode;
var BarrierNode = /** @class */ (function (_super) {
    __extends(BarrierNode, _super);
    function BarrierNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = '';
        _this.bounds = { x: 0, y: 0, width: 50, height: 20 };
        return _this;
    }
    BarrierNode.prototype.hasFeature = function (feature) {
        if (feature === src_1.moveFeature)
            return false;
        else
            return _super.prototype.hasFeature.call(this, feature);
    };
    return BarrierNode;
}(src_1.RectangularNode));
exports.BarrierNode = BarrierNode;
