"use strict";
/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
exports.__esModule = true;
var inversify_1 = require("inversify");
var smodel_storage_1 = require("./model/smodel-storage");
var types_1 = require("./types");
var initialize_canvas_1 = require("./features/initialize-canvas");
var logging_1 = require("../utils/logging");
var action_dispatcher_1 = require("./actions/action-dispatcher");
var action_handler_1 = require("./actions/action-handler");
var command_stack_1 = require("./commands/command-stack");
var smodel_factory_1 = require("./model/smodel-factory");
var animation_frame_syncer_1 = require("./animations/animation-frame-syncer");
var viewer_1 = require("./views/viewer");
var viewer_options_1 = require("./views/viewer-options");
var mouse_tool_1 = require("./views/mouse-tool");
var key_tool_1 = require("./views/key-tool");
var vnode_decorators_1 = require("./views/vnode-decorators");
var view_1 = require("./views/view");
var viewer_cache_1 = require("./views/viewer-cache");
var dom_helper_1 = require("./views/dom-helper");
var id_decorator_1 = require("./views/id-decorator");
var command_1 = require("./commands/command");
var defaultContainerModule = new inversify_1.ContainerModule(function (bind) {
    // Logging ---------------------------------------------
    bind(types_1.TYPES.ILogger).to(logging_1.NullLogger).inSingletonScope();
    bind(types_1.TYPES.LogLevel).toConstantValue(logging_1.LogLevel.warn);
    // Registries ---------------------------------------------
    bind(types_1.TYPES.SModelRegistry).to(smodel_factory_1.SModelRegistry).inSingletonScope();
    bind(types_1.TYPES.ActionHandlerRegistry).to(action_handler_1.ActionHandlerRegistry).inSingletonScope();
    bind(types_1.TYPES.ViewRegistry).to(view_1.ViewRegistry).inSingletonScope();
    // Model Creation ---------------------------------------------
    bind(types_1.TYPES.IModelFactory).to(smodel_factory_1.SModelFactory).inSingletonScope();
    // Action Dispatcher ---------------------------------------------
    bind(types_1.TYPES.IActionDispatcher).to(action_dispatcher_1.ActionDispatcher).inSingletonScope();
    bind(types_1.TYPES.IActionDispatcherProvider).toProvider(function (context) {
        return function () {
            return new Promise(function (resolve) {
                resolve(context.container.get(types_1.TYPES.IActionDispatcher));
            });
        };
    });
    // Action handler
    bind(types_1.TYPES.IActionHandlerInitializer).to(command_1.CommandActionHandlerInitializer);
    // Command Stack ---------------------------------------------
    bind(types_1.TYPES.ICommandStack).to(command_stack_1.CommandStack).inSingletonScope();
    bind(types_1.TYPES.ICommandStackProvider).toProvider(function (context) {
        return function () {
            return new Promise(function (resolve) {
                resolve(context.container.get(types_1.TYPES.ICommandStack));
            });
        };
    });
    bind(types_1.TYPES.CommandStackOptions).toConstantValue({
        defaultDuration: 250,
        undoHistoryLimit: 50
    });
    // Viewer ---------------------------------------------
    bind(viewer_1.Viewer).toSelf().inSingletonScope();
    bind(types_1.TYPES.IViewer).toDynamicValue(function (context) {
        return context.container.get(viewer_1.Viewer);
    }).inSingletonScope().whenTargetNamed('delegate');
    bind(viewer_cache_1.ViewerCache).toSelf().inSingletonScope();
    bind(types_1.TYPES.IViewer).toDynamicValue(function (context) {
        return context.container.get(viewer_cache_1.ViewerCache);
    }).inSingletonScope().whenTargetIsDefault();
    bind(types_1.TYPES.IViewerProvider).toProvider(function (context) {
        return function () {
            return new Promise(function (resolve) {
                resolve(context.container.get(types_1.TYPES.IViewer));
            });
        };
    });
    bind(types_1.TYPES.ViewerOptions).toConstantValue(viewer_options_1.defaultViewerOptions());
    bind(types_1.TYPES.DOMHelper).to(dom_helper_1.DOMHelper).inSingletonScope();
    bind(types_1.TYPES.ModelRendererFactory).toFactory(function (context) {
        return function (decorators) {
            var viewRegistry = context.container.get(types_1.TYPES.ViewRegistry);
            return new viewer_1.ModelRenderer(viewRegistry, decorators);
        };
    });
    // Tools & Decorators --------------------------------------
    bind(id_decorator_1.IdDecorator).toSelf().inSingletonScope();
    bind(types_1.TYPES.IVNodeDecorator).toDynamicValue(function (context) {
        return context.container.get(id_decorator_1.IdDecorator);
    }).inSingletonScope();
    bind(mouse_tool_1.MouseTool).toSelf().inSingletonScope();
    bind(types_1.TYPES.IVNodeDecorator).toDynamicValue(function (context) {
        return context.container.get(mouse_tool_1.MouseTool);
    }).inSingletonScope();
    bind(key_tool_1.KeyTool).toSelf().inSingletonScope();
    bind(types_1.TYPES.IVNodeDecorator).toDynamicValue(function (context) {
        return context.container.get(key_tool_1.KeyTool);
    }).inSingletonScope();
    bind(vnode_decorators_1.FocusFixDecorator).toSelf().inSingletonScope();
    bind(types_1.TYPES.IVNodeDecorator).toDynamicValue(function (context) {
        return context.container.get(vnode_decorators_1.FocusFixDecorator);
    }).inSingletonScope();
    bind(types_1.TYPES.PopupVNodeDecorator).toDynamicValue(function (context) {
        return context.container.get(id_decorator_1.IdDecorator);
    }).inSingletonScope();
    bind(mouse_tool_1.PopupMouseTool).toSelf().inSingletonScope();
    bind(types_1.TYPES.PopupVNodeDecorator).toDynamicValue(function (context) {
        return context.container.get(mouse_tool_1.PopupMouseTool);
    }).inSingletonScope();
    bind(types_1.TYPES.HiddenVNodeDecorator).toDynamicValue(function (context) {
        return context.container.get(id_decorator_1.IdDecorator);
    }).inSingletonScope();
    // Animation Frame Sync ------------------------------------------
    bind(types_1.TYPES.AnimationFrameSyncer).to(animation_frame_syncer_1.AnimationFrameSyncer).inSingletonScope();
    // Canvas Initialization ---------------------------------------------
    bind(types_1.TYPES.ICommand).toConstructor(initialize_canvas_1.InitializeCanvasBoundsCommand);
    bind(initialize_canvas_1.CanvasBoundsInitializer).toSelf().inSingletonScope();
    bind(types_1.TYPES.IVNodeDecorator).toDynamicValue(function (context) {
        return context.container.get(initialize_canvas_1.CanvasBoundsInitializer);
    }).inSingletonScope();
    bind(types_1.TYPES.SModelStorage).to(smodel_storage_1.SModelStorage).inSingletonScope();
});
exports["default"] = defaultContainerModule;
