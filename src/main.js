import maplibregl from 'maplibre-gl';
import { LocationClient, CalculateRouteCommand } from '@aws-sdk/client-location';
import { AWS_CONFIG, getMapStyleUrl } from './aws-config.js';
import heatZones from './data/heat_zones.json';
import amenities from './data/amenities.json';

// Fallback style if no API key is yet configured, ensuring the demo loads instantly
const FALLBACK_STYLE = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";
const mapStyle = AWS_CONFIG.apiKey.startsWith("YOUR_") ? FALLBACK_STYLE : getMapStyleUrl();

// Initialize Map
const map = new maplibregl.Map({
  container: 'map',
  style: mapStyle,
  center: [73.9810, 15.2835], // Focused on the sample coordinates
  zoom: 14.5
});

map.addControl(new maplibregl.NavigationControl(), 'top-right');

// AWS Location Client
const locationClient = new LocationClient({
  region: AWS_CONFIG.region,
  credentials: {
    // If using Amazon Location API Key, it is handled via query param in AWS SDK or HTTP headers
    accessKeyId: "DEMO_KEY",
    secretAccessKey: "DEMO_SECRET"
  }
});

let waypoints = [];
let routeMarkers = [];

map.on('load', () => {
  // 1. Add Heat Zones Polygon Layer
  map.addSource('heat-zones', {
    type: 'geojson',
    data: heatZones
  });

  map.addLayer({
    id: 'heat-zones-fill',
    type: 'fill',
    source: 'heat-zones',
    paint: {
      'fill-color': ['get', 'fill_color'],
      'fill-opacity': 0.35
    }
  });

  map.addLayer({
    id: 'heat-zones-outline',
    type: 'line',
    source: 'heat-zones',
    paint: {
      'line-color': ['get', 'fill_color'],
      'line-width': 1.5,
      'line-dasharray': [2, 1]
    }
  });

  // 2. Add Amenities Point Layer
  map.addSource('amenities', {
    type: 'geojson',
    data: amenities
  });

  map.addLayer({
    id: 'amenities-circle',
    type: 'circle',
    source: 'amenities',
    paint: {
      'circle-radius': 7,
      'circle-color': '#38bdf8',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#0f172a'
    }
  });

  // Setup Empty Sources for Direct and Cool Routes
  map.addSource('direct-route', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] }
  });
  map.addLayer({
    id: 'direct-route-line',
    type: 'line',
    source: 'direct-route',
    paint: {
      'line-color': '#ef4444',
      'line-width': 4,
      'line-dasharray': [1, 1.5]
    }
  });

  map.addSource('cool-route', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] }
  });
  map.addLayer({
    id: 'cool-route-line',
    type: 'line',
    source: 'cool-route',
    paint: {
      'line-color': '#10b981',
      'line-width': 5
    }
  });

  // Tooltips on Click
  map.on('click', 'heat-zones-fill', (e) => {
    const props = e.features[0].properties;
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${props.zone_name}</strong><br/>Temp: ${props.temp_c}°C<br/>Risk: ${props.risk_level}`)
      .addTo(map);
  });

  map.on('click', 'amenities-circle', (e) => {
    const props = e.features[0].properties;
    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(`<strong>${props.name}</strong><br/>Type: ${props.type}<br/>Shade: ${props.shade}`)
      .addTo(map);
  });
});

// UI Toggles
document.getElementById('toggle-heat').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  map.setLayoutProperty('heat-zones-fill', 'visibility', visibility);
  map.setLayoutProperty('heat-zones-outline', 'visibility', visibility);
});

document.getElementById('toggle-amenities').addEventListener('change', (e) => {
  const visibility = e.target.checked ? 'visible' : 'none';
  map.setLayoutProperty('amenities-circle', 'visibility', visibility);
});

// Sample Route Loader (Demonstrates Amazon Location Service comparison)
document.getElementById('btn-sample-route').addEventListener('click', () => {
  loadSampleComparison();
});

document.getElementById('btn-clear-route').addEventListener('click', () => {
  clearRoutes();
});

function loadSampleComparison() {
  const start = [73.9785, 15.2790];
  const end = [73.9870, 15.2895];

  // Direct Line through high asphalt heat corridor
  const directPath = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        start,
        [73.9800, 15.2810],
        [73.9830, 15.2840],
        [73.9850, 15.2870],
        end
      ]
    }
  };

  // Cool Corridor detour traversing tree canopies and water kiosks
  const coolPath = {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        start,
        [73.9760, 15.2800],
        [73.9730, 15.2830],
        [73.9720, 15.2855], // Stops by botanical shaded area
        [73.9750, 15.2880],
        end
      ]
    }
  };

  map.getSource('direct-route').setData(directPath);
  map.getSource('cool-route').setData(coolPath);

  // Update UI Metrics
  document.getElementById('route-metrics').style.display = 'grid';
  document.getElementById('direct-dist').innerText = '1.3 km (16 min)';
  document.getElementById('cool-dist').innerText = '1.5 km (19 min)';
}

function clearRoutes() {
  map.getSource('direct-route').setData({ type: 'FeatureCollection', features: [] });
  map.getSource('cool-route').setData({ type: 'FeatureCollection', features: [] });
  document.getElementById('route-metrics').style.display = 'none';
}