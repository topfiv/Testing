const BASE_RATE_PER_SQFT = 0.015;
const MIN_CUT_PRICE = 45;
const ADD_ONS = {
  weedWhack: 18,
  edging: 12,
  treatment: 35,
};

const PAYMENT_URL = "https://buy.stripe.com/test_6oE5kCdemoReplaceMe";

const areaEl = document.getElementById("areaSqft");
const quoteEl = document.getElementById("quote");
const form = document.getElementById("bookingForm");
const addOnInputs = ["weedWhack", "edging", "treatment"].map((id) => document.getElementById(id));

let areaSqft = 0;

const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

function calculateQuote() {
  const cut = Math.max(MIN_CUT_PRICE, areaSqft * BASE_RATE_PER_SQFT);
  const addOnTotal = addOnInputs
    .filter((input) => input.checked)
    .reduce((sum, input) => sum + ADD_ONS[input.id], 0);
  return cut + addOnTotal;
}

function renderQuote() {
  const total = calculateQuote();
  quoteEl.textContent = formatMoney(total);
}

addOnInputs.forEach((i) => i.addEventListener("change", renderQuote));

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const payload = {
    address: document.getElementById("address").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    areaSqft,
    addOns: addOnInputs.filter((input) => input.checked).map((input) => input.id),
    estimate: calculateQuote(),
  };

  localStorage.setItem("pendingBooking", JSON.stringify(payload));

  if (PAYMENT_URL.includes("ReplaceMe")) {
    alert("Connect Stripe payment URL in scripts/booking.js before going live.");
    return;
  }

  window.location.href = PAYMENT_URL;
});

function initMap() {
  if (!window.L) return;

  const map = L.map("map", { scrollWheelZoom: false }).setView([41.40897, -75.66241], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  const drawn = new L.FeatureGroup();
  map.addLayer(drawn);

  const drawControl = new L.Control.Draw({
    draw: {
      polyline: false,
      rectangle: true,
      circle: false,
      marker: false,
      circlemarker: false,
      polygon: {
        allowIntersection: false,
        showArea: true,
      },
    },
    edit: {
      featureGroup: drawn,
    },
  });

  map.addControl(drawControl);

  map.on(L.Draw.Event.CREATED, (event) => {
    drawn.clearLayers();
    const layer = event.layer;
    drawn.addLayer(layer);
    updateArea(layer);
  });

  map.on(L.Draw.Event.EDITED, (event) => {
    event.layers.eachLayer((layer) => updateArea(layer));
  });

  map.on(L.Draw.Event.DELETED, () => {
    areaSqft = 0;
    areaEl.textContent = "0";
    renderQuote();
  });
}

function updateArea(layer) {
  const latLngs = layer.getLatLngs?.();
  if (!latLngs?.length) return;

  const ring = Array.isArray(latLngs[0]) ? latLngs[0] : latLngs;
  const points = ring.map((p) => [p.lat, p.lng]);

  let areaMeters = 0;
  for (let i = 0; i < points.length; i += 1) {
    const [lat1, lon1] = points[i];
    const [lat2, lon2] = points[(i + 1) % points.length];
    areaMeters += ((lon2 - lon1) * Math.PI) / 180 *
      (2 + Math.sin((lat1 * Math.PI) / 180) + Math.sin((lat2 * Math.PI) / 180));
  }
  areaMeters = Math.abs(areaMeters * 6378137 * 6378137 / 2.0);

  areaSqft = Math.round(areaMeters * 10.7639);
  areaEl.textContent = areaSqft.toLocaleString("en-US");
  renderQuote();
}

window.addEventListener("load", () => {
  renderQuote();
  requestIdleCallback ? requestIdleCallback(initMap) : setTimeout(initMap, 200);
});
