loadAddresses();

const addresses = document.getElementById('addresses');

async function loadAddresses() {
    // mock
    const locations = await fetchLocations();

    // markup
    const markup = addressMarkup();
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

function addressMarkup() {
    return `<div class="location-item p-2 my-3 border border-secondary" data-lat="{{latitude}}" data-lng="{{longitude}}">
                <!-- Name -->
                <h6>{{name}}</h6>
        
                <!-- Address -->
                <p>
                    {{address}}<br>
                    {{city}}, {{state}}<br>
                </p>
        
                <!-- Open until -->
                {{#if monday_open}}
                    <p class="text-success">Open today until {{ monday_open }}</p>
                {{else}}
                    <p class="text-secondary">CLOSED - opens at {{ monday_open }}</p>
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
        
                    <button class="btn btn-sm btn-outline-dark px-4">
                        MORE INFO
                    </button>
                </div>
            </div>`;
}