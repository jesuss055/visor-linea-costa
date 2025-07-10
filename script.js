// script.js

// Configuración general
var map = L.map('map').setView([18.43, -93.3], 9);
var imageLayer, vectorLayer;
var imageBounds = [[18.20, -94.131], [18.66, -92.465]];
var vectorLayerComparar; // Para la segunda línea (después)


// Capa base (opcional)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Lista de años disponibles
var years = [1986, 1993, 1997, 2004, 2007, 2011, 2016, 2021, 2025];

// Inicializar selectores
var yearSelector = document.getElementById('yearSelector');
var yearComparar = document.getElementById('yearComparar');

years.forEach(function(year) {
  let option1 = document.createElement('option');
  option1.value = year;
  option1.text = year;
  yearSelector.appendChild(option1);

  let option2 = document.createElement('option');
  option2.value = year;
  option2.text = year;
  yearComparar.appendChild(option2.cloneNode(true));
});


// Función para cargar imagen y vector
function loadLayers(year) {
  // Eliminar capas anteriores
  if (imageLayer) map.removeLayer(imageLayer);
  if (vectorLayer) map.removeLayer(vectorLayer);

  // Cargar imagen satelital RGB
  imageLayer = L.imageOverlay('images/RGB_' + year + '.jpg', imageBounds);
  
  // Solo agregarla si el checkbox está activo
  var checkbox = document.getElementById('toggleImage');
  if (checkbox.checked) {
    imageLayer.addTo(map);
  }

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
//Logica para comparar lineas de costa
function cargarComparacion(year) {
  if (vectorLayerComparar) {
    map.removeLayer(vectorLayerComparar);
  }

  fetch('data/' + year + '.geojson')
    .then(res => res.json())
    .then(data => {
      vectorLayerComparar = L.geoJSON(data, {
        style: {
          color: 'blue',
          weight: 2,
          dashArray: '5, 5'
        }
      }).addTo(map);
    })
    .catch(err => {
      console.error('No se pudo cargar línea de costa (DESPUÉS):', year);
    });
}


// Listener para cambios de año
yearSelector.addEventListener('change', function() {
//Verificar check box para mostrar imagen
document.getElementById('toggleImage').addEventListener('change', function () {
  if (this.checked) {
    if (imageLayer) imageLayer.addTo(map);
  } else {
    if (imageLayer) map.removeLayer(imageLayer);
  }
});
  var selectedYear = this.value;
  loadLayers(selectedYear);
});
// comparacion de linea de costa check box
document.getElementById('toggleComparar').addEventListener('change', function () {
  var year = yearComparar.value;
  if (this.checked && year !== '') {
    cargarComparacion(year);
  } else {
    if (vectorLayerComparar) {
      map.removeLayer(vectorLayerComparar);
    }
  }
});

yearComparar.addEventListener('change', function () {
  var check = document.getElementById('toggleComparar');
  if (check.checked) {
    cargarComparacion(this.value);
  }
});

// Carga inicial
loadLayers(years[0]);
