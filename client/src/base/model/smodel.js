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
var geometry_1 = require("../../utils/geometry");
var iterable_1 = require("../../utils/iterable");
/**
 * Base class for all elements of the diagram model.
 * Each model element must have a unique ID and a type that is used to look up its view.
 */
var SModelElement = /** @class */ (function () {
    function SModelElement() {
    }
    Object.defineProperty(SModelElement.prototype, "root", {
        get: function () {
            var current = this;
            while (current) {
                if (current instanceof SModelRoot)
                    return current;
                else if (current instanceof SChildElement)
                    current = current.parent;
                else
                    current = undefined;
            }
            throw new Error("Element has no root");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SModelElement.prototype, "index", {
        get: function () {
            return this.root.index;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * A feature is a symbol identifying some functionality that can be enabled or disabled for
     * a model element. The base implementation always returns false, so it disables all features.
     */
    SModelElement.prototype.hasFeature = function (feature) {
        return false;
    };
    return SModelElement;
}());
exports.SModelElement = SModelElement;
function isParent(element) {
    var children = element.children;
    return children !== undefined && children.constructor === Array;
}
exports.isParent = isParent;
/**
 * A parent element may contain child elements, thus the diagram model forms a tree.
 */
var SParentElement = /** @class */ (function (_super) {
    __extends(SParentElement, _super);
    function SParentElement() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.children = [];
        return _this;
    }
    SParentElement.prototype.add = function (child, i) {
        var children = this.children;
        if (i === undefined) {
            children.push(child);
        }
        else {
            if (i < 0 || i > this.children.length) {
                throw new Error("Child index " + i + " out of bounds (0.." + children.length + ")");
            }
            children.splice(i, 0, child);
        }
        child.parent = this;
        this.index.add(child);
    };
    SParentElement.prototype.remove = function (child) {
        var children = this.children;
        var i = children.indexOf(child);
        if (i < 0) {
            throw new Error("No such child " + child.id);
        }
        children.splice(i, 1);
        delete child.parent;
        this.index.remove(child);
    };
    SParentElement.prototype.removeAll = function (filter) {
        var _this = this;
        var children = this.children;
        if (filter !== undefined) {
            for (var i = children.length - 1; i >= 0; i--) {
                if (filter(children[i])) {
                    var child = children.splice(i, 1)[0];
                    delete child.parent;
                    this.index.remove(child);
                }
            }
        }
        else {
            children.forEach(function (child) {
                delete child.parent;
                _this.index.remove(child);
            });
            children.splice(0, children.length);
        }
    };
    SParentElement.prototype.move = function (child, newIndex) {
        var children = this.children;
        var i = children.indexOf(child);
        if (i === -1) {
            throw new Error("No such child " + child.id);
        }
        else {
            if (newIndex < 0 || newIndex > children.length - 1) {
                throw new Error("Child index " + newIndex + " out of bounds (0.." + children.length + ")");
            }
            children.splice(i, 1);
            children.splice(newIndex, 0, child);
        }
    };
    /**
     * Transform the given bounds from the local coordinate system of this element to the coordinate
     * system of its parent. This function should consider any transformation that is applied to the
     * view of this element and its contents.
     * The base implementation assumes that this element does not define a local coordinate system,
     * so it leaves the bounds unchanged.
     */
    SParentElement.prototype.localToParent = function (point) {
        return geometry_1.isBounds(point) ? point : { x: point.x, y: point.y, width: -1, height: -1 };
    };
    /**
     * Transform the given bounds from the coordinate system of this element's parent to its local
     * coordinate system. This function should consider any transformation that is applied to the
     * view of this element and its contents.
     * The base implementation assumes that this element does not define a local coordinate system,
     * so it leaves the bounds unchanged.
     */
    SParentElement.prototype.parentToLocal = function (point) {
        return geometry_1.isBounds(point) ? point : { x: point.x, y: point.y, width: -1, height: -1 };
    };
    return SParentElement;
}(SModelElement));
exports.SParentElement = SParentElement;
/**
 * A child element is contained in a parent element. All elements except the model root are child
 * elements. In order to keep the model class hierarchy simple, every child element is also a
 * parent element, although for many elements the array of children is empty (i.e. they are
 * leafs in the model element tree).
 */
var SChildElement = /** @class */ (function (_super) {
    __extends(SChildElement, _super);
    function SChildElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return SChildElement;
}(SParentElement));
exports.SChildElement = SChildElement;
/**
 * Base class for the root element of the diagram model tree.
 */
var SModelRoot = /** @class */ (function (_super) {
    __extends(SModelRoot, _super);
    function SModelRoot(index) {
        if (index === void 0) { index = new SModelIndex(); }
        var _this = _super.call(this) || this;
        _this.canvasBounds = geometry_1.EMPTY_BOUNDS;
        // Override the index property from SModelElement, which has a getter, with a data property
        Object.defineProperty(_this, 'index', {
            value: index,
            writable: false
        });
        return _this;
    }
    return SModelRoot;
}(SParentElement));
exports.SModelRoot = SModelRoot;
var ID_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";
function createRandomId(length) {
    if (length === void 0) { length = 8; }
    var id = "";
    for (var i = 0; i < length; i++) {
        id += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS.length));
    }
    return id;
}
exports.createRandomId = createRandomId;
/**
 * Used to speed up model element lookup by id.
 */
var SModelIndex = /** @class */ (function () {
    function SModelIndex() {
        this.id2element = new Map;
    }
    SModelIndex.prototype.add = function (element) {
        if (!element.id) {
            do {
                element.id = createRandomId();
            } while (this.contains(element));
        }
        else if (this.contains(element)) {
            throw new Error("Duplicate ID in model: " + element.id);
        }
        this.id2element.set(element.id, element);
        if (element.children !== undefined && element.children.constructor === Array) {
            for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.add(child);
            }
        }
    };
    SModelIndex.prototype.remove = function (element) {
        this.id2element["delete"](element.id);
        if (element.children !== undefined && element.children.constructor === Array) {
            for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
                var child = _a[_i];
                this.remove(child);
            }
        }
    };
    SModelIndex.prototype.contains = function (element) {
        return this.id2element.has(element.id);
    };
    SModelIndex.prototype.getById = function (id) {
        return this.id2element.get(id);
    };
    SModelIndex.prototype.getAttachedElements = function (element) {
        return [];
    };
    SModelIndex.prototype.all = function () {
        return iterable_1.mapIterable(this.id2element, function (_a) {
            var key = _a[0], value = _a[1];
            return value;
        });
    };
    return SModelIndex;
}());
exports.SModelIndex = SModelIndex;
