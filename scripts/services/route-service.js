class RouteService {
    /**
     * Get routes from point A (users locaiton) to point B (truck location).
     *
     * @param {{ lat: number, lng: number }} destination - Target location coordinates.
     * @returns {Promise<void>}
     */
    static async getDirections(destination) {

        try {
            const origin = userCoords ?? await this.getUserLocation();
    
            directionsService.route(
                {
                    origin,
                    destination,
                    travelMode: google.maps.TravelMode.DRIVING
                },
                (result, status) => {
    
                    // success
                    if (status === 'OK') {
                        directionsRenderer.setDirections(result);
                        return;
                    }
    
                    // eg. usr is accross the ocean, physically really far
                    if (status === 'ZERO_RESULTS') {
                        alert('Could not find route to desination.');
                        return;
                    }
    
                    // some other error happened
                    alert('Directions service failed. Please try again later.');
    
                }
            );
    
        } catch (error) {
            console.error(error);
            alert("Could not get your location.");
        }
    
    }

    /** 
     * Get users lat & lng based on browsers location. 
     * @returns {Promise<void>}
     */
    static async getUserLocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => reject(error)
            );
        });
    }
}