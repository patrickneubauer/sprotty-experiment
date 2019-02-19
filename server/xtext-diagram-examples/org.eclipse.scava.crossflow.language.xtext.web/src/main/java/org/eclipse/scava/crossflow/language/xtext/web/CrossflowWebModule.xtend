/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */
package org.eclipse.scava.crossflow.language.xtext.web

import io.typefox.sprotty.api.IDiagramExpansionListener
import io.typefox.sprotty.api.IDiagramOpenListener
import io.typefox.sprotty.api.IDiagramSelectionListener
import io.typefox.sprotty.api.IDiagramServer
import io.typefox.sprotty.api.ILayoutEngine
import io.typefox.sprotty.api.IModelUpdateListener
import io.typefox.sprotty.api.IPopupModelFactory
import org.eclipse.scava.crossflow.language.xtext.web.diagram.DiagramService
import org.eclipse.scava.crossflow.language.xtext.web.diagram.CrossflowDiagramServer
import org.eclipse.scava.crossflow.language.xtext.web.diagram.CrossflowLayoutEngine
import org.eclipse.scava.crossflow.language.xtext.web.diagram.CrossflowPopupModelFactory
import org.eclipse.scava.crossflow.language.xtext.web.diagram.CrossflowUpdateListener
import org.eclipse.xtext.web.server.XtextServiceDispatcher
import org.eclipse.xtext.web.server.model.IWebDocumentProvider
import org.eclipse.xtext.web.server.occurrences.OccurrencesService
import org.eclipse.scava.crossflow.language.xtext.web.selection.CrossflowOccurrencesService

/**
 * Use this class to register additional components to be used within the web application.
 */
class CrossflowWebModule extends AbstractCrossflowWebModule {
	
	def Class<? extends XtextServiceDispatcher> bindXtextServiceDispatcher() {
		CrossflowServiceDispatcher
	}
	
	def Class<? extends IWebDocumentProvider> bindIWebDocumentProvider() {
		WebDocumentProvider
	}
	
//	def Class<? extends OccurrencesService> bindOccurrencesService() {
//		CrossflowOccurrencesService
//	}
	
	def Class<? extends IDiagramServer.Provider> bindIDiagramServerProvider() {
		DiagramService
	}
	
	def Class<? extends IDiagramServer> bindIDiagramServer() {
		CrossflowDiagramServer
	}
	
	def Class<? extends IModelUpdateListener> bindIModelUpdateListener() {
		CrossflowUpdateListener
	}
	
	def Class<? extends ILayoutEngine> bindILayoutEngine() {
		CrossflowLayoutEngine
	}
	
	def Class<? extends IPopupModelFactory> bindIPopupModelFactory() {
		CrossflowPopupModelFactory
	}
	
	def Class<? extends IDiagramSelectionListener> bindIDiagramSelectionListener() {
		IDiagramSelectionListener.NullImpl
	}
	
	def Class<? extends IDiagramExpansionListener> bindIDiagramExpansionListener() {
		IDiagramExpansionListener.NullImpl
	}
	
	def Class<? extends IDiagramOpenListener> bindIDiagramOpenListener() {
		IDiagramOpenListener.NullImpl
	}
	
}
