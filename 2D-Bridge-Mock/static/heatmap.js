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

// 2. Setup D3.js for the bridge structure
const container = document.getElementById("bridge-container");
container.style.position = "relative";

const svg = d3
  .select("#bridge-container")
  .append("svg")
  .attr("width", "100%")
  .attr("height", 400)
  .attr("viewBox", "0 0 800 400")
  .style("position", "absolute")
  .style("z-index", "10");

// Draw Bridge Base
svg
  .append("rect")
  .attr("x", 100)
  .attr("y", 180)
  .attr("width", 600)
  .attr("height", 40)
  .attr("fill", "gray");

// Draw Bridge Pillars
const pillars = [
  { x: 150, y: 220 },
  { x: 630, y: 220 },
];

svg
  .selectAll(".pillar")
  .data(pillars)
  .enter()
  .append("rect")
  .attr("class", "pillar")
  .attr("x", (d) => d.x)
  .attr("y", (d) => d.y)
  .attr("width", 20)
  .attr("height", 80)
  .attr("fill", "black");

// 3. Define Sensor Positions and Render as Circles
const sensors = [
  { id: 1, x: 200, y: 190 },
  { id: 2, x: 400, y: 190 },
  { id: 3, x: 600, y: 190 },
];

svg
  .selectAll(".sensor")
  .data(sensors)
  .enter()
  .append("circle")
  .attr("class", "sensor")
  .attr("cx", (d) => d.x)
  .attr("cy", (d) => d.y)
  .attr("r", 10)
  .attr("fill", "blue")
  .attr("id", (d) => `sensor-${d.id}`);

// 4. Initialize Heatmap.js
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

  // Place the heatmap canvas behind the SVG
  const heatmapCanvas = container.querySelector("canvas");
  if (heatmapCanvas) {
    heatmapCanvas.style.position = "absolute";
    heatmapCanvas.style.top = "0";
    heatmapCanvas.style.left = "0";
    heatmapCanvas.style.zIndex = "5";
  }

  // 5. Handle WebSocket Updates & Update Heatmap Data
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
