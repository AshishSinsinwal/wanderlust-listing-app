document.addEventListener("DOMContentLoaded", function () {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return;

  const lat = parseFloat(mapDiv.dataset.lat);
  const lng = parseFloat(mapDiv.dataset.lng);
  const title = mapDiv.dataset.title || "Location";

  if (isNaN(lat) || isNaN(lng)) {
    console.error("❌ Invalid coordinates:", lat, lng);
    return;
  }

  // 🌍 Initialize map
  const map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: false,
  }).setView([lat, lng], 13);

  // 🗺️ Base tile layer
  const baseLayer = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
    {
      maxZoom: 19,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    }
  ).addTo(map);

  // 📌 Custom red icon
  const redIcon = L.icon({
    iconUrl: "/images/marker-icon-red.png",
    shadowUrl: "/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // 📍 Marker with popup
  const marker = L.marker([lat, lng], { icon: redIcon }).addTo(map);
  marker
    .bindPopup(`
      <div class="map-popup">
        <div class="title"><strong>${title}</strong></div>
        <div class="note">Exact location provided after booking</div>
      </div>
    `)
    .openPopup();

  // 💬 Tooltip on hover
  marker.bindTooltip("View on map", {
    permanent: false,
    direction: "top",
  });

  // 🧭 Fullscreen toggle
  if (L.Control.Fullscreen) {
    map.addControl(new L.Control.Fullscreen());
  }

  // 📡 Locate user (optional)
  map.locate({ watch: false });
  map.on("locationfound", function (e) {
    const radius = e.accuracy / 2;
    L.circle(e.latlng, {
      radius,
      color: "blue",
      fillOpacity: 0.1,
    }).addTo(map);

    L.marker(e.latlng).addTo(map).bindPopup("📍 You are here").openPopup();
  });
});
