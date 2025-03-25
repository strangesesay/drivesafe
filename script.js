function initMap() {
    const mapElement = document.getElementById('map');
    mapElement.style.height = "400px"; // Ensure the map container has a visible height
    const locationStatus = document.getElementById('locationStatus');
    const locationPermissionStatus = document.getElementById('locationPermissionStatus');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                const map = new google.maps.Map(mapElement, {
                    center: userLocation,
                    zoom: 15,
                });

                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "You are here",
                });

                locationStatus.textContent = `Location: Latitude ${userLocation.lat}, Longitude ${userLocation.lng}`;
                locationPermissionStatus.textContent = "Location Services: Enabled";
            },
            () => {
                locationPermissionStatus.textContent = "Location Services: Disabled or Permission Denied";
            }
        );
    } else {
        locationPermissionStatus.textContent = "Location Services: Not Supported by Browser";
    }
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            document.getElementById("locationStatus").textContent = `Location: ${latitude}, ${longitude}`;
            const map = new google.maps.Map(document.getElementById("map"), {
                center: { lat: latitude, lng: longitude },
                zoom: 15,
            });
            new google.maps.Marker({
                position: { lat: latitude, lng: longitude },
                map,
                title: "Your Location"
            });
        }, () => {
            document.getElementById("locationStatus").textContent = "Location access denied.";
        });
    } else {
        document.getElementById("locationStatus").textContent = "Geolocation is not supported by this browser.";
    }
}

document.getElementById("sosButton").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const userLocation = { lat: latitude, lng: longitude };

                // Update location status
                document.getElementById("locationStatus").textContent = `Location: Latitude ${latitude}, Longitude ${longitude}`;

                // Update map in the main emergency card
                const map = new google.maps.Map(document.getElementById("map"), {
                    center: userLocation,
                    zoom: 15,
                });

                // Place marker
                new google.maps.Marker({
                    position: userLocation,
                    map,
                    title: "Your Location",
                });

                alert("SOS Alert Sent! Location shared with emergency contacts.");
            },
            () => {
                // Handle location access denied
                document.getElementById("locationStatus").textContent = "❌ Location access denied.";
            }
        );
    } else {
        // Handle geolocation not supported
        document.getElementById("locationStatus").textContent = "❌ Geolocation not supported by this browser.";
    }
});

document.querySelector(".bg-red-500").addEventListener("click", () => {
    const additionalDetails = document.querySelector("textarea").value.trim();
    const photoInput = document.getElementById("photoInput");
    const file = photoInput.files[0];

    if (!additionalDetails && !file) {
        alert("Please provide additional details or upload a photo before sending.");
        return;
    }

    const whatsappNumber = "+23279525354"; // Replace with the desired WhatsApp number
    let message = `Emergency Details: ${additionalDetails || "No additional details provided."}`;

    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const base64Image = reader.result.split(",")[1]; // Extract base64 data
            const encodedMessage = encodeURIComponent(message);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            alert("Note: WhatsApp does not support direct image uploads via links. Please manually attach the image.");
            window.open(whatsappUrl, "_blank");
        };
        reader.readAsDataURL(file);
    } else {
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
    }
});

document.getElementById("photoInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            const imagePreview = document.createElement("img");
            imagePreview.src = reader.result;
            imagePreview.alt = "Uploaded Photo";
            imagePreview.className = "max-w-full h-auto rounded-lg shadow-md mt-4";
            const additionalDetailsSection = document.querySelector(".bg-white.p-6");
            additionalDetailsSection.appendChild(imagePreview);
        };
        reader.readAsDataURL(file);
    }
});