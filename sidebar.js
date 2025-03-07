'use strict';

const filters = document.getElementById('filters');
const filtersButton = document.getElementById('filters-button');

export const initSidebar = () => {
    if (!filters || !filtersButton) return; // Exit if elements don’t exist

    let filterOpen = filters.getAttribute('data-open') === "true";

    document.addEventListener('click', e => {
        const filterTrigger = e.target.closest("#filters-button");
        if (filterTrigger) {
            filterOpen = !filterOpen;
            filters.setAttribute('data-open', filterOpen);
        }
    });

    const resizeObserver = new ResizeObserver(() => {
        // Always close the sidebar on resize
        if (filters.getAttribute('data-open') === "true") {
            filters.setAttribute('data-open', "false");
            filterOpen = false;
        }
    });

    resizeObserver.observe(document.body); // Observe the body (or another relevant element)
};

// Initialize sidebar functionality
initSidebar();
