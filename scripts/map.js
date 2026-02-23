const mapDiv = document.getElementById("map");
const addresses = document.getElementById('addresses');

// map states
const markerIds = {};
let globalMap = null;
let locationsList = [];
let activeInfoWindow = null;

let directionsService, directionsRenderer;
let userCoords;

const nativeCoords = { lat: 41.0938, lng: -85.0707 }; // Fort Wayne center

async function fetchLocations() {
    try {
        const response = await fetch('mock_locations.json');
        return await response.json();
    } catch (error) {
        console.log('Could not fetch locations', error);
        return [];
    }
}

// main callback
async function initMap() {
    // initialize services
    const addressesService = new AddressesService();

    const locations = await fetchLocations(); // mock locations
    locationsList = locations;

    const options = {
        center: nativeCoords,
        zoom:5,
    };

    // init map
    const map = new google.maps.Map(mapDiv, options);
    globalMap = map;

    loadMarkers(map, locations);
    addressesService.load(locations);

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ map });
}

function loadMarkers(map, locations) {
    const bounds = new google.maps.LatLngBounds();

    // set markers
    locations.forEach(location => {
        const lat = parseFloat(location.latitude);
        const lng = parseFloat(location.longitude);
    
        const marker = new google.maps.Marker({
            map,
            position: { lat, lng },
            title: location.name
        });
    
        // remember
        const markerId = `location_${location.id}`;
        markerIds[markerId] = marker;
    
        registerPopup(markerId);
    
        // open popup
        marker.addListener('click', () => openPopup(markerId));
    
        // extend map bounds
        bounds.extend(marker.getPosition());
    });

    // center the map around locations
    map.fitBounds(bounds);
}

function registerPopup(locationId) {
    // get active location details for popup
    const numericId = parseInt(locationId.replace('location_', ''), 10)
    const activeLocation = locationsList.find(location => location.id === numericId);

    return new google.maps.InfoWindow({
        content: `
            <div>
                <strong>${activeLocation.name}</strong><br>
                ${activeLocation.address}<br>
                ${activeLocation.city}, ${activeLocation.state}
            </div>
        `,
        ariaLabel: activeLocation.name,
        maxWidth: 260
    });
}

function openPopup(locationId) {
    const infoWindow = registerPopup(locationId);
    const marker = markerIds[locationId] ?? null;

    if(!marker) {
        return;
    }

    activeInfoWindow?.close();
    
    infoWindow.open(globalMap, marker);
    globalMap.panTo(marker.getPosition());

    activeInfoWindow = infoWindow;
}
