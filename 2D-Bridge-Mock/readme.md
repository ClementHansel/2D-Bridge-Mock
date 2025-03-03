**Real-Time Heatmap Visualization**

This document describes the Real-Time Heatmap Visualization project. The project demonstrates a real-time heatmap visualization of sensor data over a 2D bridge structure using a Flask backend with Flask-SocketIO and Eventlet, and a frontend that uses D3.js and Heatmap.js.

**Features**

- **Real-Time Sensor Data:**  
   Simulated sensor data is emitted every 3 seconds.
- **Dynamic Visualization:**  
   A 2D bridge with sensor points and a heatmap overlay is rendered using D3.js and Heatmap.js.
- **WebSocket Updates:**  
   Real-time data updates are delivered to the client using Flask-SocketIO.
- **Responsive Design:**  
   The visualization scales responsively based on the container size.

**Project Structure**

/your-project-folder

├── server.py (Flask server and WebSocket implementation)

├── .gitignore (Files and directories to ignore in Git)

├── requirements.txt (Python project dependencies)

├── README.md (Project documentation)

├── templates/

│ └── index.html (HTML file that renders the visualization)

└── static/

└── heatmap.js (Custom JavaScript for D3.js and Heatmap.js visualization)

**Prerequisites**

- Python 3.x
- pip

**Installation**

1. **Clone the repository:**  
   Open a terminal or command prompt and run:

git clone &lt;repository-url&gt;

cd &lt;repository-folder&gt;

1. **Create and activate a virtual environment (recommended):**

**On Windows:**

python -m venv venv

venv\\Scripts\\activate

**On macOS/Linux:**

python3 -m venv venv

source venv/bin/activate

1. **Install the required dependencies:**

pip install -r requirements.txt

**Running the Project**

1. **Start the Flask server:**  
   Run the following command in your project folder:

python server.py

1. **View the visualization:**  
   Open your web browser and visit <http://localhost:5000>.  
   You should see a 2D bridge with sensor circles, and a heatmap overlay that updates in real time based on simulated sensor data.

**Customization**

- **Sensor Data Simulation:**  
   You can adjust the sensor value range and update interval in server.py within the generate_mock_data() function.
- **Visualization Appearance:**  
   Tweak settings like the heatmap radius, opacity, and blur in static/heatmap.js to change the look and feel of the visualization.

**License**

This project is open source and available under the MIT License.

**Acknowledgements**

- Flask – <https://flask.palletsprojects.com/>
- Flask-SocketIO – <https://flask-socketio.readthedocs.io/>
- Eventlet – <http://eventlet.net/>
- D3.js – <https://d3js.org/>
- Heatmap.js – <https://www.patrick-wied.at/static/heatmapjs/>
