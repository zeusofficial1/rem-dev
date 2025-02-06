import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { FamilyMember } from '../types/FamilyMember';

interface FamilyTreeGraphProps {
  members: FamilyMember[];
  onSelectMember: (member: FamilyMember) => void;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string;
  target: string;
}

const FamilyTreeGraph: React.FC<FamilyTreeGraphProps> = ({ members, onSelectMember }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || members.length === 0) return;

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const nodes: Node[] = members.map(member => ({
      id: member.id,
      name: `${member.firstName} ${member.lastName}`,
      type: member.type,
    }));

    const links: Link[] = members.flatMap(member => 
      member.relationships.map(rel => ({
        source: member.id,
        target: rel.memberId,
      }))
    );

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<SVGGElement, Node>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", 20)
      .attr("fill", d => getNodeColor(d.type));

    node.append("text")
      .text(d => d.name)
      .attr("x", 25)
      .attr("y", 5);

    node.on("click", (event, d) => {
      const member = members.find(m => m.id === d.id);
      if (member) onSelectMember(member);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as Node).x!)
        .attr("y1", d => (d.source as Node).y!)
        .attr("x2", d => (d.target as Node).x!)
        .attr("y2", d => (d.target as Node).y!);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [members, onSelectMember]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'blood': return '#ff7f0e';
      case 'adopted': return '#2ca02c';
      case 'step': return '#1f77b4';
      case 'foster': return '#9467bd';
      case 'spouse': return '#e377c2';
      default: return '#7f7f7f';
    }
  };

  return (
    <svg ref={svgRef} width="100%" height="100%" />
  );
};

export default FamilyTreeGraph;