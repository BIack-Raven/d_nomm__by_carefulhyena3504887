export const renderCategories = (categories, containerElement) => {
    // Clear existing content if any, though in this case it's injected once.
    // containerElement.innerHTML = ''; 
    categories.sort().forEach(category => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'form-check form-check-inline';
        const categoryId = `category-${category.replace(/\s+/g, '-')}`;
        checkboxContainer.innerHTML = `
            <input class="form-check-input" type="checkbox" value="${category}" id="${categoryId}">
            <label class="form-check-label" for="${categoryId}">
                ${category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
        `;
        containerElement.appendChild(checkboxContainer);
    });
};