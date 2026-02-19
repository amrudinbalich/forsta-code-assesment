loadAddresses();

const addresses = document.getElementById('addresses');

async function loadAddresses() {
    // mock
    const locations = await fetchLocations();
    const opened = locationOpened();

    // markup
    const markup = addressMarkup(opened);
    const template = Handlebars.compile(markup);

    // render
    locations.forEach(location => {
        addresses.innerHTML += template(location);
    });
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
                <h6>{{name}}</h6>
        
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
                    <button class="btn btn-sm btn-dark px-4">
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