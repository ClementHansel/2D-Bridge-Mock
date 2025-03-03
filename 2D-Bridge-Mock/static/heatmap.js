// 1. Connect to the WebSocket server with auto-reconnect
const socket = io("http://localhost:5000", {
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

socket.on("connect", () => console.log("Connected to WebSocket server"));
socket.on("disconnect", () =>
  console.error("Disconnected from WebSocket server")
);
socket.on("connect_error", (err) =>
  console.error("WebSocket Connection Error:", err)
);

// 2. Get the container
const container = document.getElementById("bridge-container");
container.style.position = "relative";

// 3. Load the external SVG (stone-bridge.svg) and append it to the container
d3.xml("/static/stone-bridge.svg").then(function (xml) {
  // Append the loaded SVG to the container
  container.appendChild(xml.documentElement);

  // Ensure the loaded SVG fills the container and is positioned correctly
  const loadedSvg = container.querySelector("svg");
  if (loadedSvg) {
    loadedSvg.setAttribute("width", "100%");
    loadedSvg.setAttribute("height", "100%");
    loadedSvg.style.position = "absolute";
    loadedSvg.style.top = "0";
    loadedSvg.style.left = "0";
    loadedSvg.style.zIndex = "10"; // Place it above the heatmap canvas
  }

  // 4. Add sensor circles to the SVG
  // Define sensor positions (adjust coordinates as needed based on your SVG design)
  const sensors = [
    { id: 1, cx: 200, cy: 190 },
    { id: 2, cx: 400, cy: 190 },
    { id: 3, cx: 600, cy: 190 },
  ];

  // Append sensors to the loaded SVG using D3
  const svg = d3.select(loadedSvg);
  svg
    .selectAll(".sensor")
    .data(sensors)
    .enter()
    .append("circle")
    .attr("class", "sensor")
    .attr("id", (d) => `sensor-${d.id}`)
    .attr("cx", (d) => d.cx)
    .attr("cy", (d) => d.cy)
    .attr("r", 10)
    .attr("fill", "blue");
});

// 5. Initialize Heatmap.js
if (typeof h337 === "undefined") {
  console.error("Heatmap.js (h337) is not loaded!");
} else {
  const heatmap = h337.create({
    container: container,
    radius: 60,
    maxOpacity: 0.8,
    minOpacity: 0.2,
    blur: 0.85,
    backgroundColor: "rgba(0, 0, 0, 0)",
  });

  // Ensure the heatmap canvas is positioned correctly (behind the SVG sensors)
  const heatmapCanvas = container.querySelector("canvas");
  if (heatmapCanvas) {
    heatmapCanvas.style.position = "absolute";
    heatmapCanvas.style.top = "0";
    heatmapCanvas.style.left = "0";
    heatmapCanvas.style.zIndex = "5"; // Lower than the SVG (which is 10)
  }

  // 6. Handle WebSocket updates and update heatmap data
  socket.on("heatmap_update", (data) => {
    console.log("Received heatmap data:", data);

    heatmap.setData({
      max: 100,
      data: data.map((sensor) => ({
        x: sensor.x,
        y: sensor.y,
        value: sensor.value,
      })),
    });

    // Update sensor circle colors based on sensor value
    data.forEach((sensor) => {
      d3.select(`#sensor-${sensor.id}`)
        .transition()
        .duration(500)
        .attr("fill", `rgb(${255 - sensor.value}, ${sensor.value}, 0)`);
    });
  });
}
