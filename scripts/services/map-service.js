class MapService {

    /**
     * @type {HTMLDivElement}
     */
    mapDiv;

    /**
     * @type {AddressesService}
     */
    addressesService;

    /**
     * @type {RouteService}
     */
    routeService;

    /**
     * @type {Array}
     */
    locations;

    /**
     * @type {Array}
     */
    markerIds;

    /**
     * @type {google.maps.Map}
     */
    map;

    /**
     * @type {google.maps.InfoWindow}
     */
    activeInfoWindow;

    /**
     * @type {object}
     */
    nativeCoords = { lat: 41.0938, lng: -85.0707 };

    async initialize() {
        // get locations (mock)
        this.locations = await this.fetchLocations();
        this.map = this.#getMap();

        // services
        this.routeService = new RouteService(
            new google.maps.DirectionsService(),
            new google.maps.DirectionsRenderer({ map: this.map })
        );

        this.addressesService = new AddressesService(this, this.routeService);

        this.loadMarkers();
        this.addressesService.load(this.locations); // addresses

    }

    async fetchLocations() {
        try {
            const response = await fetch('mock_locations.json');
            return await response.json();
        } catch (error) {
            console.log('Could not fetch locations', error);
            return [];
        }
    }

    /**
     * Call directions service.
     * @param {lat, lng} destination 
     */
    async useDirections(destination) {
        this.activeInfoWindow.close();
        await this.routeService.getDirections(destination);
    }

    /**
     * Initialize the google map.
     * @returns {void}
     */
    #getMap() {
        const options = {
            center: this.nativeCoords,
            zoom:5,
        };

        this.mapDiv = document.getElementById("map");
    
        return new google.maps.Map(this.mapDiv, options);
    }

    /**
     * Load markers on a map.
     * @returns {void}
     */
    loadMarkers() {
        const bounds = new google.maps.LatLngBounds();
        this.markerIds = [];
    
        // set markers
        this.locations.forEach(location => {
            const lat = parseFloat(location.latitude);
            const lng = parseFloat(location.longitude);
        
            const marker = new google.maps.Marker({
                map: this.map,
                position: { lat, lng },
                title: location.name
            });
        
            // remember
            const markerId = `location_${location.id}`;
            this.markerIds[markerId] = marker;
        
            this.registerPopup(markerId);
        
            // open popup
            marker.addListener('click', () => this.openPopup(markerId));
        
            // extend map bounds
            bounds.extend(marker.getPosition());
        });
    
        // center the map around locations
        this.map.fitBounds(bounds);
    }

    openPopup(markerId) {
        // remove any active directions
        this.routeService.directionsRenderer.setDirections({ routes: [] });

        const infoWindow = this.registerPopup(markerId);
        const marker = this.markerIds[markerId] ?? null;
    
        if(!marker) {
            return;
        }
    
        this.activeInfoWindow?.close();
        
        infoWindow.open(this.map, marker);
        this.map.panTo(marker.getPosition());
    
        this.activeInfoWindow = infoWindow;
    }

    registerPopup(markerId) {
        // get active location details for popup
        const numericId = parseInt(markerId.replace('location_', ''), 10)
        const activeLocation = this.locations.find(location => location.id === numericId);

        const openDays = this.#openDays(activeLocation);

        return new google.maps.InfoWindow({
            content: `
                <div class="info-window p-3">

                    <h6 class="mb-2">${activeLocation.name}</h6>
                    <p class="mb-1">${activeLocation.address}</p>
                    <p class="mb-0 text-muted">${activeLocation.city}, ${activeLocation.state}</p>

                    <div class="mt-3">
                        <h6 class="mb-2">Opening Hours</h6>
                        ${openDays}
                    </div>

                    <div class="mt-3">
                        <p class="text-warning active-link" onclick="window.mapService.useDirections({ lat: ${activeLocation.latitude}, lng: ${activeLocation.longitude} })"><img src="assets/direction-icon.png" /> Get Directions</p>
                        <a href="tel:${activeLocation.phone}" class="text-warning d-inline-flex align-items-center active-link">
                            <img src="assets/phone-icon.png" class="me-1" /> ${activeLocation.phone}
                        </a>
                    </div>

                </div>
            `,
            ariaLabel: activeLocation.name,
            maxWidth: 600
        });
    }

    #openDays(activeLocation) {
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
        const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        const currentDayIndex = (new Date()).getDay() - 1;

        let hoursHtml = '<ul class="list-unstyled mb-0">';
        days.forEach((day, i) => {
            const open = activeLocation[`${day}_open`];
            const close = activeLocation[`${day}_close`];
            const display = (open.toLowerCase() === "closed") ? "Closed" : `${open} - ${close}`;

            let bold = '';
            if(i === currentDayIndex) {
                bold = 'fw-bold';
            }
            
            hoursHtml += `<li class="d-flex justify-content-between ${bold} gap-2">
                            <span>${dayNames[i]}</span>
                            <span>${display}</span>
                        </li>`;
        });
        hoursHtml += '</ul>';

        return hoursHtml;
    }

}