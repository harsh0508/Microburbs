document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('suburb-input');
    const container = document.getElementById('tiles-container')
    const spinner = document.getElementById('loading-spinner')

    const minPriceInput = document.getElementById('min-price')
    const maxPriceInput = document.getElementById('max-price')
    const bedroomsInput = document.getElementById('bedrooms')
    const bathroomsInput = document.getElementById('bathrooms')
    const filter = document.getElementById('filter')
    const hero = document.getElementById('hero')

    let debounceTimer;
    let properties = []; 

    const renderTiles = (data) => {
        container.innerHTML = ""
        if (!data || data.length === 0) {
            container.innerHTML = "<p>No properties found.</p>"
            return;
        }

        data.forEach(property => {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.innerHTML = `
                <h3>${property.address?.street || "Property"}</h3>
                <p><i>${property.area_name || ""}</i></p>
                <p class="price">${property.price ? "$" + property.price.toLocaleString() : "Price N/A"}</p>
                <p>Bedrooms: ${property.attributes?.bedrooms || 'N/A'}, Bathrooms: ${property.attributes?.bathrooms || 'N/A'}, Garage: ${property.attributes?.garage_spaces || 'N/A'}</p>
                <p>Land Size: ${property.attributes?.land_size || 'N/A'}, Building Size: ${property.attributes?.building_size || 'N/A'}</p>
                <p style="white-space: pre-line;">${property.attributes?.description || 'No description'}</p>
            `;
            container.appendChild(tile);
        });
    };

    const applyFilters = () => {
        let filtered = [...properties];
        const minPrice = parseFloat(minPriceInput.value) || 0
        const maxPrice = parseFloat(maxPriceInput.value) || Infinity
        const bedrooms = parseInt(bedroomsInput.value) || 0
        const bathrooms = parseInt(bathroomsInput.value) || 0

        filtered = filtered.filter(p => 
            (p.price >= minPrice && p.price <= maxPrice) &&
            (p.attributes?.bedrooms >= bedrooms) &&
            (p.attributes?.bathrooms >= bathrooms)
        );

        renderTiles(filtered);
    };

    
    [minPriceInput, maxPriceInput, bedroomsInput, bathroomsInput].forEach(el => {
        el.addEventListener('change', applyFilters)
    });

    
    input.addEventListener('input', () => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            const suburb = input.value.trim()
            if(suburb == ""){
                hero.classList.remove('shrink')
                hero.classList.add('unshrink')
                filter.style.display = 'none'
            }
            if (!suburb) return;

            spinner.style.display = "flex";
            container.innerHTML = "";

            fetch(`/getHomeData?suburb=${encodeURIComponent(suburb)}`)
                .then(res => res.json())
                .then(data => {
                    spinner.style.display = "none"

                    filter.style.display = 'flex'
                    hero.classList.remove('unshrink')
                    hero.classList.add('shrink')

                    properties = data.results || []
                    applyFilters()
                })
                .catch(err => {
                    spinner.style.display = "none"
                    container.innerHTML = "<p>Error loading properties.</p>"
                    console.error(err);
                });
        }, 2000); // 2s debounce
    });
});
