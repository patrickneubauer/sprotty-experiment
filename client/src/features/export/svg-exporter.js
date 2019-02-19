"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
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
var model_1 = require("../bounds/model");
var types_1 = require("../../base/types");
var geometry_1 = require("../../utils/geometry");
var inversify_1 = require("inversify");
var ExportSvgAction = /** @class */ (function () {
    function ExportSvgAction(svg) {
        this.svg = svg;
        this.kind = ExportSvgAction.KIND;
    }
    ExportSvgAction.KIND = 'exportSvg';
    return ExportSvgAction;
}());
exports.ExportSvgAction = ExportSvgAction;
var SvgExporter = /** @class */ (function () {
    function SvgExporter(options, actionDispatcher, log) {
        this.options = options;
        this.actionDispatcher = actionDispatcher;
        this.log = log;
    }
    SvgExporter.prototype["export"] = function (root) {
        if (typeof document !== 'undefined') {
            var div = document.getElementById(this.options.hiddenDiv);
            if (div !== null && div.firstElementChild && div.firstElementChild.tagName === 'svg') {
                var svgElement = div.firstElementChild;
                var svg = this.createSvg(svgElement, root);
                this.actionDispatcher.dispatch(new ExportSvgAction(svg));
            }
        }
    };
    SvgExporter.prototype.createSvg = function (svgElementOrig, root) {
        var serializer = new XMLSerializer();
        var svgCopy = serializer.serializeToString(svgElementOrig);
        var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        if (!iframe.contentWindow)
            throw new Error('IFrame has no contentWindow');
        var docCopy = iframe.contentWindow.document;
        docCopy.open();
        docCopy.write(svgCopy);
        docCopy.close();
        var svgElementNew = docCopy.getElementById(svgElementOrig.id);
        svgElementNew.removeAttribute('opacity');
        this.copyStyles(svgElementOrig, svgElementNew, ['width', 'height', 'opacity']);
        svgElementNew.setAttribute('version', '1.1');
        var bounds = this.getBounds(root);
        svgElementNew.setAttribute('viewBox', bounds.x + " " + bounds.y + " " + bounds.width + " " + bounds.height);
        var svgCode = serializer.serializeToString(svgElementNew);
        document.body.removeChild(iframe);
        return svgCode;
    };
    SvgExporter.prototype.copyStyles = function (source, target, skipedProperties) {
        var sourceStyle = getComputedStyle(source);
        var targetStyle = getComputedStyle(target);
        var diffStyle = '';
        for (var i = 0; i < sourceStyle.length; i++) {
            var key = sourceStyle[i];
            if (skipedProperties.indexOf(key) === -1) {
                var value = sourceStyle.getPropertyValue(key);
                if (targetStyle.getPropertyValue(key) !== value) {
                    diffStyle += key + ":" + value + ";";
                }
            }
        }
        if (diffStyle !== '')
            target.setAttribute('style', diffStyle);
        // IE doesn't retrun anything on source.children
        for (var i = 0; i < source.childNodes.length; ++i) {
            var sourceChild = source.childNodes[i];
            var targetChild = target.childNodes[i];
            if (sourceChild instanceof Element)
                this.copyStyles(sourceChild, targetChild, []);
        }
    };
    SvgExporter.prototype.getBounds = function (root) {
        var allBounds = [geometry_1.EMPTY_BOUNDS];
        root.children.forEach(function (element) {
            if (model_1.isBoundsAware(element)) {
                allBounds.push(element.bounds);
            }
        });
        return allBounds.reduce(function (one, two) { return geometry_1.combine(one, two); });
    };
    SvgExporter = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(types_1.TYPES.ViewerOptions)),
        __param(1, inversify_1.inject(types_1.TYPES.IActionDispatcher)),
        __param(2, inversify_1.inject(types_1.TYPES.ILogger))
    ], SvgExporter);
    return SvgExporter;
}());
exports.SvgExporter = SvgExporter;
