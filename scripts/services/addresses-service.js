class AddressesService {

    userCoords = { lat: 41.0938, lng: -85.0707 }; // DEV test

    /**
     * Load Addresses on a page.
     * @returns {void}
     */
    async load(locations) {
        // prepare address markup
        const markup = this.addressMarkup(this.locationOpened());
        const template = Handlebars.compile(markup);

        const renderList = this.userCoords ? this.sortLocationsByDistance(locations) : locations;

        // render
        renderList.forEach(location => addresses.innerHTML += template(location));
    }

    /**
     * Get address markup.
     * 
     * @param {bool} locationOpened 
     * @returns 
     */
    addressMarkup(locationOpened) {

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
                        <button 
                            id="direction-btn-{{id}}" 
                            class="btn btn-sm btn-dark px-4 directions-btn" 
                            data-lat="{{latitude}}" 
                            data-lng="{{longitude}}"
                        >
                            DIRECTIONS
                        </button>
            
                        <button 
                            id="info-btn-{{id}}" 
                            class="btn btn-sm btn-outline-dark px-4 open-info-btn" 
                            data-id="location_{{id}}"
                        >
                            MORE INFO
                        </button>
                    </div>
                </div>`;
    }

    /**
     * Check is location opened today.
     * 
     * @returns {string}
     */
    locationOpened() {
        const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const currentDay = (new Date()).getDay() - 1;
    
        return `${days[currentDay]}_open`;
    }
    
    /**
     * Based on user location coords, calculate distance to each location and
     * sort array in ASC mode (from nearest location).
     * 
     * Returns sorted array.
     * 
     * @param {Array} locations 
     * @returns {Array}
     */
    sortLocationsByDistance(locations) {

        if(!google && !google.maps.geometry.spherical) {
            console.warn('There was a problem loading the library. Please try again later.');
            return locations;
        }
    
        return locations
            .map(location => {
                
                const meters = google.maps.geometry.spherical.computeDistanceBetween(
                    new google.maps.LatLng(this.userCoords.lat, this.userCoords.lng),
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
}