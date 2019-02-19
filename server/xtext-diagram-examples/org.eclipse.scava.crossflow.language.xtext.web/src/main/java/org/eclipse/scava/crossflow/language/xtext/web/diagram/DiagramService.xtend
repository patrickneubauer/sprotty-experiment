/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web.diagram

import com.google.inject.Inject
import com.google.inject.Provider
import com.google.inject.Singleton
import io.typefox.sprotty.api.IDiagramServer
import io.typefox.sprotty.api.LayoutUtil
//import io.typefox.sprotty.example.multicore.Crossflow.Program
//import io.typefox.sprotty.example.multicore.Crossflow.Step
//import io.typefox.sprotty.example.multicore.Crossflow.TaskAllocation
import java.util.Enumeration
import java.util.Iterator
import java.util.Map
import javax.servlet.http.HttpSessionEvent
import javax.servlet.http.HttpSessionListener
import org.apache.log4j.Logger
import org.eclipse.emf.ecore.EObject
import org.eclipse.xtext.service.OperationCanceledManager
import org.eclipse.xtext.util.CancelIndicator
import org.eclipse.xtext.web.server.IServiceResult
import org.eclipse.xtext.web.server.model.AbstractCachedService
import org.eclipse.xtext.web.server.model.IXtextWebDocument
import org.eclipse.xtext.web.server.model.XtextWebDocument
import org.eclipse.xtext.web.server.model.XtextWebDocumentAccess
import org.eclipse.xtext.web.server.validation.ValidationService

import static extension org.eclipse.xtext.EcoreUtil2.*
import org.eclipse.scava.crossflow.language.xtext.crossflow.Workflow

@Singleton
class DiagramService extends AbstractCachedService<VoidResult> implements IDiagramServer.Provider, HttpSessionListener {
	
	static val LOG = Logger.getLogger(DiagramService)
	
	static val SESSION_DOCUMENT_PREFIX = (XtextWebDocument -> '').toString
	
	@Inject CrossflowDiagramGenerator diagramGenerator
	
	@Inject ValidationService validationService
	
	@Inject extension OperationCanceledManager
	
	@Inject Provider<CrossflowDiagramServer> diagramServerProvider
	
	val Map<String, CrossflowDiagramServer> diagramServers = newHashMap
	
	override CrossflowDiagramServer getDiagramServer(String clientId) {
		synchronized (diagramServers) {
			var result = diagramServers.get(clientId)
			if (result === null) {
				result = diagramServerProvider.get
				result.clientId = clientId
				diagramServers.put(clientId, result)
			}
			return result
		}
	}
	
	override compute(IXtextWebDocument doc, CancelIndicator cancelIndicator) {
		if (doc instanceof XtextWebDocument) {
			val validationResult = doc.getCachedServiceResult(validationService, cancelIndicator, false)
			if (!validationResult.issues.exists[severity == 'error']) {
//				getDiagramServer(doc.resourceId + '_processor').selection = null
				getDiagramServer(doc.resourceId + '_crossflow').selection = null
				doCompute(doc, cancelIndicator)
			}
		} else {
			LOG.warn('Direct document access is required for generating diagrams.')
		}
		return new VoidResult
	}
	
		protected def void doCompute(IXtextWebDocument doc, CancelIndicator cancelIndicator) {
		val workflow = doc.resource.contents.head as Workflow
		
//		val processorServer = getDiagramServer(doc.resourceId + '_processor')
//		val processorMapping = diagramGenerator.generateProcessorView(program, processorServer.selection, cancelIndicator)
//		processorServer.modelMapping = processorMapping
//		val processorView = processorMapping.get(program) as Processor
//		processorServer.updateModel(processorView)
//		cancelIndicator.checkCanceled
		
		val flowServer = getDiagramServer(doc.resourceId + '_crossflow')
		val flowMapping = diagramGenerator.generateFlowView(workflow, flowServer.selection, cancelIndicator)
		flowServer.modelMapping = flowMapping
		val flowView = flowMapping.get(workflow) as Crossflow
		if (flowServer.model !== null)
			LayoutUtil.copyLayoutData(flowServer.model, flowView)
		flowServer.updateModel(flowView)
	}
	
	def void setSelection(XtextWebDocumentAccess access, String resourceId, EObject selectedElement) {
		val validationResult = validationService.getResult(access)
		if (!validationResult.issues.exists[severity == 'error']) {
			access.readOnly[ doc, cancelIndicator |
//				val processorServer = getDiagramServer(doc.resourceId + '_processor')
				val flowServer = getDiagramServer(doc.resourceId + '_crossflow')
//				val previousElement = processorServer.selection
//				val previousStep = previousElement.getContainerOfType(Step)
//				val previousTaskAllocation = previousElement.getContainerOfType(TaskAllocation)
//				val selectedStep = selectedElement.getContainerOfType(Step)
//				val selectedTaskAllocation = selectedElement.getContainerOfType(TaskAllocation)
//				if (previousStep != selectedStep || previousTaskAllocation != selectedTaskAllocation) {
//					if (selectedTaskAllocation !== null && previousStep != selectedStep) {
//						val intermediateElement = previousElement.getContainerOfType(Step) ?: selectedStep
//						processorServer.selection = intermediateElement
//						flowServer.selection = intermediateElement
//						doCompute(doc, CancelIndicator.NullImpl)
//					}
//					processorServer.selection = selectedElement
//					flowServer.selection = selectedElement
//					doCompute(doc, CancelIndicator.NullImpl)
//				}
				return null
			]
		}
	}
	
	override sessionCreated(HttpSessionEvent se) {
	}
	
	override sessionDestroyed(HttpSessionEvent se) {
		for (attr : se.session.attributeNames.toIterable) {
			if (attr.startsWith(SESSION_DOCUMENT_PREFIX)) {
				val resourceId = attr.substring(SESSION_DOCUMENT_PREFIX.length)
				LOG.info('Session destroyed: ' + resourceId)
				synchronized (diagramServers) {
//					diagramServers.remove(resourceId + '_processor')
					diagramServers.remove(resourceId + '_crossflow')
				}
			}
		}
	}
	
	def static <T> Iterable<T> toIterable(Enumeration<T> enumeration) {
		[
			new Iterator<T> {
				override hasNext() {
					enumeration.hasMoreElements
				}

				override next() {
					enumeration.nextElement
				}

				override remove() {
					throw new UnsupportedOperationException
				}
			}
		]
	}
	
}

class VoidResult implements IServiceResult {
}
