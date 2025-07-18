export class PieChart {
  constructor(containerId = 'pie-chart') {
    this.containerId = containerId;
  }

  // Draw pie chart for audit ratio
  drawAuditPieChart(succeeded, failed) {
    const svg = document.getElementById(this.containerId);
    if (!svg) {
      console.error(`SVG container with id '${this.containerId}' not found`);
      return;
    }

    svg.innerHTML = "";

    const total = succeeded + failed;
    if (total === 0) {
      this.drawEmptyState(svg);
      return;
    }

    const width = 200;
    const height = 250;
    const radius = Math.min(width, height) / 2 - 20;
    const centerX = width / 2;
    const centerY = height / 2;

    // Calculate angles
    const succeededAngle = (succeeded / total) * 2 * Math.PI;
    const failedAngle = (failed / total) * 2 * Math.PI;

    // Draw succeeded slice
    if (succeeded > 0) {
      const succeededSlice = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const startAngle = 0;
      const endAngle = succeededAngle;
      
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = succeededAngle > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      succeededSlice.setAttribute("d", pathData);
      succeededSlice.setAttribute("fill", "#10b981");
      succeededSlice.setAttribute("stroke", "#ffffff");
      succeededSlice.setAttribute("stroke-width", "2");
      svg.appendChild(succeededSlice);
    }

    // Draw failed slice
    if (failed > 0) {
      const failedSlice = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const startAngle = succeededAngle;
      const endAngle = 2 * Math.PI;
      
      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);
      
      const largeArcFlag = failedAngle > Math.PI ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      failedSlice.setAttribute("d", pathData);
      failedSlice.setAttribute("fill", "#ef4444");
      failedSlice.setAttribute("stroke", "#ffffff");
      failedSlice.setAttribute("stroke-width", "2");
      svg.appendChild(failedSlice);
    }

    // Add center text
    const centerText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    centerText.setAttribute("x", centerX);
    centerText.setAttribute("y", centerY);
    centerText.setAttribute("text-anchor", "middle");
    centerText.setAttribute("dominant-baseline", "middle");
    centerText.setAttribute("font-size", "12");
    centerText.setAttribute("font-weight", "bold");
    centerText.setAttribute("fill", "#374151");
    centerText.textContent = `${(total/1000).toFixed(2)} MB`;
    svg.appendChild(centerText);

    // Add legend
    this.addLegend(svg, succeeded, failed);
  }

  // Add legend for audit pie chart
  addLegend(svg, succeeded, failed) {
    const legendY = 220;
    const legendX = 20;

    // Succeeded legend
    const succeededRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    succeededRect.setAttribute("x", legendX);
    succeededRect.setAttribute("y", legendY);
    succeededRect.setAttribute("width", 12);
    succeededRect.setAttribute("height", 12);
    succeededRect.setAttribute("fill", "#10b981");
    svg.appendChild(succeededRect);

    const succeededText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    succeededText.setAttribute("x", legendX + 20);
    succeededText.setAttribute("y", legendY + 9);
    succeededText.setAttribute("font-size", "12");
    succeededText.setAttribute("fill", "#374151");
    succeededText.textContent = `Done: ${succeeded} KB`;
    svg.appendChild(succeededText);

    // Received legend
    const failedRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    failedRect.setAttribute("x", legendX);
    failedRect.setAttribute("y", legendY + 20);
    failedRect.setAttribute("width", 12);
    failedRect.setAttribute("height", 12);
    failedRect.setAttribute("fill", "#ef4444");
    svg.appendChild(failedRect);

    const failedText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    failedText.setAttribute("x", legendX + 20);
    failedText.setAttribute("y", legendY + 29);
    failedText.setAttribute("font-size", "12");
    failedText.setAttribute("fill", "#374151");
    failedText.textContent = `Received: ${failed} KB`;
    svg.appendChild(failedText);
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
    text.textContent = "No data available";
    svg.appendChild(text);
  }
} 