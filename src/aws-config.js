export const AWS_CONFIG = {
  region: "us-east-1", // e.g., us-east-1, eu-west-1, ap-south-1
  apiKey: "YOUR_AMAZON_LOCATION_API_KEY", // Create in AWS Console > Amazon Location Service > API keys
  mapName: "HeatPulseBaseMap", // Name of your Amazon Location Map resource
  routeCalculatorName: "HeatPulseRouteCalculator" // Name of your Route Calculator
};

// Generates the standard Amazon Location Service vector tile style URL
export const getMapStyleUrl = () => {
  return `https://maps.geo.${AWS_CONFIG.region}.amazonaws.com/maps/v0/maps/${AWS_CONFIG.mapName}/style-descriptor?key=${AWS_CONFIG.apiKey}`;
};