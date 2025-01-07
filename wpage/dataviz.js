const map = L.map('map', {
  maxBounds: [
    [-23.0, -55.0],
    [-14.0, -39.0]
  ],
  maxBoundsViscosity: 1.0,
}).setView([ -18.5122, -44.555], 5);

// 2. Füge eine Tile-Layer hinzu (OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 3. JSON-Daten laden
const data = [
  { lat: -20.14, lng: -44.88, intensity: 5.0 },
  { lat: -19.91, lng: -43.93, intensity: 10.0}
];

// 4. Heatmap-Daten vorbereiten
const heatData = data.map(item => [item.lat, item.lng, item.intensity]);

// 5. Heatmap hinzufügen
L.heatLayer(heatData, {
  radius: 25,  // Radius der Punkte
  blur: 15,    // Unschärfe der Punkte
  maxZoom: 10  // Maximale Zoomstufe
}).addTo(map);

map.setMaxBounds(map.getBounds());
