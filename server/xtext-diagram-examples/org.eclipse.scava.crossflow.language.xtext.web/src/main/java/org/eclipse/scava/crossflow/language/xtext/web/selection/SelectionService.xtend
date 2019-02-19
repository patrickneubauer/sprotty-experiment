/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web.selection

import com.google.inject.Inject
import java.util.List
import org.eclipse.emf.ecore.EObject
import org.eclipse.xtext.resource.EObjectAtOffsetHelper
import org.eclipse.xtext.web.server.model.IXtextWebDocument
import org.eclipse.xtext.web.server.model.XtextWebDocumentAccess

import static extension org.eclipse.xtext.EcoreUtil2.*
import static extension org.eclipse.xtext.nodemodel.util.NodeModelUtils.*
import org.eclipse.scava.crossflow.language.xtext.crossflow.Workflow
import org.eclipse.scava.crossflow.language.xtext.web.selection.NodeModelExtensions
import org.eclipse.scava.crossflow.language.xtext.web.selection.SelectionResult
import org.eclipse.scava.crossflow.language.xtext.crossflow.Stream

class SelectionService {
	
	@Inject extension EObjectAtOffsetHelper
	
	@Inject extension NodeModelExtensions
	
	def getOffsetById(XtextWebDocumentAccess access, String modelType, String elementId, int caretOffset) {
		access.readOnly[ doc, cancelIndicator |
			val program = doc.resource.contents.head as Workflow
			val currentSelection = doc.getCurrentSelection(caretOffset)
			val element = getObjectById(program, currentSelection, modelType, elementId)
			val node = element.node
			return new SelectionResult(if (node !== null) node.offset else -1)
		]
	}
	
	def getNextStepOffset(XtextWebDocumentAccess access, int caretOffset) {
		access.readOnly[ doc, cancelIndicator |
			val program = doc.resource.contents.head as Workflow
			val currentSelection = doc.getCurrentSelection(caretOffset)
			val currentStep = currentSelection.getContainerOfType(Stream)
			val allSteps = program.streams.filter(Stream)
			val nextStep = if (currentStep === null)
//				allSteps.minBy[index]
//			else if (allSteps.exists[index > currentStep.index])
//				allSteps.filter[index > currentStep.index].minBy[index]
//			else
				currentStep
			val node = nextStep.node
			return new SelectionResult(if (node !== null) node.offset else -1)
		]
	}
	
	def getPreviousStepOffset(XtextWebDocumentAccess access, int caretOffset) {
		access.readOnly[ doc, cancelIndicator |
			val program = doc.resource.contents.head as Workflow
			val currentSelection = doc.getCurrentSelection(caretOffset)
			val currentStep = currentSelection.getContainerOfType(Stream)
			val allSteps = program.streams.filter(Stream)
			val previousStep = if (currentStep === null)
//				allSteps.maxBy[index]
//			else if (allSteps.exists[index < currentStep.index])
//				allSteps.filter[index < currentStep.index].maxBy[index]
//			else
				currentStep
			val node = previousStep.node
			return new SelectionResult(if (node !== null) node.offset else -1)
		]
	}
	
	def EObject getCurrentSelection(IXtextWebDocument doc, int caretOffset) {
		var element = doc.resource.resolveContainedElementAt(caretOffset)
		var node = element.node
		while (node !== null) {
			if (node.contains(caretOffset))
				return element
			if (element.eContainingFeature.isMany) {
				val container = element.eContainer
				val list = container.eGet(element.eContainingFeature) as List<? extends EObject>
				val index = list.indexOf(element)
				val previousElement = if (index > 0) list.get(index - 1)
				if (previousElement.node.contains(caretOffset))
					return previousElement
				val nextElement = if (index < list.size - 1) list.get(index + 1)
				if (nextElement.node.contains(caretOffset))
					return nextElement
			}
			element = element.eContainer
			node = element.node
		}
	}
	
	protected def EObject getObjectById(Workflow program, EObject currentSelection, String modelType, String elementId) {
		switch modelType {
//			case 'processor': {
//				if (elementId == 'processor') {
//					return currentSelection.getContainerOfType(Step)
//				} else if (elementId.startsWith('core_')) {
//					val coreIndex = Integer.parseInt(elementId.substring('core_'.length))
//					val currentStep = currentSelection.getContainerOfType(Step)
//					if (currentStep !== null) {
//						for (allocation : currentStep.allocations) {
//							if (allocation.core == coreIndex)
//								return allocation
//						}
//					}
//				}
//			}
			case 'crossflow': {
				if (elementId == 'crossflow') {
					return currentSelection.getContainerOfType(Stream)
				} else if (elementId.startsWith('task_')) {
					val taskName = elementId.substring('task_'.length)
					val currentStep = currentSelection.getContainerOfType(Stream)
					if (currentStep !== null) {
						for (allocation : currentStep.inputOf) {
							if (allocation?.name == taskName)
								return allocation
						}
					}
					for (step : program.streams.filter(Stream)) {
						for (allocation : step.inputOf) {
							if (allocation?.name == taskName)
								return allocation
						}
					}
				}
			}
		}
	}
	
}
