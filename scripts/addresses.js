loadAddresses();

const addresses = document.getElementById('addresses');

async function loadAddresses() {
    // mock
    const locations = await fetchLocations();
    const opened = locationOpened();

    // markup
    const markup = addressMarkup(opened);
    const template = Handlebars.compile(markup);

    userCoords = { lat: 41.0938, lng: -85.0707 }; // for now
    const renderList = userCoords ? sortLocationsByDistance(locations) : locations;

    // render
    renderList.forEach(location => {
        addresses.innerHTML += template(location);
    });
}

function sortLocationsByDistance(locations) {

    return locations
        .map(location => {
            
            const meters = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(userCoords.lat, userCoords.lng),
                new google.maps.LatLng(
                    parseFloat(location.latitude),
                    parseFloat(location.longitude)
                )
            );

            const miles = meters / 1609.344;

            return { ...location, distanceMiles: miles.toFixed(1) };
        })
        .sort((a, b) => a.distanceMiles - b.distanceMiles);
}


// helpers
function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // 0 => 12

    return `${hours}:${minutes} ${ampm}`;
}

function addressMarkup(locationOpened) {
    return `<div class="location-item p-2 my-3 border border-secondary" data-lat="{{latitude}}" data-lng="{{longitude}}">
                <!-- Name -->
                {{#if distanceMiles}} 
                    <h6 class="d-flex justify-content-between">{{name}} <p class="text-secondary">{{distanceMiles}} mi away</p> </h6>
                {{else}}
                    <h6>{{name}}</h6>
                {{/if}}
        
                <!-- Address -->
                <p>
                    {{address}}<br>
                    {{city}}, {{state}}<br>
                </p>
        
                <!-- Open until -->
                {{#if ${locationOpened} }}
                    <p class="text-success">Open today until {{ ${locationOpened} }}</p>
                {{else}}
                    <p class="text-secondary">CLOSED</p>
                {{/if}}

                <!-- Phone -->
                {{#if phone}}
                    <p class="text-warning">
                        <img src="assets/phone-icon.png" />
                        {{ phone }}
                    </p>
                {{/if}}
        
                <!-- Action buttons -->
                <div class="d-flex justify-content-start gap-4 mt-2">
                    <button class="btn btn-sm btn-dark px-4" onclick="getDirections({lat: parseFloat('{{latitude}}'), lng: parseFloat('{{longitude}}') })">
                        DIRECTIONS
                    </button>
        
                    <button class="btn btn-sm btn-outline-dark px-4" onclick="openPopup('location_{{id}}')">
                        MORE INFO
                    </button>
                </div>
            </div>`;
}

// is location opened today?
function locationOpened() {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDay = (new Date()).getDay();

    return `${days[currentDay]}_open`;
}