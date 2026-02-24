// register toggling & event listeners for sections/buttons

const showAddresses = document.getElementById("showAddresses");
const showMap = document.getElementById("showMap");
const addresses = document.getElementById("addresses");
const map = document.getElementById("map");

// register event listeners for page buttons & resizing
function registerPageScript() {

    showAddresses.addEventListener("click", (e) => {

        if (e.target.classList.contains('btn-dark')) {
            return;
        }

        // active
        toggleView('addresses');
    });

    showMap.addEventListener("click", (e) => {

        // active
        if (e.target.classList.contains('btn-dark')) {
            return;
        }

        toggleView('map');
    });

    listButtonListeners();
    registerWindowResizeListener();

}

function listButtonListeners() {
    // direction bttns
    document.querySelectorAll('.directions-btn').forEach(async directionBttn => {

        directionBttn.addEventListener('click', async (e) => {
            const lat = parseFloat(e.target.dataset.lat);
            const lng = parseFloat(e.target.dataset.lng);

            await window.mapService.routeService.getDirections({ lat, lng });
            
            if (window.innerWidth < 768) {
                toggleView('map');
            }
        });

    });

    // open location info bttns
    document.querySelectorAll('.open-info-btn').forEach(async openInfoBttn => {

        openInfoBttn.addEventListener('click', async (e) => {
            const locationId = e.target.dataset.id;

            window.mapService.openPopup(locationId);
            
            if (window.innerWidth < 768) {
                toggleView('map');
            }
        });

    });
}

function registerWindowResizeListener() {
    window.addEventListener('resize', () => {

        // mobile view
        if(window.innerWidth < 768) {
            addresses.classList.remove("d-none");
            map.classList.add("d-none");
            setActiveButton(showAddresses, showMap);

            return;
        }

        // desktop view
        // set 2 major sections to visible
        addresses.classList.remove("d-none");
        map.classList.remove("d-none");

        // reset button UIs
        showAddresses.classList.remove("btn-dark");
        showAddresses.classList.add("btn-outline-dark");
        showMap.classList.remove("btn-dark");
        showMap.classList.add("btn-outline-dark");

        // trigger map resize
        google.maps.event.trigger(window.mapService.map, "resize");
    });
}

function setActiveButton (activeBtn, inactiveBtn) {
    activeBtn.classList.remove("btn-outline-dark");
    activeBtn.classList.add("btn-dark");

    inactiveBtn.classList.remove("btn-dark");
    inactiveBtn.classList.add("btn-outline-dark");
};

function toggleView(view) {

    if(view === 'map') {
        map.classList.remove("d-none");
        addresses.classList.add("d-none");

        setActiveButton(showMap, showAddresses);
        return;
    }

    // Show addresses
    addresses.classList.remove("d-none");
    map.classList.add("d-none");
    setActiveButton(showAddresses, showMap);
    
};