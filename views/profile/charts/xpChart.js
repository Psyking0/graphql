export class XPChart {
  constructor(containerId = 'xp-chart') {
    this.containerId = containerId;
    this.svg = document.getElementById(this.containerId);

    if (!this.svg) {
      console.error(`SVG container with id '${this.containerId}' not found`);
    }
  }

  // Helper to create SVG elements
  _createSvgElement(tag, attributes = {}) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const key in attributes) {
      element.setAttribute(key, attributes[key]);
    }
    return element;
  }

  drawBarChart(xpData) {
    if (!this.svg) return; // Exit if SVG container wasn't found in constructor

    this.svg.innerHTML = ""; // Clear previous content

    if (!xpData || xpData.length === 0) {
      this._drawEmptyState();
      return;
    }

    // === Chart configuration ===
    const margin = { top: 20, right: 20, bottom: 60, left: 40 };
    const { top, right, bottom, left } = margin; // Destructuring
    const barWidth = 30;
    const barSpacing = 10;
    const svgHeight = 250;
    const chartHeight = svgHeight - top - bottom;

    // === Setup SVG size dynamically ===
    const totalBars = xpData.length;
    const svgWidth = left + totalBars * (barWidth + barSpacing) + right;
    this.svg.setAttribute("width", svgWidth);
    this.svg.setAttribute("height", svgHeight);

    // === Scale Y based on max XP ===
    const maxXP = Math.max(...xpData.map(tx => tx.amount));
    const yScale = xp => (maxXP > 0 ? (chartHeight * xp) / maxXP : 0);

    // === Y-axis with XP ticks ===
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const val = (maxXP * i) / yTicks;
      const y = svgHeight - bottom - yScale(val);

      // Grid line
      const line = this._createSvgElement("line", {
        x1: left,
        x2: svgWidth - right,
        y1: y,
        y2: y,
        stroke: "#e5e7eb"
      });
      this.svg.appendChild(line);

      // Label
      const label = this._createSvgElement("text", {
        x: left - 5,
        y: y + 4,
        "text-anchor": "end",
        "font-size": "10",
        fill: "#6b7280"
      });
      label.textContent = `${Math.round(val / 1000)}k`;
      this.svg.appendChild(label);
    }

    // === Bars + X-axis labels ===
    xpData.forEach((tx, i) => {
      const { amount, createdAt } = tx;
      const date = new Date(createdAt);

      const dayMonthYearLabel = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' });

      const barHeight = yScale(amount);
      const x = left + i * (barWidth + barSpacing);
      const y = svgHeight - bottom - barHeight;

      // Bar
      const bar = this._createSvgElement("rect", {
        x: x,
        y: y,
        width: barWidth,
        height: barHeight,
        fill: "#6366f1",
        rx: "2"
      });

      bar.addEventListener("mouseenter", () => bar.setAttribute("fill", "#4f46e5"));
      bar.addEventListener("mouseleave", () => bar.setAttribute("fill", "#6366f1"));

      this.svg.appendChild(bar);

      // --- CHANGES FOR ROTATED X-AXIS LABELS ---
      const labelX = x + barWidth / 2;
      const labelY = svgHeight - bottom + 10; // Slightly lower than before for pivot point

      const label = this._createSvgElement("text", {
        x: labelX,
        y: labelY,
        "text-anchor": "end", // Aligns the end of the text to the pivot point
        "font-size": "10",
        fill: "#6b7280"
      });
      label.textContent = dayMonthYearLabel;

      // Add rotation transform: rotate(-angle centerX centerY)
      label.setAttribute("transform", `rotate(-45 ${labelX} ${labelY})`);
      // ---------------------------------------------

      this.svg.appendChild(label);
    });

    // === Y-axis line ===
    const yAxis = this._createSvgElement("line", {
      x1: left,
      y1: top,
      x2: left,
      y2: svgHeight - bottom, // Use adjusted margin
      stroke: "#111827"
    });
    this.svg.appendChild(yAxis);
  }

  // Draw empty state when no data
  _drawEmptyState() {
    const svgWidth = parseInt(this.svg.getAttribute("width") || "300");
    const svgHeight = parseInt(this.svg.getAttribute("height") || "250");

    const text = this._createSvgElement("text", {
      x: svgWidth / 2,
      y: svgHeight / 2,
      "text-anchor": "middle",
      "dominant-baseline": "middle",
      fill: "#9ca3af",
      "font-size": "14"
    });
    text.textContent = "No XP data available";
    this.svg.appendChild(text);
  }
}