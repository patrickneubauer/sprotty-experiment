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
var iterable_1 = require("../utils/iterable");
var smodel_1 = require("../base/model/smodel");
var model_1 = require("../features/bounds/model");
var model_2 = require("../features/fade/model");
var model_3 = require("../features/hover/model");
var model_4 = require("../features/move/model");
var model_5 = require("../features/select/model");
var viewport_root_1 = require("../features/viewport/viewport-root");
var geometry_1 = require("../utils/geometry");
var model_6 = require("../features/bounds/model");
var model_7 = require("../features/edit/model");
var smodel_utils_1 = require("../base/model/smodel-utils");
var routing_1 = require("./routing");
/**
 * Root element for graph-like models.
 */
var SGraph = /** @class */ (function (_super) {
    __extends(SGraph, _super);
    function SGraph(index) {
        if (index === void 0) { index = new SGraphIndex(); }
        return _super.call(this, index) || this;
    }
    return SGraph;
}(viewport_root_1.ViewportRootElement));
exports.SGraph = SGraph;
/**
 * A connectable element is one that can have outgoing and incoming edges, i.e. it can be the source
 * or target element of an edge. There are two kinds of connectable elements: nodes (`SNode`) and
 * ports (`SPort`). A node represents a main entity, while a port is a connection point inside a node.
 */
