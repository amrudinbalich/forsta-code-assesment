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

}