/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web.diagram

import io.typefox.sprotty.api.FitToScreenAction
import io.typefox.sprotty.api.IDiagramServer
import io.typefox.sprotty.api.IModelUpdateListener
import io.typefox.sprotty.api.SModelRoot
import io.typefox.sprotty.api.SelectAction
import io.typefox.sprotty.api.SelectAllAction

class CrossflowUpdateListener implements IModelUpdateListener {
	
	SModelRoot oldRoot
	
	override modelSubmitted(SModelRoot newRoot, IDiagramServer server) {
		System.out.println("CrossflowUpdateListener.modelSubmitted with newRoot = ");
		System.out.println(newRoot.toString());
		
		if (newRoot instanceof Crossflow) {
			val taskNodes = newRoot.children.filter(TaskNode)
			val selectedNodes = taskNodes.filter[selected !== null && selected].toList
			if (selectedNodes.empty) {
				val activeNodes = taskNodes.map[id]
				server.dispatch(new FitToScreenAction [
					elementIds = activeNodes.toList
					maxZoom = 1.0
					padding = 10.0
				])
			} else {
				server.dispatch(new SelectAllAction [
					select = false
				])
				server.dispatch(new SelectAction [
					selectedElementsIDs = selectedNodes.map[id]
				])
				server.dispatch(new FitToScreenAction [
					elementIds = selectedNodes.map[id]
					maxZoom = 1.0
					padding = 10.0
				])
			}
		}
		
		
//		if (newRoot instanceof Flow) {
//			val taskNodes = newRoot.children.filter(TaskNode)
//			val selectedNodes = taskNodes.filter[selected !== null && selected].toList
//			if (selectedNodes.empty) {
//				val activeNodes = taskNodes.filter[status !== null].map[id]
//				server.dispatch(new FitToScreenAction [
//					elementIds = activeNodes.toList
//					maxZoom = 1.0
//					padding = 10.0
//				])
//			} else {
//				server.dispatch(new SelectAllAction [
//					select = false
//				])
//				server.dispatch(new SelectAction [
//					selectedElementsIDs = selectedNodes.map[id]
//				])
//				server.dispatch(new FitToScreenAction [
//					elementIds = selectedNodes.map[id]
//					maxZoom = 1.0
//					padding = 10.0
//				])
//			}
//		}
//		if (newRoot instanceof Processor) {
//			val selectedCores = newRoot.children.filter(Core).filter[selected !== null && selected].toList
//			var sizeChanged = true
//			var selectionChanged = true
//			if (oldRoot instanceof Processor) {
//				sizeChanged = newRoot.rows != oldRoot.rows || newRoot.columns != oldRoot.columns
//				selectionChanged = selectedCores != oldRoot.children.filter(Core).filter[selected !== null && selected].toList
//			}
//			if (sizeChanged || selectionChanged) {
//				server.dispatch(new SelectAllAction [
//					select = false
//				])
//				server.dispatch(new SelectAction [
//					selectedElementsIDs = selectedCores.map[id]
//				])
//				server.dispatch(new FitToScreenAction [
//					elementIds = selectedCores.map[id]
//					maxZoom = 3.0
//					padding = 10.0
//				])
//			}
//		}
		oldRoot = newRoot
	}
	
}