var SConnectableElement = /** @class */ (function (_super) {
    __extends(SConnectableElement, _super);
    function SConnectableElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(SConnectableElement.prototype, "incomingEdges", {
        /**
         * The incoming edges of this connectable element. They are resolved by the index, which must
         * be an `SGraphIndex`.
         */
        get: function () {
            return this.index.getIncomingEdges(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SConnectableElement.prototype, "outgoingEdges", {
        /**
         * The outgoing edges of this connectable element. They are resolved by the index, which must
         * be an `SGraphIndex`.
         */
        get: function () {
            return this.index.getOutgoingEdges(this);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Compute an anchor position for routing an edge towards this element.
     *
     * The default implementation returns the element's center point. If edges should be connected
     * differently, e.g. to some point on the boundary of the element's view, the according computation
     * should be implemented in a subclass by overriding this method.
     *
     * @param referencePoint The point from which the edge is routed towards this element
     * @param offset An optional offset value to be considered in the anchor computation;
     *               positive values should shift the anchor away from this element, negative values
     *               should shift the anchor more to the inside.
     */
    SConnectableElement.prototype.getAnchor = function (referencePoint, offset) {
        return geometry_1.center(this.bounds);
    };
    /**
     * Compute an anchor position for routing an edge towards this element and correct any mismatch
     * of the coordinate systems.
     *
     * @param refPoint The point from which the edge is routed towards this element
     * @param refContainer The parent element that defines the coordinate system for `refPoint`
     * @param edge The edge for which the anchor is computed
     * @param offset An optional offset value (see `getAnchor`)
     */
    SConnectableElement.prototype.getTranslatedAnchor = function (refPoint, refContainer, edge, offset) {
        var translatedRefPoint = smodel_utils_1.translatePoint(refPoint, refContainer, this.parent);
        var anchor = this.getAnchor(translatedRefPoint, offset);
        return smodel_utils_1.translatePoint(anchor, this.parent, edge.parent);
    };
    return SConnectableElement;
}(model_6.SShapeElement));
exports.SConnectableElement = SConnectableElement;
/**
 * Model element class for nodes, which are the main entities in a graph. A node can be connected to
 * another node via an SEdge. Such a connection can be direct, i.e. the node is the source or target of
 * the edge, or indirect through a port, i.e. it contains an SPort which is the source or target of the edge.
 */
var SNode = /** @class */ (function (_super) {
    __extends(SNode, _super);
    function SNode() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selected = false;
        _this.hoverFeedback = false;
        _this.opacity = 1;
        return _this;
    }
    SNode.prototype.hasFeature = function (feature) {
        return feature === model_5.selectFeature || feature === model_4.moveFeature || feature === model_1.boundsFeature
            || feature === model_1.layoutContainerFeature || feature === model_2.fadeFeature || feature === model_3.hoverFeedbackFeature
            || feature === model_3.popupFeature;
    };
    return SNode;
}(SConnectableElement));
exports.SNode = SNode;
/**
 * A port is a connection point for edges. It should always be contained in an SNode.
 */
var SPort = /** @class */ (function (_super) {
    __extends(SPort, _super);
    function SPort() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selected = false;
        _this.hoverFeedback = false;
        _this.opacity = 1;
        return _this;
    }
    SPort.prototype.hasFeature = function (feature) {
        return feature === model_5.selectFeature || feature === model_1.boundsFeature || feature === model_2.fadeFeature
            || feature === model_3.hoverFeedbackFeature;
    };
    return SPort;
}(SConnectableElement));
exports.SPort = SPort;
/**
 * Model element class for edges, which are the connectors in a graph. An edge has a source and a target,
 * each of which can be either a node or a port. The source and target elements are referenced via their
 * ids and can be resolved with the index stored in the root element.
 */
var SEdge = /** @class */ (function (_super) {
    __extends(SEdge, _super);
    function SEdge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.routingPoints = [];
        _this.selected = false;
        _this.hoverFeedback = false;
        _this.opacity = 1;
        return _this;
    }
    Object.defineProperty(SEdge.prototype, "source", {
        get: function () {
            return this.index.getById(this.sourceId);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SEdge.prototype, "target", {
        get: function () {
            return this.index.getById(this.targetId);
        },
        enumerable: true,
        configurable: true
    });
    SEdge.prototype.route = function () {
        if (this.router === undefined)
            this.router = new routing_1.LinearEdgeRouter();
        var route = this.router.route(this);
        return model_7.filterEditModeHandles(route, this);
    };
    SEdge.prototype.hasFeature = function (feature) {
        return feature === model_2.fadeFeature || feature === model_5.selectFeature ||
            feature === model_7.editFeature || feature === model_3.hoverFeedbackFeature;
    };
    return SEdge;
}(smodel_1.SChildElement));
exports.SEdge = SEdge;
/**
 * A label can be attached to a node, edge, or port, and contains some text to be rendered in its view.
 */
var SLabel = /** @class */ (function (_super) {
    __extends(SLabel, _super);
    function SLabel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.selected = false;
        _this.alignment = geometry_1.ORIGIN_POINT;
        _this.opacity = 1;
        return _this;
    }
    SLabel.prototype.hasFeature = function (feature) {
        return feature === model_1.boundsFeature || feature === model_1.alignFeature || feature === model_2.fadeFeature || feature === model_1.layoutableChildFeature;
    };
    return SLabel;
}(model_6.SShapeElement));
exports.SLabel = SLabel;
/**
 * A compartment is used to group multiple child elements such as labels of a node. Usually a `vbox`
 * or `hbox` layout is used to arrange these children.
 */
var SCompartment = /** @class */ (function (_super) {
    __extends(SCompartment, _super);
    function SCompartment() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.opacity = 1;
        return _this;
    }
    SCompartment.prototype.hasFeature = function (feature) {
        return feature === model_1.boundsFeature || feature === model_1.layoutContainerFeature || feature === model_1.layoutableChildFeature || feature === model_2.fadeFeature;
    };
    return SCompartment;
}(model_6.SShapeElement));
exports.SCompartment = SCompartment;
/**
 * A specialized model index that tracks outgoing and incoming edges.
 */
var SGraphIndex = /** @class */ (function (_super) {
    __extends(SGraphIndex, _super);
    function SGraphIndex() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.outgoing = new Map;
        _this.incoming = new Map;
        return _this;
    }
    SGraphIndex.prototype.add = function (element) {
        _super.prototype.add.call(this, element);
        if (element instanceof SEdge) {
            // Register the edge in the outgoing map
            if (element.sourceId) {
                var sourceArr = this.outgoing.get(element.sourceId);
                if (sourceArr === undefined)
                    this.outgoing.set(element.sourceId, [element]);
                else
                    sourceArr.push(element);
            }
            // Register the edge in the incoming map
            if (element.targetId) {
                var targetArr = this.incoming.get(element.targetId);
                if (targetArr === undefined)
                    this.incoming.set(element.targetId, [element]);
                else
                    targetArr.push(element);
            }
        }
    };
    SGraphIndex.prototype.remove = function (element) {
        _super.prototype.remove.call(this, element);
        if (element instanceof SEdge) {
            // Remove the edge from the outgoing map
            var sourceArr = this.outgoing.get(element.sourceId);
            if (sourceArr !== undefined) {
                var index = sourceArr.indexOf(element);
                if (index >= 0) {
                    if (sourceArr.length === 1)
                        this.outgoing["delete"](element.sourceId);
                    else
                        sourceArr.splice(index, 1);
                }
            }
            // Remove the edge from the incoming map
            var targetArr = this.incoming.get(element.targetId);
            if (targetArr !== undefined) {
                var index = targetArr.indexOf(element);
                if (index >= 0) {
                    if (targetArr.length === 1)
                        this.incoming["delete"](element.targetId);
                    else
                        targetArr.splice(index, 1);
                }
            }
        }
    };
    SGraphIndex.prototype.getAttachedElements = function (element) {
        var _this = this;
        return new iterable_1.FluentIterableImpl(function () { return ({
            outgoing: _this.outgoing.get(element.id),
            incoming: _this.incoming.get(element.id),
            nextOutgoingIndex: 0,
            nextIncomingIndex: 0
        }); }, function (state) {
            var index = state.nextOutgoingIndex;
            if (state.outgoing !== undefined && index < state.outgoing.length) {
                state.nextOutgoingIndex = index + 1;
                return { done: false, value: state.outgoing[index] };
            }
            index = state.nextIncomingIndex;
            if (state.incoming !== undefined) {
                // Filter out self-loops: edges that are both outgoing and incoming
                while (index < state.incoming.length) {
                    var edge = state.incoming[index];
                    if (edge.sourceId !== edge.targetId) {
                        state.nextIncomingIndex = index + 1;
                        return { done: false, value: edge };
                    }
                    index++;
                }
            }
            return { done: true, value: undefined };
        });
    };
    SGraphIndex.prototype.getIncomingEdges = function (element) {
        return this.incoming.get(element.id) || [];
    };
    SGraphIndex.prototype.getOutgoingEdges = function (element) {
        return this.outgoing.get(element.id) || [];
    };
    return SGraphIndex;
}(smodel_1.SModelIndex));
exports.SGraphIndex = SGraphIndex;
