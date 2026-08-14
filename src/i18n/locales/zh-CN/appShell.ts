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

/**
 * Simplified Chinese app-shell chrome translations. Typed as a complete record
 * of the English appShell module's keys, so adding an English key without its
 * Chinese translation is a compile error — extraction and translation land
 * together. Terminology follows `src/i18n/GLOSSARY.md`; zh has no grammatical
 * plural, so `.one`/`.other` variants intentionally share one string.
 */
export const appShellZhCN: Record<keyof typeof appShellEn, string> = {
  // ── Genmitsu 任务外壳 ──
  'appShell.brand': 'Genmitsu CAM',
  'appShell.projectActions': '项目操作',
  'appShell.machine.offline': '离线',
  'appShell.machine.notConfigured': '未配置机器',
  'appShell.machine.controlUnavailable': '实时控制不可用',
  'appShell.carveTask': '加工任务',
  'appShell.carve': '开始加工',
  'appShell.carveUnavailable': 'PureCut 尚未连接真实控制器，因此不能开始加工。',
  'appShell.generateToolpaths': '生成刀路',
  'appShell.generateToolpathsEmpty': '请先添加并启用至少一个加工操作。',
  'appShell.inspector': '属性检查器',

  // ── 水平任务栏 ──
  'appShell.task.workpiece': '工件',
  'appShell.task.workflow': '流程',
  'appShell.task.import': '导入',
  'appShell.task.stock': '毛坯',
  'appShell.task.geometry': '几何',
  'appShell.task.operations': '加工操作',
  'appShell.task.fixtures': '夹具',
  'appShell.task.tabs': '连接桥',
  'appShell.task.origin': '原点',
  'appShell.task.machineSetup': '机器设置',
  'appShell.task.current': '当前任务',
  'appShell.task.close': '关闭任务抽屉',

  // ── 任务抽屉 ──
  'appShell.workflow.description': '用这份清单找到下一项 CNC 准备任务。顶部栏中的每项任务仍可独立打开。',
  'appShell.workflow.progress': 'CNC 流程进度',
  'appShell.workflow.file': '文件',
  'appShell.workflow.material': '材料',
  'appShell.workflow.shape': '形状',
  'appShell.workflow.strategy': '加工策略',
  'appShell.workflow.operations': '加工操作',
  'appShell.workflow.machineSetup': '机器设置',
  'appShell.workflow.carve': '加工',
  'appShell.workflow.complete': '已完成',
  'appShell.workflow.current': '当前',
  'appShell.workflow.pending': '待处理',
  'appShell.workflow.unavailable': '不可用',
  'appShell.workflow.continue': '继续下一项任务',
  'appShell.workpiece.description': '检查构成当前工件的项目、毛坯、几何、夹具与连接桥。',
  'appShell.workpiece.projectSettings': '项目设置',
  'appShell.summary.geometry': '几何对象',
  'appShell.summary.operations': '加工操作',
  'appShell.summary.fixtures': '夹具',
  'appShell.summary.tabs': '连接桥',
  'appShell.import.description': '把 2D 几何或 3D 模型导入当前项目。',
  'appShell.import.chooseFile': '选择几何或模型',
  'appShell.import.gcodeUnavailable': 'PureCut 尚不支持以 G-code 作为源项目，因此不会把四步 G-code 流程伪装成可用。',
  'appShell.stock.description': '检查加工材料和毛坯范围；精确数值在右侧属性检查器中编辑。',
  'appShell.stock.material': '材料',
  'appShell.stock.size': '毛坯尺寸',
  'appShell.stock.editInspector': '在属性检查器中编辑毛坯',
  'appShell.operations.enabled': '已启用操作',
  'appShell.operations.generated': '已生成刀路',
  'appShell.operations.manageTools': '管理项目刀具',
  'appShell.operations.exportGcode': '导出 G-code',
  'appShell.fixtures.description': '选择夹具后，在属性检查器中编辑位置、尺寸、高度和可见状态。',
  'appShell.fixtures.empty': '尚未放置夹具。',
  'appShell.tabs.description': '选择连接桥后，在属性检查器中编辑位置、尺寸、高度和形状。',
  'appShell.tabs.empty': '尚未放置连接桥。',
  'appShell.object.enabled': '可见',
  'appShell.object.hidden': '隐藏',
  'appShell.origin.description': '检查项目原点；精确坐标在属性检查器中编辑。',
  'appShell.origin.editInspector': '在属性检查器中编辑原点',
  'appShell.machine.noLiveControl': '仅配置——没有真实机器证据',
  'appShell.machine.noLiveControlDescription': 'PureCut 可以保存机型定义以确定性导出 G-code，但不能连接、归位、Jog、探针归零或运行 CNC 控制器。',
  'appShell.machine.connect': '连接机器',
  'appShell.machine.secureStock': '固定毛坯',
  'appShell.machine.installBit': '安装刀具',
  'appShell.machine.setZZero': '设置 Z 零点',
  'appShell.machine.jogXY': 'Jog 到 XY 原点',
  'appShell.machine.chooseMachine': '在属性检查器中选择机器',
  'appShell.machine.changeMachine': '在属性检查器中更换机器',

  // ── Workspace tabs ──
  'appShell.workspace.sketch': '2D',
  'appShell.workspace.3d': '3D',
  'appShell.workspace.simulation': '仿真',
  'appShell.workspace.tabList': '工作区视图',

  // ── Workspace layout presets ──
  'appShell.layout.lcr': '显示左、中、右面板',
  'appShell.layout.lc': '显示左和中面板',
  'appShell.layout.c': '仅显示中间面板',
  'appShell.layout.cr': '显示中和右面板',
  'appShell.layout.presets': '工作区布局预设',

  // ── Right sidebar ──
  'appShell.sidebar.operations': '加工操作',
  'appShell.sidebar.tools': '刀具',
  'appShell.sidebar.tabList': '右侧栏',
  'appShell.sidebar.openOperations': '打开加工操作面板',
  'appShell.sidebar.closeOperations': '关闭加工操作面板',

  // ── Panels ──
  'appShell.panel.projectTree': '项目树',
  'appShell.panel.properties': '属性',
  'appShell.panel.expandProperties': '展开属性面板',
  'appShell.panel.closeProject': '关闭项目面板',
  'appShell.panel.cam': 'CAM 面板',
  'appShell.panel.close': '关闭',

  // ── Drawer (tablet) ──
  'appShell.drawer.tools': '工具',
  'appShell.drawer.creationTools': '创建工具',

  // ── Status bar — stock dimensions ──
  'appShell.status.stockDim': '毛坯：{width} × {height} × {thickness} {units}',
  'appShell.status.changeUnits': '将项目单位从 {from} 更改为 {to}',

  // ── Status bar — expand/collapse ──
  'appShell.status.expand': '展开状态栏',
  'appShell.status.collapse': '收起状态栏',

  // ── Status bar — visibility section label ──
  'appShell.status.viewVisibility': '视图可见性',

  // ── Status bar — feature labels ──
  'appShell.status.featureLabels': '特征标签',
  'appShell.status.showFeatureLabels': '显示特征标签',
  'appShell.status.hideFeatureLabels': '隐藏特征标签',

  // ── Status bar — grid ──
  'appShell.status.grid': '网格',
  'appShell.status.showGrid': '显示网格',
  'appShell.status.hideGrid': '隐藏网格',

  // ── Status bar — stock ──
  'appShell.status.stock': '毛坯',
  'appShell.status.showStock': '显示毛坯',
  'appShell.status.hideStock': '隐藏毛坯',

  // ── Status bar — backdrop ──
  'appShell.status.backdrop': '背景图',
  'appShell.status.noBackdrop': '未加载背景图',
  'appShell.status.showBackdrop': '显示背景图',
  'appShell.status.hideBackdrop': '隐藏背景图',

  // ── Status bar — origin ──
  'appShell.status.origin': '原点',
  'appShell.status.showOrigin': '显示原点',
  'appShell.status.hideOrigin': '隐藏原点',

  // ── Status bar — regions ──
  'appShell.status.regions': '区域',
  'appShell.status.noRegions': '项目中没有区域',
  'appShell.status.showRegions': '显示区域',
  'appShell.status.hideRegions': '隐藏区域',

  // ── Status bar — construction ──
  'appShell.status.construction': '构造线',
  'appShell.status.noConstruction': '项目中没有构造几何',
  'appShell.status.showConstruction': '显示构造几何',
  'appShell.status.hideConstruction': '隐藏构造几何',

  // ── Status bar — tabs ──
  'appShell.status.tabs': '连接桥',
  'appShell.status.noTabs': '项目中没有连接桥',
  'appShell.status.showTabs': '显示连接桥',
  'appShell.status.hideTabs': '隐藏连接桥',

  // ── Status bar — clamps ──
  'appShell.status.clamps': '夹具',
  'appShell.status.noClamps': '项目中没有夹具',
  'appShell.status.showClamps': '显示夹具',
  'appShell.status.hideClamps': '隐藏夹具',

  // ── Status bar — about ──
  'appShell.status.about': '关于 PureCutCNC',
  'appShell.status.shellMode': 'Shell 模式（仅开发环境）',

  // ── Tablet ──
  'appShell.tablet.rotatePrompt': '请将设备旋转至横屏模式',

  // ── Empty states ──
  'appShell.empty.camPanel': 'CAM 加工操作和刀路计划在阶段 4 中实现。',

  // ── Toolpath visibility ──
  'appShell.toolpath.show': '显示',
  'appShell.toolpath.cuts': '切削',
  'appShell.toolpath.leadIns': '导入',
  'appShell.toolpath.rapids': '快速移动',
  'appShell.toolpath.plunges': '下刀',
  'appShell.toolpath.retractions': '抬刀',
  'appShell.toolpath.directions': '方向',
  'appShell.toolpath.feedColours': '进给颜色',
  'appShell.toolpath.feedLegend': '进给百分比',

  // ── ToolRail ──
  'appShell.toolRail.shapes': '形状',
  'appShell.toolRail.align': '对齐',
  'appShell.toolRail.distribute': '分布',
  'appShell.toolRail.copy': '复制',
  'appShell.toolRail.move': '移动',
  'appShell.toolRail.delete': '删除',
  'appShell.toolRail.resize': '缩放',
  'appShell.toolRail.rotate': '旋转',
  'appShell.toolRail.mirror': '镜像',
  'appShell.toolRail.offset': '偏移',
  'appShell.toolRail.constraint': '约束',
  'appShell.toolRail.join': '合并',
  'appShell.toolRail.cut': '切割',
  'appShell.toolRail.addPoint': '添加点',
  'appShell.toolRail.deletePoint': '删除点',
  'appShell.toolRail.deleteSegment': '删除线段',
  'appShell.toolRail.disconnect': '断开连接',
  'appShell.toolRail.fillet': '圆角',
  'appShell.toolRail.trim': '修剪',
  'appShell.toolRail.extend': '延伸',
}
