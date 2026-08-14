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

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getActiveMachineDefinition } from '../../engine/gcode/definitions'
import { useI18n } from '../../i18n/i18nContext'
import type { MessageKey } from '../../i18n/locales/en'
import { platform } from '../../platform'
import { resolvedProjectFeatures } from '../../store/helpers/resolveFeatures'
import { useProjectStore } from '../../store/projectStore'
import type { Project } from '../../types/project'
import { getStockBounds } from '../../types/project'
import { formatLength } from '../../utils/units'
import { loadVersion } from '../../utils/version'
import { Icon } from '../Icon'
import { AppearanceControl } from './AppearanceControl'
import { LanguageControl } from './LanguageControl'
import { UnitConversionContext } from '../project/UnitConversionContext'
import { UnitConversionDialog } from '../project/UnitConversionDialog'
import { ExpandedPanelContext } from './expandedPanelContext'
import { TaskDrawer } from './TaskDrawer'
import { deriveTaskShellFacts, TASK_IDS, type TaskId } from './taskShellModel'
import { isTabletMode, useShellMode } from './useShellMode'
import type { SnapMode, SnapSettings } from '../../sketch/snapping'
import '../../styles/layout.css'

type CenterTab = 'sketch' | 'preview3d' | 'simulation'

interface AppShellProps {
  globalToolbar: ReactNode
  creationToolbar: ReactNode
  sketchCanvas: ReactNode
  featureTree: ReactNode
  propertiesPanel: ReactNode
  viewport3d: ReactNode
  simulationViewport: ReactNode
  operationsTaskPanel: ReactNode
  operationInspector: ReactNode
  toolsPanel: ReactNode
  centerTab: CenterTab
  onCenterTabChange: (tab: CenterTab) => void
  generatedOperationIds: ReadonlySet<string>
  onGenerateToolpaths: () => void
  onOpenImport: () => void
  onExportGcode: () => void
  statusBarExtras?: ReactNode
  onZoomToModel: () => void
  onZoomWindow: () => void
  zoomWindowActive: boolean
  onImportComplete?: () => void
  onExportModel: () => void
  onPrintDesign?: () => void
  snapSettings: SnapSettings
  activeSnapMode?: SnapMode | null
  onToggleSnapEnabled: () => void
  onToggleSnapMode: (mode: SnapMode) => void
  onShowAbout?: () => void
}

const TASK_LABEL_KEYS: Record<(typeof TASK_IDS)[number], MessageKey> = {
  workpiece: 'appShell.task.workpiece',
  workflow: 'appShell.task.workflow',
  import: 'appShell.task.import',
  stock: 'appShell.task.stock',
  geometry: 'appShell.task.geometry',
  operations: 'appShell.task.operations',
  fixtures: 'appShell.task.fixtures',
  tabs: 'appShell.task.tabs',
  origin: 'appShell.task.origin',
}

const TASK_ICONS: Record<(typeof TASK_IDS)[number], string> = {
  workpiece: 'project',
  workflow: 'check',
  import: 'import',
  stock: 'stock',
  geometry: 'composite',
  operations: 'pocket',
  fixtures: 'clamp',
  tabs: 'tab',
  origin: 'point-add',
}

const CENTER_TABS: readonly CenterTab[] = ['sketch', 'preview3d', 'simulation']

function nextTab(current: CenterTab, direction: 1 | -1): CenterTab {
  const currentIndex = CENTER_TABS.indexOf(current)
  return CENTER_TABS[(currentIndex + direction + CENTER_TABS.length) % CENTER_TABS.length]
}

