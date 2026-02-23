class RouteService {
    /**
     * Get routes from point A (users locaiton) to point B (truck location).
     *
     * @param {{ lat: number, lng: number }} destination - Target location coordinates.
     * @returns {Promise<void>}
     */
    static async getDirections(destination) {

        try {
            const origin = userCoords ?? await UserLocation.getUserLocation();
    
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

}

class UserLocation {

    /**
     * Check if geolocation permission is already granted.
     * @returns {Promise<boolean>}
     */
    static async enabled() {
        try {
            const res = await navigator.permissions.query({ name: 'geolocation' });
            return res.state === 'granted'; // enabled?
        } catch (err) {
            console.error("Error checking geolocation permission:", err);
            return false;
        }
    }

    /**
     * Ask user for geolocation permission.
     * Resolves true if allowed, false otherwise.
     * @returns {Promise<boolean>}
     */
    static async askForPermissions() {
        try {
            return new Promise(resolve => {
                navigator.geolocation.getCurrentPosition(
                    () => resolve(true),
                    () => resolve(false)
                );
            });
        } catch (err) {
            console.error("Error asking for geolocation:", err);
            return false;
        }
    }

    /**
     * Get the user's current coordinates if permission is granted.
     * @returns {Promise<{lat: number, lng: number} | null>}
     */
    static async getUserLocation() {
        try {

            // is enabled?
            if(!await this.enabled()) {

                // if not, ask for permissions
                if(!await this.askForPermissions()) {
                    const msg = 'Please enable location permissions to proceed.';

                    // thow err, no permissions
                    alert(msg);
                    throw new Error(msg);
                }

            }

            // locate
            return new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    () => resolve(null)
                );
            });
        } catch (err) {
            console.error("Error getting user location:", err);
            return null;
        }
    }

}