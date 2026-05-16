async function fetchData(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} loading ${url}`);
  return resp.json();
}

function buildSankeyData(agents, flow) {
  const departments = flow.departments;
  const sopSteps = flow.sop_b_steps;

  const nodes = [];
  const links = [];
  const nodeIndex = {};

  departments.forEach(d => {
    const id = `dept:${d.id}`;
    nodeIndex[id] = nodes.length;
    nodes.push({
      id,
      name: `${d.label} (${d.count})`,
      type: 'department',
      color: d.color,
      demoUsed: d.demo_count > 0,
    });
  });

  sopSteps.forEach(s => {
    const id = `step:${s.id}`;
    nodeIndex[id] = nodes.length;
    nodes.push({
      id,
      name: s.label,
      type: 'step',
      color: '#1a1a1a',
      demoUsed: true,
    });
  });

  const deliverNode = (label, demo = true) => {
    const id = `deliver:${label}`;
    if (nodeIndex[id] === undefined) {
      nodeIndex[id] = nodes.length;
      nodes.push({
        id,
        name: label,
        type: 'deliver',
        color: '#d49a6a',
        demoUsed: demo,
      });
    }
    return nodeIndex[id];
  };

  sopSteps.forEach(s => {
    const dept = departments.find(d => d.id === s.agent_dept);
    if (dept) {
      links.push({
        source: nodeIndex[`dept:${dept.id}`],
        target: nodeIndex[`step:${s.id}`],
        value: 1,
        demoUsed: true,
        sourceColor: dept.color,
      });
    }
    s.deliverables.forEach(d => {
      links.push({
        source: nodeIndex[`step:${s.id}`],
        target: deliverNode(d, true),
        value: 1,
        demoUsed: true,
        sourceColor: '#1a1a1a',
      });
    });
  });

  return { nodes, links };
}

function renderSankey(containerId, dataMemoryPath = '../data/agents.json', dataFlowPath = '../data/sop-b-flow.json') {
  const container = document.getElementById(containerId);
  if (!container) return;

  Promise.all([fetchData(dataMemoryPath), fetchData(dataFlowPath)])
    .then(([agentsData, flowData]) => {
      const { nodes, links } = buildSankeyData(agentsData.agents, flowData);

      const width = container.clientWidth;
      const height = 700;

      const svg = d3.select(`#${containerId}`)
        .html('')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('width', '100%')
        .attr('height', height)
        .attr('preserveAspectRatio', 'xMidYMid meet');

      const sankey = d3.sankey()
        .nodeWidth(14)
        .nodePadding(12)
        .extent([[20, 20], [width - 20, height - 20]])
        .nodeSort(null);

      const graph = sankey({
        nodes: nodes.map(n => Object.assign({}, n)),
        links: links.map(l => Object.assign({}, l)),
      });

      svg.append('g')
        .attr('fill', 'none')
        .attr('stroke-opacity', 0.4)
        .selectAll('path')
        .data(graph.links)
        .join('path')
        .attr('d', d3.sankeyLinkHorizontal())
        .attr('stroke', d => d.sourceColor || '#cccccc')
        .attr('stroke-width', d => Math.max(1.5, d.width))
        .attr('opacity', d => d.demoUsed ? 0.55 : 0.12);

      const nodeGroup = svg.append('g')
        .selectAll('g')
        .data(graph.nodes)
        .join('g');

      nodeGroup.append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('height', d => Math.max(2, d.y1 - d.y0))
        .attr('width', d => d.x1 - d.x0)
        .attr('fill', d => d.color)
        .attr('opacity', d => d.demoUsed ? 1 : 0.3)
        .append('title')
        .text(d => d.name);

      nodeGroup.append('text')
        .attr('x', d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
        .attr('y', d => (d.y1 + d.y0) / 2)
        .attr('dy', '0.35em')
        .attr('text-anchor', d => d.x0 < width / 2 ? 'start' : 'end')
        .attr('font-family', 'JetBrains Mono, Menlo, monospace')
        .attr('font-size', '11px')
        .attr('fill', d => d.demoUsed ? '#1a1a1a' : '#8b8b8b')
        .text(d => d.name);
    })
    .catch(err => {
      container.innerHTML = `<p style="padding: 2rem; color: #d0021b;">Sankey 加载失败: ${err.message}</p>`;
      console.error('[sankey]', err);
    });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const el = document.getElementById('agents-sankey');
    if (!el) return;
    const agentsSrc = el.dataset.agentsSrc || '../data/agents.json';
    const flowSrc = el.dataset.flowSrc || '../data/sop-b-flow.json';
    renderSankey('agents-sankey', agentsSrc, flowSrc);
  });
}

export { renderSankey };
