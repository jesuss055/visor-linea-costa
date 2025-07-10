// script.js

// Configuración general
var map = L.map('map').setView([18.43, -93.3], 9);
var imageLayer, vectorLayer;
var imageBounds = [[18.20, -94.131], [18.66, -92.465]];

// Capa base (opcional)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Lista de años disponibles
var years = [1986, 1993, 1997, 2004, 2007, 2011, 2016, 2021, 2025];

// Inicializar selectores
var yearSelector = document.getElementById('yearSelector');
years.forEach(function(year) {
  var option = document.createElement('option');
  option.value = year;
  option.text = year;
  yearSelector.appendChild(option);
});

// Función para cargar imagen y vector
function loadLayers(year) {
  // Eliminar capas anteriores
  if (imageLayer) map.removeLayer(imageLayer);
  if (vectorLayer) map.removeLayer(vectorLayer);

  // Cargar imagen satelital RGB
  imageLayer = L.imageOverlay('images/RGB_' + year + '.jpg', imageBounds);
  imageLayer.addTo(map);

  // Cargar línea de costa
  fetch('data/' + year + '.geojson')
    .then(res => res.json())
    .then(data => {
      vectorLayer = L.geoJSON(data, {
        style: {
          color: 'red',
          weight: 2
        }
      }).addTo(map);
    })
    .catch(err => {
      console.error('No se pudo cargar línea de costa para el año:', year);
    });
}

// Listener para cambios de año
yearSelector.addEventListener('change', function() {
  var selectedYear = this.value;
  loadLayers(selectedYear);
});

// Carga inicial
loadLayers(years[0]);
