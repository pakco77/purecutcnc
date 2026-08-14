/**
 * Copyright 2026 Franja (Frank) Povazanj
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { appShellEn } from '../en/appShell'

/** German app-shell chrome translations. See `src/i18n/GLOSSARY.md`. */
export const appShellDe: Record<keyof typeof appShellEn, string> = {
  // ── Genmitsu task shell ──
  'appShell.brand': 'Genmitsu CAM',
  'appShell.projectActions': 'Projektaktionen',
  'appShell.machine.offline': 'Offline',
  'appShell.machine.notConfigured': 'Maschine nicht konfiguriert',
  'appShell.machine.controlUnavailable': 'Live-Steuerung nicht verfügbar',
  'appShell.carveTask': 'Fräsauftrag',
  'appShell.carve': 'Fräsen',
  'appShell.carveUnavailable': 'Fräsen ist nicht verfügbar, da PureCut keine Live-Controller-Verbindung besitzt.',
  'appShell.generateToolpaths': 'Werkzeugwege erzeugen',
  'appShell.generateToolpathsEmpty': 'Fügen Sie zuerst eine aktivierte Operation hinzu.',
  'appShell.inspector': 'Inspektor',

  // ── Horizontal task bar ──
  'appShell.task.workpiece': 'Werkstück',
  'appShell.task.workflow': 'Ablauf',
  'appShell.task.import': 'Import',
  'appShell.task.stock': 'Rohteil',
  'appShell.task.geometry': 'Geometrie',
  'appShell.task.operations': 'Operationen',
  'appShell.task.fixtures': 'Spannmittel',
  'appShell.task.tabs': 'Haltestege',
  'appShell.task.origin': 'Nullpunkt',
  'appShell.task.machineSetup': 'Maschineneinrichtung',
  'appShell.task.current': 'Aktuelle Aufgabe',
  'appShell.task.close': 'Aufgabenbereich schließen',

  // ── Task drawer ──
  'appShell.workflow.description': 'Diese Liste zeigt die nächste CNC-Vorbereitungsaufgabe. Jede Aufgabe bleibt über die obere Leiste direkt erreichbar.',
  'appShell.workflow.progress': 'CNC-Ablauffortschritt',
  'appShell.workflow.file': 'Datei',
  'appShell.workflow.material': 'Material',
  'appShell.workflow.shape': 'Form',
  'appShell.workflow.strategy': 'Strategie',
  'appShell.workflow.operations': 'Operationen',
  'appShell.workflow.machineSetup': 'Maschineneinrichtung',
  'appShell.workflow.carve': 'Fräsen',
  'appShell.workflow.complete': 'Fertig',
  'appShell.workflow.current': 'Aktuell',
  'appShell.workflow.pending': 'Ausstehend',
  'appShell.workflow.unavailable': 'Nicht verfügbar',
  'appShell.workflow.continue': 'Mit nächster Aufgabe fortfahren',
  'appShell.workpiece.description': 'Projekt, Rohteil, Geometrie, Spannmittel und Haltestege dieses Werkstücks prüfen.',
  'appShell.workpiece.projectSettings': 'Projekteinstellungen',
  'appShell.summary.geometry': 'Geometrieobjekte',
  'appShell.summary.operations': 'Operationen',
  'appShell.summary.fixtures': 'Spannmittel',
  'appShell.summary.tabs': 'Haltestege',
  'appShell.import.description': '2D-Geometrie oder ein 3D-Modell in das aktuelle Projekt importieren.',
  'appShell.import.chooseFile': 'Geometrie oder Modell auswählen',
  'appShell.import.gcodeUnavailable': 'Direkte G-Code-Quellprojekte werden von PureCut noch nicht unterstützt; der vierstufige G-Code-Ablauf wird daher nicht als verfügbar dargestellt.',
  'appShell.stock.description': 'Material und Rohteilabmessungen prüfen. Exakte Werte werden im Inspektor bearbeitet.',
  'appShell.stock.material': 'Material',
  'appShell.stock.size': 'Rohteilgröße',
  'appShell.stock.editInspector': 'Rohteil im Inspektor bearbeiten',
  'appShell.operations.enabled': 'Aktivierte Operationen',
  'appShell.operations.generated': 'Erzeugte Werkzeugwege',
  'appShell.operations.manageTools': 'Projektwerkzeuge verwalten',
  'appShell.operations.exportGcode': 'G-Code exportieren',
  'appShell.fixtures.description': 'Spannmittel auswählen und Position, Größe, Höhe und Sichtbarkeit im Inspektor bearbeiten.',
  'appShell.fixtures.empty': 'Keine Spannmittel platziert.',
  'appShell.tabs.description': 'Haltesteg auswählen und Position, Größe, Höhe und Form im Inspektor bearbeiten.',
  'appShell.tabs.empty': 'Keine Haltestege platziert.',
  'appShell.object.enabled': 'Sichtbar',
  'appShell.object.hidden': 'Ausgeblendet',
  'appShell.origin.description': 'Projektnullpunkt prüfen. Exakte Koordinaten werden im Inspektor bearbeitet.',
  'appShell.origin.editInspector': 'Nullpunkt im Inspektor bearbeiten',
  'appShell.machine.noLiveControl': 'Nur Konfiguration — keine Live-Maschinendaten',
  'appShell.machine.noLiveControlDescription': 'PureCut kann eine Maschinendefinition für deterministischen G-Code speichern, aber keinen CNC-Controller verbinden, referenzieren, verfahren, antasten oder ausführen.',
  'appShell.machine.connect': 'Maschine verbinden',
  'appShell.machine.secureStock': 'Rohteil befestigen',
  'appShell.machine.installBit': 'Fräser einsetzen',
  'appShell.machine.setZZero': 'Z-Nullpunkt setzen',
  'appShell.machine.jogXY': 'Zum XY-Nullpunkt verfahren',
  'appShell.machine.chooseMachine': 'Maschine im Inspektor auswählen',
  'appShell.machine.changeMachine': 'Maschine im Inspektor ändern',

  // ── Workspace tabs ──
  'appShell.workspace.sketch': '2D',
  'appShell.workspace.3d': '3D',
  'appShell.workspace.simulation': 'Simulation',
  'appShell.workspace.tabList': 'Arbeitsbereich-Ansichten',

  // ── Workspace layout presets ──
  'appShell.layout.lcr': 'Linke, mittlere und rechte Bereiche anzeigen',
  'appShell.layout.lc': 'Linke und mittlere Bereiche anzeigen',
  'appShell.layout.c': 'Nur mittleren Bereich anzeigen',
  'appShell.layout.cr': 'Mittlere und rechte Bereiche anzeigen',
  'appShell.layout.presets': 'Layout-Voreinstellungen des Arbeitsbereichs',

  // ── Right sidebar ──
  'appShell.sidebar.operations': 'Operationen',
  'appShell.sidebar.tools': 'Werkzeuge',
  'appShell.sidebar.tabList': 'Rechte Seitenleiste',
  'appShell.sidebar.openOperations': 'Operationsbereich öffnen',
  'appShell.sidebar.closeOperations': 'Operationsbereich schließen',

  // ── Panels ──
  'appShell.panel.projectTree': 'Projektbaum',
  'appShell.panel.properties': 'Eigenschaften',
  'appShell.panel.expandProperties': 'Eigenschaftenbereich ausklappen',
  'appShell.panel.closeProject': 'Projektbereich schließen',
  'appShell.panel.cam': 'CAM-Bereich',
  'appShell.panel.close': 'Schließen',

  // ── Drawer (tablet) ──
  'appShell.drawer.tools': 'Werkzeuge',
  'appShell.drawer.creationTools': 'Erstellungswerkzeuge',

  // ── Status bar — stock dimensions ──
  'appShell.status.stockDim': 'Rohteil: {width} × {height} × {thickness} {units}',
  'appShell.status.changeUnits': 'Projekteinheiten von {from} in {to} ändern',

  // ── Status bar — expand/collapse ──
  'appShell.status.expand': 'Statusleiste ausklappen',
  'appShell.status.collapse': 'Statusleiste einklappen',

  // ── Status bar — visibility section label ──
  'appShell.status.viewVisibility': 'Sichtbarkeit der Ansicht',

  // ── Status bar — feature labels ──
  'appShell.status.featureLabels': 'Feature-Beschriftungen',
  'appShell.status.showFeatureLabels': 'Feature-Beschriftungen anzeigen',
  'appShell.status.hideFeatureLabels': 'Feature-Beschriftungen ausblenden',

  // ── Status bar — grid ──
  'appShell.status.grid': 'Raster',
  'appShell.status.showGrid': 'Raster anzeigen',
  'appShell.status.hideGrid': 'Raster ausblenden',

  // ── Status bar — stock ──
  'appShell.status.stock': 'Rohteil',
  'appShell.status.showStock': 'Rohteil anzeigen',
  'appShell.status.hideStock': 'Rohteil ausblenden',

  // ── Status bar — backdrop ──
  'appShell.status.backdrop': 'Hintergrund',
  'appShell.status.noBackdrop': 'Kein Hintergrund geladen',
  'appShell.status.showBackdrop': 'Hintergrund anzeigen',
  'appShell.status.hideBackdrop': 'Hintergrund ausblenden',

  // ── Status bar — origin ──
  'appShell.status.origin': 'Nullpunkt',
  'appShell.status.showOrigin': 'Nullpunkt anzeigen',
  'appShell.status.hideOrigin': 'Nullpunkt ausblenden',

  // ── Status bar — regions ──
  'appShell.status.regions': 'Bereiche',
  'appShell.status.noRegions': 'Keine Bereiche im Projekt',
  'appShell.status.showRegions': 'Bereiche anzeigen',
  'appShell.status.hideRegions': 'Bereiche ausblenden',

  // ── Status bar — construction ──
  'appShell.status.construction': 'Konstruktion',
  'appShell.status.noConstruction': 'Keine Konstruktionsgeometrie im Projekt',
  'appShell.status.showConstruction': 'Konstruktionsgeometrie anzeigen',
  'appShell.status.hideConstruction': 'Konstruktionsgeometrie ausblenden',

  // ── Status bar — tabs ──
  'appShell.status.tabs': 'Haltestege',
  'appShell.status.noTabs': 'Keine Haltestege im Projekt',
  'appShell.status.showTabs': 'Haltestege anzeigen',
  'appShell.status.hideTabs': 'Haltestege ausblenden',

  // ── Status bar — clamps ──
  'appShell.status.clamps': 'Spannzwingen',
  'appShell.status.noClamps': 'Keine Spannzwingen im Projekt',
  'appShell.status.showClamps': 'Spannzwingen anzeigen',
  'appShell.status.hideClamps': 'Spannzwingen ausblenden',

  // ── Status bar — about ──
  'appShell.status.about': 'Über PureCutCNC',
  'appShell.status.shellMode': 'Shell-Modus (nur Entwicklung)',

  // ── Tablet ──
  'appShell.tablet.rotatePrompt': 'Bitte drehen Sie Ihr Gerät ins Querformat',

  // ── Empty states ──
  'appShell.empty.camPanel': 'CAM-Operationen und Werkzeugwege sind für Phase 4 geplant.',

  // ── Toolpath visibility ──
  'appShell.toolpath.show': 'Anzeigen',
  'appShell.toolpath.cuts': 'Schnitte',
  'appShell.toolpath.leadIns': 'Anfahrten',
  'appShell.toolpath.rapids': 'Eilgänge',
  'appShell.toolpath.plunges': 'Eintauchbewegungen',
  'appShell.toolpath.retractions': 'Rückzüge',
  'appShell.toolpath.directions': 'Richtungen',
  'appShell.toolpath.feedColours': 'Vorschubfarben',
  'appShell.toolpath.feedLegend': 'Vorschubprozentsatz',

  // ── ToolRail ──
  'appShell.toolRail.shapes': 'Formen',
  'appShell.toolRail.align': 'Ausrichten',
  'appShell.toolRail.distribute': 'Verteilen',
  'appShell.toolRail.copy': 'Kopieren',
  'appShell.toolRail.move': 'Verschieben',
  'appShell.toolRail.delete': 'Löschen',
  'appShell.toolRail.resize': 'Größe ändern',
  'appShell.toolRail.rotate': 'Drehen',
  'appShell.toolRail.mirror': 'Spiegeln',
  'appShell.toolRail.offset': 'Offset',
  'appShell.toolRail.constraint': 'Bedingung',
  'appShell.toolRail.join': 'Vereinigen',
  'appShell.toolRail.cut': 'Abziehen',
  'appShell.toolRail.addPoint': 'Punkt hinzufügen',
  'appShell.toolRail.deletePoint': 'Punkt löschen',
  'appShell.toolRail.deleteSegment': 'Segment löschen',
  'appShell.toolRail.disconnect': 'Trennen',
  'appShell.toolRail.fillet': 'Verrundung',
  'appShell.toolRail.trim': 'Stutzen',
  'appShell.toolRail.extend': 'Dehnen',
}
