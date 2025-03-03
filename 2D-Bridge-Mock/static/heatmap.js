// 1. Connect to WebSocket server with auto-reconnect
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

// 3. Load the external SVG (your colored bridge design)
d3.xml("/static/stone-bridge.svg")
  .then(function (xml) {
    const importedSVG = xml.documentElement;
    // Force the SVG to fit the container
    importedSVG.setAttribute("width", "100%");
    importedSVG.setAttribute("height", "100%");
    importedSVG.setAttribute("preserveAspectRatio", "xMidYMid meet");
    importedSVG.style.position = "absolute";
    importedSVG.style.top = "0";
    importedSVG.style.left = "0";
    // Set a lower z-index so that heatmap and sensors can layer on top
    importedSVG.style.zIndex = "5";
    container.appendChild(importedSVG);
  })
  .catch((err) => console.error("Error loading SVG:", err));

// 4. Create a separate overlay SVG for sensor markers
const sensorOverlay = d3
  .select(container)
  .append("svg")
  .attr("width", "100%")
  .attr("height", "100%")
  .attr("viewBox", "0 0 800 400")
  .style("position", "absolute")
  .style("top", "0")
  .style("left", "0")
  // Set sensor overlay z-index above heatmap canvas but above bridge background if desired.
  .style("z-index", "15");

// Define sensor positions (adjust these coordinates as needed)
const sensors = [
  { id: 1, cx: 200, cy: 190 },
  { id: 2, cx: 400, cy: 190 },
  { id: 3, cx: 600, cy: 190 },
];

// Draw sensor circles on the overlay SVG
sensorOverlay
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

// 5. Initialize Heatmap.js
if (typeof h337 === "undefined") {
  console.error("Heatmap.js (h337) is not loaded!");
} else {
  // Create the heatmap in the container.
  const heatmap = h337.create({
    container: container,
    radius: 60,
    maxOpacity: 0.8,
    minOpacity: 0.2,
    blur: 0.85,
    backgroundColor: "rgba(0, 0, 0, 0)",
  });

  // Adjust the heatmap canvas to be layered between the SVG bridge (z-index 5) and sensor overlay (z-index 15)
  const heatmapCanvas = container.querySelector("canvas");
  if (heatmapCanvas) {
    heatmapCanvas.style.position = "absolute";
    heatmapCanvas.style.top = "0";
    heatmapCanvas.style.left = "0";
    heatmapCanvas.style.zIndex = "10"; // Between bridge (5) and sensors (15)
  }

  // 6. Handle WebSocket Updates & Update Heatmap Data
  socket.on("heatmap_update", (data) => {
    console.log("Received heatmap data:", data);

    // Update the heatmap data.
    heatmap.setData({
      max: 100,
      data: data.map((sensor) => ({
        x: sensor.x,
        y: sensor.y,
        value: sensor.value,
      })),
    });

    // Update sensor circle colors on the overlay based on sensor value
    data.forEach((sensor) => {
      d3.select(`#sensor-${sensor.id}`)
        .transition()
        .duration(500)
        .attr("fill", `rgb(${255 - sensor.value}, ${sensor.value}, 0)`);
    });
  });
}