export function AppShell({
  globalToolbar,
  creationToolbar,
  sketchCanvas,
  featureTree,
  propertiesPanel,
  viewport3d,
  simulationViewport,
  operationsTaskPanel,
  operationInspector,
  toolsPanel,
  centerTab,
  onCenterTabChange,
  generatedOperationIds,
  onGenerateToolpaths,
  onOpenImport,
  onExportGcode,
  statusBarExtras,
  onShowAbout,
}: AppShellProps) {
  const shellMode = useShellMode()
  const tabletShell = isTabletMode(shellMode)
  const { t } = useI18n()
  const [activeTask, setActiveTask] = useState<TaskId | null>('workflow')
  const [inspectorOpen, setInspectorOpen] = useState(() => !tabletShell)
  const [expandedPanel, setExpandedPanel] = useState<null | 'inspector'>(null)
  const [statusBarExpanded, setStatusBarExpanded] = useState(false)
  const [pendingUnits, setPendingUnits] = useState<Project['meta']['units'] | null>(null)
  const [appVersion, setAppVersion] = useState<string | null>(null)

  const {
    project,
    dirty,
    setGrid,
    setStock,
    setOrigin,
    updateBackdrop,
    setShowFeatureInfo,
    setAllRegionsVisible,
    setAllConstructionVisible,
    setAllTabsVisible,
    setAllClampsVisible,
    setUnits,
    selectProject,
    selectStock,
    selectClampsRoot,
    selectTabsRoot,
    selectOrigin,
  } = useProjectStore()

  const facts = useMemo(
    () => deriveTaskShellFacts(project, generatedOperationIds),
    [generatedOperationIds, project],
  )
  const selectedMachine = getActiveMachineDefinition(project)
  const resolvedFeatures = useMemo(() => resolvedProjectFeatures(project), [project])
  const stockBounds = getStockBounds(project.stock)
  const stockWidth = stockBounds.maxX - stockBounds.minX
  const stockHeight = stockBounds.maxY - stockBounds.minY
  const regionCount = resolvedFeatures.filter((feature) => feature.operation === 'region').length
  const anyRegionsVisible = resolvedFeatures.some((feature) => feature.operation === 'region' && feature.visible)
  const constructionCount = resolvedFeatures.filter((feature) => feature.operation === 'construction').length
  const anyConstructionVisible = resolvedFeatures.some((feature) => feature.operation === 'construction' && feature.visible)
  const anyTabsVisible = project.tabs.some((tab) => tab.visible)
  const anyClampsVisible = project.clamps.some((clamp) => clamp.visible)

  const requestUnitConversion = useCallback((toUnits: Project['meta']['units']) => {
    if (toUnits !== project.meta.units) setPendingUnits(toUnits)
  }, [project.meta.units])
  const commitPendingUnits = useCallback((mode: 'convert' | 'reinterpret') => {
    if (!pendingUnits || pendingUnits === project.meta.units) return
    const nextUnits = pendingUnits
    setPendingUnits(null)
    setUnits(nextUnits, mode)
  }, [pendingUnits, project.meta.units, setUnits])

  const expandedPanelContextValue = useMemo(
    () => ({ closeExpandedPanel: () => setExpandedPanel(null) }),
    [],
  )

  useEffect(() => {
    if (platform.isDesktop || !onShowAbout) return
    let active = true
    loadVersion().then((version) => {
      if (active) setAppVersion(version)
    })
    return () => { active = false }
  }, [onShowAbout])

  useEffect(() => {
    if (!expandedPanel) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setExpandedPanel(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expandedPanel])

  function selectInspectorForTask(task: TaskId) {
    if (task === 'workpiece' || task === 'machine') selectProject()
    else if (task === 'stock') selectStock()
    else if (task === 'fixtures') selectClampsRoot()
    else if (task === 'tabs') selectTabsRoot()
    else if (task === 'origin') selectOrigin()
  }

  function openTask(task: TaskId) {
    setActiveTask(task)
    if (!tabletShell) setInspectorOpen(true)
    selectInspectorForTask(task)
  }

  function toggleTask(task: (typeof TASK_IDS)[number]) {
    if (activeTask === task) {
      setActiveTask(null)
      return
    }
    openTask(task)
  }

  useEffect(() => {
    function handleOpenTask(event: Event) {
      const task = (event as CustomEvent<TaskId>).detail
      if (TASK_IDS.includes(task as (typeof TASK_IDS)[number]) || task === 'machine') {
        openTask(task)
      }
    }
    window.addEventListener('purecutcnc:open-task', handleOpenTask)
    return () => window.removeEventListener('purecutcnc:open-task', handleOpenTask)
  })

  function handleViewKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      onCenterTabChange(nextTab(centerTab, 1))
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      onCenterTabChange(nextTab(centerTab, -1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      onCenterTabChange(CENTER_TABS[0])
    } else if (event.key === 'End') {
      event.preventDefault()
      onCenterTabChange(CENTER_TABS[CENTER_TABS.length - 1])
    }
  }

  const inspector = activeTask === 'operations' ? operationInspector : propertiesPanel
  const nextUnits = project.meta.units === 'mm' ? 'inch' : 'mm'
  const changeUnitsLabel = t('appShell.status.changeUnits', {
    from: project.meta.units === 'mm' ? t('featureTree.properties.units.mm') : t('featureTree.properties.units.inch'),
    to: nextUnits === 'mm' ? t('featureTree.properties.units.mm') : t('featureTree.properties.units.inch'),
  })

  return (
    <UnitConversionContext.Provider value={requestUnitConversion}>
      <ExpandedPanelContext.Provider value={expandedPanelContextValue}>
        <div
          className="app-shell task-shell"
          data-shell-mode={shellMode}
          data-task-open={activeTask ? 'true' : undefined}
          data-inspector-open={inspectorOpen ? 'true' : undefined}
        >
          <header className="task-shell-header">
            <div className="task-global-row">
              <div className="task-brand-block">
                <strong>{t('appShell.brand')}</strong>
                <span>{project.meta.name}</span>
                <small
                  className={dirty ? 'task-project-dirty task-project-dirty--active' : 'task-project-dirty'}
                  title={dirty ? t('shell.topBar.unsavedTitle') : t('shell.topBar.savedTitle')}
                >
                  {dirty ? t('shell.topBar.unsaved') : t('shell.topBar.saved')}
                </small>
              </div>
              <details className="task-project-actions">
                <summary aria-label={t('appShell.projectActions')}>•••</summary>
                <div className="task-project-actions__popover">{globalToolbar}</div>
              </details>
              <div className="task-global-spacer" />
              <div className="task-global-preferences">
                <AppearanceControl />
                <LanguageControl />
              </div>
              <button className="task-machine-state" type="button" onClick={() => openTask('machine')}>
                <Icon id="gear" size={16} />
                <span>
                  <strong>{selectedMachine?.name ?? t('appShell.machine.notConfigured')}</strong>
                  <small>{t('appShell.machine.offline')} · {t('appShell.machine.controlUnavailable')}</small>
                </span>
              </button>
              <button className="task-run-state" type="button" disabled title={t('appShell.carveUnavailable')}>
                {t('appShell.carveTask')}
              </button>
              <button className="task-carve-button" type="button" disabled title={t('appShell.carveUnavailable')}>
                {t('appShell.carve')}
              </button>
            </div>

            <nav className="task-function-row" aria-label={t('appShell.task.current')}>
              {TASK_IDS.map((task) => (
                <button
                  key={task}
                  className={activeTask === task ? 'task-function task-function--active' : 'task-function'}
                  type="button"
                  aria-pressed={activeTask === task}
                  onClick={() => toggleTask(task)}
                >
                  <Icon id={TASK_ICONS[task]} size={15} />
                  <span>{t(TASK_LABEL_KEYS[task])}</span>
                  {task === 'operations' && project.operations.length > 0 ? <small>{project.operations.length}</small> : null}
                </button>
              ))}
              <button
                className="task-generate-button"
                type="button"
                disabled={facts.enabledOperationCount === 0}
                title={facts.enabledOperationCount === 0 ? t('appShell.generateToolpathsEmpty') : undefined}
                onClick={onGenerateToolpaths}
              >
                <Icon id="refresh" size={15} />
                {t('appShell.generateToolpaths')}
              </button>
            </nav>

            <div className="task-view-row" role="tablist" aria-label={t('appShell.workspace.tabList')}>
              {CENTER_TABS.map((tab) => {
                const label = tab === 'sketch'
                  ? t('appShell.workspace.sketch')
                  : tab === 'preview3d'
                    ? t('appShell.workspace.3d')
                    : t('appShell.workspace.simulation')
                return (
                  <button
                    id={`workspace-tab-${tab}`}
                    key={tab}
                    className={centerTab === tab ? 'task-view-tab task-view-tab--active' : 'task-view-tab'}
                    type="button"
                    role="tab"
                    aria-selected={centerTab === tab}
                    aria-controls={`workspace-panel-${tab}`}
                    tabIndex={centerTab === tab ? 0 : -1}
                    onClick={() => onCenterTabChange(tab)}
                    onKeyDown={handleViewKeyDown}
                  >
                    {label}
                  </button>
                )
              })}
              <button
                className={inspectorOpen ? 'task-inspector-toggle task-inspector-toggle--active' : 'task-inspector-toggle'}
                type="button"
                aria-pressed={inspectorOpen}
                onClick={() => setInspectorOpen((open) => !open)}
              >
                {t('appShell.inspector')}
              </button>
            </div>
          </header>

          <div className="task-workspace">
            <aside className="app-left-rail" aria-label={t('appShell.drawer.creationTools')}>
              {creationToolbar}
            </aside>

            {activeTask ? (
              <TaskDrawer
                task={activeTask}
                facts={facts}
                featureTree={featureTree}
                operationsPanel={operationsTaskPanel}
                toolsPanel={toolsPanel}
                onClose={() => setActiveTask(null)}
                onImport={onOpenImport}
                onOpenTask={openTask}
                onExportGcode={onExportGcode}
              />
            ) : null}

            <main className="panel-centre">
              <div className="centre-stage">
                <div
                  id="workspace-panel-sketch"
                  className={centerTab === 'sketch' ? 'centre-view centre-view--active' : 'centre-view'}
                  role="tabpanel"
                  aria-labelledby="workspace-tab-sketch"
                  aria-hidden={centerTab !== 'sketch'}
                >
                  {sketchCanvas}
                </div>
                <div
                  id="workspace-panel-preview3d"
                  className={centerTab === 'preview3d' ? 'centre-view centre-view--active' : 'centre-view'}
                  role="tabpanel"
                  aria-labelledby="workspace-tab-preview3d"
                  aria-hidden={centerTab !== 'preview3d'}
                >
                  {viewport3d}
                </div>
                <div
                  id="workspace-panel-simulation"
                  className={centerTab === 'simulation' ? 'centre-view centre-view--active' : 'centre-view'}
                  role="tabpanel"
                  aria-labelledby="workspace-tab-simulation"
                  aria-hidden={centerTab !== 'simulation'}
                >
                  {simulationViewport}
                </div>
              </div>
            </main>

            {inspectorOpen ? (
              <aside className="task-inspector" aria-label={t('appShell.inspector')}>
                <header>
                  <span>{t('appShell.inspector')}</span>
                  <button type="button" aria-label={t('appShell.panel.expandProperties')} onClick={() => setExpandedPanel('inspector')}>
                    <Icon id="expand" />
                  </button>
                </header>
                <div className="task-inspector__content">{inspector}</div>
              </aside>
            ) : null}
          </div>

          <footer className={`app-statusbar ${tabletShell ? (statusBarExpanded ? 'app-statusbar--tablet-expanded' : 'app-statusbar--tablet-compact') : ''}`}>
            <span>{project.meta.name}</span>
            <button
              className="statusbar-units"
              type="button"
              onClick={() => requestUnitConversion(nextUnits)}
              title={changeUnitsLabel}
              aria-label={changeUnitsLabel}
            >
              {project.meta.units.toUpperCase()}
            </button>
            <span>{t('appShell.status.stockDim', {
              width: formatLength(stockWidth, project.meta.units),
              height: formatLength(stockHeight, project.meta.units),
              thickness: formatLength(project.stock.thickness, project.meta.units),
              units: project.meta.units,
            })}</span>
            {tabletShell ? (
              <button
                type="button"
                className="statusbar-expand-btn"
                onClick={() => setStatusBarExpanded((expanded) => !expanded)}
                title={statusBarExpanded ? t('appShell.status.collapse') : t('appShell.status.expand')}
                aria-label={statusBarExpanded ? t('appShell.status.collapse') : t('appShell.status.expand')}
                aria-expanded={statusBarExpanded}
              >
                {statusBarExpanded ? '▾' : '▸'}
              </button>
            ) : null}
            <div className={`statusbar-visibility ${tabletShell && !statusBarExpanded ? 'statusbar-visibility--hidden' : ''}`} aria-label={t('appShell.status.viewVisibility')}>
              <button
                className={project.meta.showFeatureInfo ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'}
                type="button"
                aria-pressed={project.meta.showFeatureInfo}
                title={project.meta.showFeatureInfo ? t('appShell.status.hideFeatureLabels') : t('appShell.status.showFeatureLabels')}
                onClick={() => setShowFeatureInfo(!project.meta.showFeatureInfo)}
              >
                {t('appShell.status.featureLabels')}
              </button>
              <button className={project.grid.visible ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'} type="button" aria-pressed={project.grid.visible} onClick={() => setGrid({ ...project.grid, visible: !project.grid.visible })}>{t('appShell.status.grid')}</button>
              <button className={project.stock.visible ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'} type="button" aria-pressed={project.stock.visible} onClick={() => setStock({ ...project.stock, visible: !project.stock.visible })}>{t('appShell.status.stock')}</button>
              <button className={project.backdrop?.visible ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'} type="button" aria-pressed={project.backdrop?.visible ?? false} disabled={!project.backdrop} onClick={() => { if (project.backdrop) updateBackdrop({ visible: !project.backdrop.visible }) }}>{t('appShell.status.backdrop')}</button>
              <button className={project.origin.visible ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'} type="button" aria-pressed={project.origin.visible} onClick={() => setOrigin({ ...project.origin, visible: !project.origin.visible })}>{t('appShell.status.origin')}</button>
              <button className={anyRegionsVisible ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'} type="button" aria-pressed={anyRegionsVisible} disabled={regionCount === 0} onClick={() => setAllRegionsVisible(!anyRegionsVisible)}>{t('appShell.status.regions')}</button>
              <button className={anyConstructionVisible ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'} type="button" aria-pressed={anyConstructionVisible} disabled={constructionCount === 0} onClick={() => setAllConstructionVisible(!anyConstructionVisible)}>{t('appShell.status.construction')}</button>
              <button className={anyTabsVisible ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'} type="button" aria-pressed={anyTabsVisible} disabled={project.tabs.length === 0} onClick={() => setAllTabsVisible(!anyTabsVisible)}>{t('appShell.status.tabs')}</button>
              <button className={anyClampsVisible ? 'statusbar-toggle statusbar-toggle--active' : 'statusbar-toggle'} type="button" aria-pressed={anyClampsVisible} disabled={project.clamps.length === 0} onClick={() => setAllClampsVisible(!anyClampsVisible)}>{t('appShell.status.clamps')}</button>
            </div>
            {statusBarExtras}
            {!platform.isDesktop && onShowAbout ? (
              <button className="statusbar-about" type="button" onClick={onShowAbout}>
                PureCutCNC{appVersion ? ` ${appVersion}` : ''}
              </button>
            ) : null}
          </footer>

          {expandedPanel ? (
            <div className="dialog-backdrop" onClick={() => setExpandedPanel(null)}>
              <div className="dialog dialog--panel-expand" onClick={(event) => event.stopPropagation()}>
                <div className="dialog-header">
                  <h2 className="dialog-title">{t('appShell.inspector')}</h2>
                  <button className="dialog-close" onClick={() => setExpandedPanel(null)} aria-label={t('appShell.panel.close')} type="button">×</button>
                </div>
                <div className="dialog-body dialog-body--panel-expand">{inspector}</div>
              </div>
            </div>
          ) : null}
        </div>
      </ExpandedPanelContext.Provider>
      {pendingUnits && pendingUnits !== project.meta.units ? (
        <UnitConversionDialog
          fromUnits={project.meta.units}
          toUnits={pendingUnits}
          onConvert={() => commitPendingUnits('convert')}
          onReinterpret={() => commitPendingUnits('reinterpret')}
          onCancel={() => setPendingUnits(null)}
        />
      ) : null}
    </UnitConversionContext.Provider>
  )
}
