const mapDiv = document.getElementById("map");

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
    const locations = await fetchLocations(); // mock locations

    const options = {
        center: { lat: 41.0938, lng: -85.0707 }, // Fort Wayne center
        zoom:12,
    };

    // init map
    const map = new google.maps.Map(mapDiv, options);

    // load
    loadMarkers(map, locations);
}

function loadMarkers(map, locations) {
    const bounds = new google.maps.LatLngBounds();
    let openInfoWindow = null;

    // set markers
    locations.forEach(location => {
        const lat = parseFloat(location.latitude);
        const lng = parseFloat(location.longitude);

        const marker = new google.maps.Marker({
            map,
            position: { lat, lng },
            title: location.name
        });

        // info window
        const infowindow = new google.maps.InfoWindow({
            content: `
                <div>
                    <strong>${location.name}</strong><br>
                    ${location.address}<br>
                    ${location.city}, ${location.state}
                </div>
            `,
            ariaLabel: location.name,
            maxWidth: 260
        });

        // open on click
        marker.addListener('click', () => {
            // hide
            if(openInfoWindow) {
                openInfoWindow.close();
            }

            // open & remember
            infowindow.open(map, marker);
            map.panTo(marker.getPosition());
            openInfoWindow = infowindow;
        });

        // extend map bounds
        bounds.extend(marker.getPosition());
    });

    // center the map around locations
    map.fitBounds(bounds);
}