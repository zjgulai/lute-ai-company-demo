/**
 * Cytoscape force-directed graph for path AI Company collective memory.
 *
 * @public Container expects DOM element with id 'memory-graph' (or pass containerId).
 * @public Loads data/memory.json (aim_memory_read_all export shape: {entities, relations}).
 * @public Auto-inits on DOMContentLoaded if #memory-graph exists.
 *
 * Vendor: assets/js/lib/cytoscape.min.js (CDN fallback in HTML).
 */

const ENTITY_COLORS = {
  agent:      '#4a90e2',
  engagement: '#f5a623',
  lesson:     '#7ed321',
  decision:   '#d0021b',
  project:    '#9013fe',
  sku:        '#f8e71c',
  region:     '#b8b8b8',
};

const ENTITY_LABEL_ZH = {
  agent: 'AI 员工',
  engagement: '任务',
  lesson: '教训',
  decision: '决策',
  project: '项目',
  sku: 'SKU',
  region: '区域',
};

const RELATION_STYLES = {
  supersedes:    { color: '#d0021b', style: 'solid', width: 3, label: '取代' },
  produced:      { color: '#f5a623', style: 'solid', width: 2, label: '产出' },
  improved_by:   { color: '#7ed321', style: 'dashed', width: 2, label: '改进自' },
  depended_on:   { color: '#4a90e2', style: 'dashed', width: 2, label: '依赖于' },
  assigned_to:   { color: '#5c5c5c', style: 'solid', width: 1.5, label: '分配给' },
  failed_due_to: { color: '#d0021b', style: 'dashed', width: 2, label: '失败因' },
  coached_by:    { color: '#9013fe', style: 'solid', width: 1.5, label: '指导' },
  reports_to:    { color: '#5c5c5c', style: 'solid', width: 1.5, label: '汇报至' },
};

async function fetchMemoryData(dataPath) {
  const resp = await fetch(dataPath);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  return resp.json();
}

function entityToNode(e) {
  return {
    data: {
      id: e.name,
      label: e.name.length > 30 ? e.name.slice(0, 28) + '…' : e.name,
      fullLabel: e.name,
      entityType: e.entityType,
      observations: e.observations || [],
      color: ENTITY_COLORS[e.entityType] || '#cccccc',
    }
  };
}

function relationToEdge(r, i) {
  return {
    data: {
      id: `e${i}`,
      source: r.from,
      target: r.to,
      label: RELATION_STYLES[r.relationType]?.label || r.relationType,
      relationType: r.relationType,
    }
  };
}

function buildCytoscapeStyle() {
  return [
    {
      selector: 'node',
      style: {
        'background-color': 'data(color)',
        'label': 'data(label)',
        'font-size': '10px',
        'font-family': 'JetBrains Mono, Menlo, monospace',
        'text-valign': 'bottom',
        'text-margin-y': 6,
        'text-wrap': 'wrap',
        'text-max-width': 120,
        'color': '#1a1a1a',
        'width': 28,
        'height': 28,
        'border-width': 1.5,
        'border-color': '#1a1a1a',
        'border-opacity': 0.15,
        'transition-property': 'background-color, border-width, border-opacity, width, height',
        'transition-duration': '180ms',
      }
    },
    {
      selector: 'node:active, node.cy-hovered',
      style: { 'border-width': 4, 'border-opacity': 1, 'width': 36, 'height': 36 }
    },
    {
      selector: 'node.focused',
      style: {
        'border-width': 4, 'border-color': '#1a1a1a', 'border-opacity': 1,
        'width': 40, 'height': 40, 'z-index': 999,
      }
    },
    { selector: 'node.dimmed', style: { 'opacity': 0.18 } },
    {
      selector: 'edge',
      style: {
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'target-arrow-color': ele => RELATION_STYLES[ele.data('relationType')]?.color || '#cccccc',
        'line-color': ele => RELATION_STYLES[ele.data('relationType')]?.color || '#cccccc',
        'line-style': ele => RELATION_STYLES[ele.data('relationType')]?.style || 'solid',
        'width': ele => RELATION_STYLES[ele.data('relationType')]?.width || 1.5,
        'opacity': 0.55,
        'label': '',
        'font-size': '9px',
        'color': '#5c5c5c',
        'font-family': 'Inter, sans-serif',
        'transition-property': 'opacity, width',
        'transition-duration': '180ms',
      }
    },
    {
      selector: 'edge.highlighted',
      style: {
        'opacity': 1,
        'width': ele => (RELATION_STYLES[ele.data('relationType')]?.width || 1.5) + 1.5,
        'label': 'data(label)',
        'text-rotation': 'autorotate',
        'text-background-color': '#fafaf8',
        'text-background-opacity': 0.85,
        'text-background-padding': 4,
      }
    },
    { selector: 'edge.dimmed', style: { 'opacity': 0.08 } },
  ];
}

function buildLayout() {
  return {
    name: 'cose',
    animate: 'end',
    animationDuration: 800,
    randomize: false,
    idealEdgeLength: 80,
    nodeRepulsion: 8000,
    nodeOverlap: 12,
    gravity: 0.3,
    numIter: 1200,
    padding: 30,
    componentSpacing: 80,
  };
}

