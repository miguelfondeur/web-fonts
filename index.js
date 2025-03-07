'use strict'

// Imports
import { fonts } from './font-data.js';

// Elements
const cardWrapper = document.getElementById('card-wrapper');
const filters = document.getElementById('filters');
const previewInput = document.getElementById('sample-text');
const searchInput = document.getElementById('search'); // Font search input
const styleSelects = document.querySelectorAll('.style-select input[type="checkbox"]');

let filterOpen = filters.getAttribute('data-open') === "true";

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
            <button class="card" ${cardDisabled ? 'disabled' : ''}>
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

// Click event for toggling filters
document.addEventListener('click', e => {
    const filterTrigger = e.target.closest("#filters-button");
    if (filterTrigger) {
        filterOpen = !filterOpen;
        filters.setAttribute('data-open', filterOpen);
    }
});

// Update text dynamically in preview
previewInput.addEventListener('keyup', () => {
    document.querySelectorAll('.text-example').forEach(element => {
        element.textContent = previewInput.value || "The quick brown fox jumps over a lazy dog";
    });
});

// Handle checkbox changes for filtering & UI state
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
