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
var model_1 = require("../bounds/model");
var model_2 = require("../fade/model");
var SButton = /** @class */ (function (_super) {
    __extends(SButton, _super);
    function SButton() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.enabled = true;
        return _this;
    }
    SButton.prototype.hasFeature = function (feature) {
        return feature === model_1.boundsFeature || feature === model_2.fadeFeature || feature === model_1.layoutableChildFeature;
    };
    return SButton;
}(model_1.SShapeElement));
exports.SButton = SButton;