function createTooltip(container) {
  const tooltip = document.createElement('div');
  tooltip.style.cssText = `
    position: absolute; z-index: 9999; pointer-events: none;
    background: #ffffff; border: 1px solid #e8e3dc; border-radius: 8px;
    padding: 12px 14px; max-width: 360px; font-family: 'Inter', sans-serif;
    font-size: 13px; line-height: 1.55; color: #1a1a1a;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    opacity: 0; transition: opacity 150ms; display: none;
  `;
  container.style.position = 'relative';
  container.appendChild(tooltip);
  return tooltip;
}

function renderTooltipContent(data) {
  const obsHtml = (data.observations || [])
    .slice(0, 4)
    .map(o => `<li style="margin: 4px 0; color: #5c5c5c;">${escapeHtml(o.slice(0, 100))}${o.length > 100 ? '…' : ''}</li>`)
    .join('');
  const moreText = data.observations.length > 4
    ? `<p style="margin-top: 6px; font-size: 11px; color: #8b8b8b;">还有 ${data.observations.length - 4} 条 observation · 点节点查看全部</p>`
    : '';
  return `
    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; color: ${data.color}; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
      ${ENTITY_LABEL_ZH[data.entityType] || data.entityType}
    </div>
    <div style="font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; font-size: 15px; margin-bottom: 8px; word-break: break-all;">
      ${escapeHtml(data.fullLabel)}
    </div>
    <ul style="margin: 0; padding-left: 18px; font-size: 12px;">${obsHtml}</ul>
    ${moreText}
  `;
}

function attachInteractions(cy, container, tooltip) {
  cy.on('mouseover', 'node', (evt) => {
    const node = evt.target;
    node.addClass('cy-hovered');
    tooltip.innerHTML = renderTooltipContent(node.data());
    tooltip.style.display = 'block';
    requestAnimationFrame(() => { tooltip.style.opacity = '1'; });
  });

  cy.on('mousemove', 'node', (evt) => {
    const ev = evt.originalEvent;
    const rect = container.getBoundingClientRect();
    let x = ev.clientX - rect.left + 16;
    let y = ev.clientY - rect.top + 16;
    if (x + 380 > container.clientWidth) x = ev.clientX - rect.left - 380;
    if (y + 200 > container.clientHeight) y = ev.clientY - rect.top - 200;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  });

  cy.on('mouseout', 'node', (evt) => {
    evt.target.removeClass('cy-hovered');
    tooltip.style.opacity = '0';
    setTimeout(() => { tooltip.style.display = 'none'; }, 150);
  });

  cy.on('tap', 'node', (evt) => {
    const node = evt.target;
    cy.elements().removeClass('focused highlighted dimmed');
    node.addClass('focused');
    const neighborhood = node.neighborhood();
    cy.elements().not(neighborhood).not(node).addClass('dimmed');
    neighborhood.connectedEdges().addClass('highlighted');
  });

  cy.on('tap', (evt) => {
    if (evt.target === cy) cy.elements().removeClass('focused highlighted dimmed');
  });
}

function renderLegend(container) {
  const legend = document.createElement('div');
  legend.style.cssText = `
    position: absolute; bottom: 12px; left: 12px; z-index: 50;
    background: rgba(255,255,255,0.92); border: 1px solid #e8e3dc;
    border-radius: 8px; padding: 10px 12px; font-family: 'Inter', sans-serif;
    font-size: 11px; line-height: 1.5; color: #1a1a1a;
    backdrop-filter: blur(8px);
  `;
  legend.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #8b8b8b;">
      entity types
    </div>
    ${Object.entries(ENTITY_COLORS).map(([type, color]) => `
      <div style="display: flex; align-items: center; gap: 6px; margin: 2px 0;">
        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${color}; border: 1px solid rgba(0,0,0,0.15);"></span>
        <span>${ENTITY_LABEL_ZH[type] || type}</span>
      </div>
    `).join('')}
  `;
  container.appendChild(legend);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function loadMemoryGraph(containerId, dataPath = '../data/memory.json') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`[memory-graph] container #${containerId} not found`);
    return;
  }

  let memData;
  try {
    memData = await fetchMemoryData(dataPath);
  } catch (e) {
    container.innerHTML = `<p style="padding: 2rem; color: #d0021b;">memory.json 加载失败: ${e.message}</p>`;
    return;
  }

  const { entities, relations } = memData;
  console.log(`[memory-graph] loaded ${entities.length} entities + ${relations.length} relations`);

  const cy = cytoscape({
    container,
    elements: {
      nodes: entities.map(entityToNode),
      edges: relations.map(relationToEdge),
    },
    style: buildCytoscapeStyle(),
    layout: buildLayout(),
    minZoom: 0.4,
    maxZoom: 2.5,
    wheelSensitivity: 0.2,
  });

  const tooltip = createTooltip(container);
  attachInteractions(cy, container, tooltip);
  renderLegend(container);

  if (typeof window !== 'undefined') window.__memoryCy = cy;

  return cy;
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('memory-graph')) loadMemoryGraph('memory-graph');
  });
}

export { loadMemoryGraph, ENTITY_COLORS, RELATION_STYLES };
