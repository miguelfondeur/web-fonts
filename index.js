'use strict';

// Imports
import { fonts } from './font-data.js';

// Elements
const cardWrapper = document.getElementById('card-wrapper');
const previewInput = document.getElementById('sample-text');
const searchInput = document.getElementById('search'); // Font search input
const styleSelects = document.querySelectorAll('.style-select input[type="checkbox"]');
const activeFontTitle = document.getElementById('active-font-title');
const stylePreview = document.getElementById('style-preview');

// Function to render fonts based on selected filters and search input
const renderFonts = () => {
    const selectedTypes = [...styleSelects]
        .filter(cb => cb.checked)
        .map(cb => cb.name); // Get checked font styles
    
    const searchQuery = searchInput.value.trim().toLowerCase(); // Get search input

    // Clear existing font cards
    cardWrapper.innerHTML = '';

    // Filter fonts based on styles and search query
    const filteredFonts = fonts.filter(font => {
        const matchesType = selectedTypes.length ? selectedTypes.includes(font.type) : true;
        const matchesSearch = font.name.toLowerCase().includes(searchQuery); // Checks if query exists anywhere in the name
        return matchesType && matchesSearch;
    });

    // Render filtered fonts
    filteredFonts.forEach(font => {
        let cardDisabled = !document.fonts.check(`12px ${font.declaration}`);

        const html = `
            <button 
                class="card" 
                data-name="${ font.name }" 
                data-declaration="${ font.declaration }" 
                data-type="${ font.type }"
                data-weights="${font.weights}"
                popovertarget="details" 
                ${cardDisabled ? 'disabled' : ''}
            >
                <div class="card-top">
                    <h3>${font.name}</h3>
                    <p>${font.weights.length} Styles</p>
                </div>
                <p class="text-example" style="font-family: ${font.declaration};">
                    The quick brown fox jumps over a lazy dog
                </p>
            </button>`;

        cardWrapper.insertAdjacentHTML('beforeEnd', html);
    });
};

// Initial render
renderFonts();

// Click event for font selection (separate from sidebar logic)
document.addEventListener('click', e => {
    const card = e.target.closest('.card'); // Find the closest card element

    if (card) {
        // Close the sidebar if open
        const filters = document.getElementById('filters');
        if (filters.getAttribute('data-open') === "true") {
            filters.setAttribute('data-open', "false");
        }

        // Open font details
        const weights = card.dataset.weights.split(',');
        openDetails(card.dataset.name, card.dataset.declaration, weights, card.dataset.type);
    }
});

// Open font details
const openDetails = (fontName, declaration, weights, type) => {
    stylePreview.innerHTML = ""; //Clear First!

    // Set Active Values
    activeFontTitle.innerText = fontName;
    document.documentElement.style.setProperty('--active-font', declaration);
    
    // Update CSS declarations
    document.getElementById('css-declaration').innerHTML = `<pre><code>font-family: ${declaration};</code></pre>`;
    document.getElementById('css-fallbacks').innerHTML = `<pre><code>font-family: ${declaration}, ${type};</code></pre>`;

    weights.forEach(weight => {
        const styleCardHTML = `
            <div class="style-card">
                <div><strong><small>Regular ${weight}</small></strong></div>
                <p style="font-weight: ${weight}" class="text-example" contenteditable="true">
                    The quick brown fox jumps over a lazy dog
                </p>
            </div>
            <div class="style-card">
                <div><strong><small>Italic ${weight}</small></strong></div>
                <p style="font-weight: ${weight}" class="text-example" contenteditable="true">
                    <em>The quick brown fox jumps over a lazy dog</em>
                </p>
            </div>`;
        stylePreview.insertAdjacentHTML('beforeend', styleCardHTML);
    });
};

// Update preview text dynamically
previewInput.addEventListener('keyup', () => {
    document.querySelectorAll('.text-example').forEach(element => {
        element.textContent = previewInput.value || "The quick brown fox jumps over a lazy dog";
    });
});

// Handle checkbox changes for filtering
styleSelects.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const label = checkbox.closest('.style-select');
        label.setAttribute('data-selected', checkbox.checked);
        renderFonts(); // Re-render fonts on checkbox change
    });
});

// Handle search input (filters for any matching part of the name)
searchInput.addEventListener('keyup', () => {
    renderFonts(); // Re-render fonts on search input
});
