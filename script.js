import { fundings } from 'data/fundings.js'; // This now includes festivals
import { fundingStages, fundingFormats, frenchRegions } from 'utils/constants.js';
import { renderCategories } from 'render/categoryRenderer.js';
import { renderFundings } from 'render/fundingCardRenderer.js';
import { filterFundings } from 'logic/filterLogic.js';

const fundingListElement = document.getElementById('fundingList');
const searchInputElement = document.getElementById('searchInput');
const typeFilterElement = document.getElementById('typeFilter');
const stageFilterElement = document.getElementById('stageFilter');
const categoryFiltersElement = document.getElementById('categoryFilters');
const urlInputElement = document.getElementById('urlInput');
const addUrlButtonElement = document.getElementById('addUrlBtn');
const urlMessageElement = document.getElementById('urlMessage');

const applyFiltersAndRender = () => {
    const searchTerm = searchInputElement.value.toLowerCase();
    const typeFilter = typeFilterElement.value;
    const stageFilter = stageFilterElement.value;
    // For category filters, collect all checked values, which are now 'formats'
    const selectedCategories = Array.from(categoryFiltersElement.querySelectorAll('input:checked')).map(input => input.value);

    const filteredFundings = filterFundings(
        searchTerm,
        typeFilter,
        stageFilter,
        selectedCategories, // These are now 'formats'
        fundings, // Pass the combined data
        frenchRegions // Pass regions for 'Regional' type filter logic
    );

    renderFundings(filteredFundings, fundingListElement);
};

const handleAddUrl = () => {
    const url = urlInputElement.value.trim();
    urlMessageElement.innerHTML = ''; // Clear previous messages

    if (!url) {
        urlMessageElement.className = 'text-warning';
        urlMessageElement.textContent = 'Please enter a URL.';
        return;
    }

    // Basic URL validation
    try {
        new URL(url);
    } catch (e) {
        urlMessageElement.className = 'text-danger';
        urlMessageElement.textContent = 'Invalid URL format.';
        return;
    }

    // Check if the URL already exists in our current fundings list
    const existingFunding = fundings.find(f => f.link === url);

    if (existingFunding) {
        urlMessageElement.className = 'text-info';
        urlMessageElement.textContent = 'This URL already exists in the funding list.';
    } else {
        // As direct client-side analysis (scraping) of external websites is not feasible due to security policies (Same-Origin Policy),
        // we'll prompt the user for the funding name.
        const fundingName = prompt("Please enter the name of the funding opportunity from the website:");

        if (!fundingName || fundingName.trim() === '') {
            urlMessageElement.className = 'text-warning';
            urlMessageElement.textContent = 'Funding name is required to add a new opportunity. Operation cancelled.';
            return;
        }

        const newId = `custom-${Date.now()}`; // Simple unique ID
        const newFunding = {
            id: newId,
            name: fundingName.trim(), // Use the user-provided name
            organization: `External (User Added)`, // Indicate it's user-added
            type: "Privé", // Default type, user can infer/edit if a backend was present
            description: `User-added funding from URL: ${url}. (Details not automatically extracted client-side.)`, // Clarify limitation
            link: url,
            stages: ["développement", "production"], // Generic stages
            formats: ["cinéma"], // Generic format
            amount: "To be researched",
            nextDeadline: "N/A (user added)",
            genericDeadline: "Variable (user added)"
        };
        fundings.push(newFunding); // Add to the in-memory fundings array

        urlMessageElement.className = 'text-success';
        urlMessageElement.textContent = `Added "${fundingName.trim()}" from URL: ${url}. (Note: Full page analysis is not supported client-side.)`;
        urlInputElement.value = ''; // Clear the input field

        applyFiltersAndRender(); // Re-render the list with the new item
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Render the 'Other Categories' checkboxes using fundingFormats
    renderCategories(fundingFormats, categoryFiltersElement); // Pass formats and container
    renderFundings(fundings, fundingListElement); // Initial render of all fundings

    searchInputElement.addEventListener('input', applyFiltersAndRender);
    typeFilterElement.addEventListener('change', applyFiltersAndRender);
    stageFilterElement.addEventListener('change', applyFiltersAndRender);
    categoryFiltersElement.addEventListener('change', applyFiltersAndRender);

    // New event listener for the URL input button
    addUrlButtonElement.addEventListener('click', handleAddUrl);
});