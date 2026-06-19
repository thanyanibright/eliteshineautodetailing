/* ============================================================
   map.js
   Elite Shine Auto Detailing — Part 3
   Builds an interactive map using Leaflet.js + free OpenStreetMap
   tiles (no API key and no cost required — important, since the
   project proposal set a R0 budget).

   Two markers are shown, as required by the brief ("more than 1
   location"):
     1. Our home base in Jabulani, Soweto
     2. An example point inside our wider service area (Sandton)
        — shown because Elite Shine is a MOBILE business with one
        base, not a second branch. Feel free to swap this for a
        real second address if you open one.

   NOTE: Leaflet's CSS + JS must be loaded in the <head> of
   contact.html BEFORE this script runs (see the two <link>/<script>
   tags already added to contact.html).
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  var mapContainer = document.getElementById("map");
  if (!mapContainer || typeof L === "undefined") return; // Leaflet not loaded / no map on this page

  // Approximate coordinates — adjust these if you want a pixel-perfect pin
  var homeBase = { lat: -26.2620, lng: 27.8570, label: "Elite Shine Auto Detailing — Home Base", info: "1019 Koma Str, Jabulani, Soweto" };
  var serviceArea = { lat: -26.1070, lng: 28.0567, label: "Example Service Area — Sandton", info: "We also travel here, and to Roodepoort, Krugersdorp, Midrand and more." };

  // Centre the map roughly between the two points
  var map = L.map("map").setView([-26.18, 27.96], 10);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18
  }).addTo(map);

  L.marker([homeBase.lat, homeBase.lng]).addTo(map)
    .bindPopup("<strong>" + homeBase.label + "</strong><br>" + homeBase.info);

  L.marker([serviceArea.lat, serviceArea.lng]).addTo(map)
    .bindPopup("<strong>" + serviceArea.label + "</strong><br>" + serviceArea.info);
});