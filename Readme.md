# 🌡️ HeatPulse: Hyperlocal Urban Heat & Cool-Corridor Navigator

> Built for the **AWS Builder Center — Weekend Challenge: Map it**.

HeatPulse is a spatial web application designed to counter the Urban Heat Island (UHI) effect. By overlaying localized thermal exposure polygons with public civic infrastructure (drinking water fountains, shaded stops, and natural tree canopies), HeatPulse calculates climate-resilient pedestrian paths, comparing direct routes against shade-optimized **"Cool Corridors"**.

---

## 🚀 Key Features

- **Thermal Vulnerability Layers:** Real-time GeoJSON choropleth layers depicting high-heat asphalt corridors versus green cooling oases.
- **Civic Infrastructure Pins:** Interactive points of interest highlighting public hydration stations, transit shelters, and shaded rest kiosks.
- **Cool-Corridor Routing:** Dynamic path evaluation contrasting standard pedestrian paths against shade-optimized detours with an estimated **~35% reduction in thermal stress**.
- **Dark Glassmorphic UI:** Responsive HUD designed with vanilla CSS, MapLibre GL JS, and dark-mode glassmorphic styling.

---

## 🛠️ Architecture & AWS Services

HeatPulse is built on a serverless spatial stack utilizing **Amazon Location Service**: