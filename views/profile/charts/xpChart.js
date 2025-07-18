export class XPChart {
  constructor(containerId = 'xp-chart') {
    this.containerId = containerId;
  }

  drawBarChart(xpData) {
    const svg = document.getElementById(this.containerId);
    if (!svg) {
      console.error(`SVG container with id '${this.containerId}' not found`);
      return;
    }

    svg.innerHTML = "";

    if (!xpData || xpData.length === 0) {
      this.drawEmptyState(svg);
      return;
    }

    // === Chart configuration ===
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };
    const barWidth = 30;
    const barSpacing = 10;
    const svgHeight = 250;
    const chartHeight = svgHeight - margin.top - margin.bottom  ;

    // === Setup SVG size dynamically ===
    const totalBars = xpData.length;
    const svgWidth = margin.left + totalBars * (barWidth + barSpacing) + margin.right;
    svg.setAttribute("width", svgWidth);
    svg.setAttribute("height", svgHeight);

    // === Scale Y based on max XP ===
    const maxXP = Math.max(...xpData.map(tx => tx.amount));
    const yScale = xp => (maxXP > 0 ? (chartHeight * xp) / maxXP : 1);

    // === Y-axis with XP ticks ===
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = (maxXP * i) / yTicks;
      const y = svgHeight - margin.bottom - yScale(val);

      // Grid line
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", margin.left);
      line.setAttribute("x2", svgWidth - margin.right);
      line.setAttribute("y1", y);
      line.setAttribute("y2", y);
      line.setAttribute("stroke", "#e5e7eb");
      svg.appendChild(line);

      // Label
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", margin.left - 5);
      label.setAttribute("y", y + 4);
      label.setAttribute("text-anchor", "end");
      label.setAttribute("font-size", "10");
      label.setAttribute("fill", "#6b7280");
      label.textContent = Math.round(val / 1000) + "k";
      svg.appendChild(label);
    }

    // === Bars + X-axis labels ===
    xpData.forEach((tx, i) => {
      const amount = tx.amount;
      const date = new Date(tx.createdAt);
      const monthLabel = date.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });

      const barHeight = yScale(amount);
      const x = margin.left + i * (barWidth + barSpacing);
      const y = svgHeight - margin.bottom - barHeight;

      // Bar
      const bar = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      bar.setAttribute("x", x);
      bar.setAttribute("y", y);
      bar.setAttribute("width", barWidth);
      bar.setAttribute("height", barHeight);
      bar.setAttribute("fill", "#6366f1");
      bar.setAttribute("rx", "2");

      bar.addEventListener("mouseenter", () => bar.setAttribute("fill", "#4f46e5"));
      bar.addEventListener("mouseleave", () => bar.setAttribute("fill", "#6366f1"));

      svg.appendChild(bar);

      // Month label
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", x + barWidth / 2);
      label.setAttribute("y", svgHeight - margin.bottom + 15);
      label.setAttribute("text-anchor", "middle");
      label.setAttribute("font-size", "10");
      label.setAttribute("fill", "#6b7280");
      label.textContent = monthLabel;
      svg.appendChild(label);
    });

    // === Y-axis line ===
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "line");
    yAxis.setAttribute("x1", margin.left);
    yAxis.setAttribute("y1", margin.top);
    yAxis.setAttribute("x2", margin.left);
    yAxis.setAttribute("y2", svgHeight - margin.bottom);
    yAxis.setAttribute("stroke", "#111827");
    svg.appendChild(yAxis);
  }

  // Draw empty state when no data
  drawEmptyState(svg) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "50%");
    text.setAttribute("y", "50%");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("fill", "#9ca3af");
    text.setAttribute("font-size", "14");
    text.textContent = "No XP data available";
    svg.appendChild(text);
  }
}
