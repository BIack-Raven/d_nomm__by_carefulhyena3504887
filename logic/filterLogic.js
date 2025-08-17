// Cache for search terms to avoid repeated processing
const searchCache = new Map();
const MAX_CACHE_SIZE = 100; // Limit cache size to prevent memory issues

// Helper function to normalize and cache search terms
const normalizeSearchTerm = (term) => {
    if (searchCache.has(term)) {
        return searchCache.get(term);
    }
    
    // Limit cache size by removing oldest entries if needed
    if (searchCache.size >= MAX_CACHE_SIZE) {
        const firstKey = searchCache.keys().next().value;
        searchCache.delete(firstKey);
    }
    
    const normalized = term.toLowerCase().trim();
    searchCache.set(term, normalized);
    return normalized;
};

// Helper function to check if funding matches search term
const matchesSearchTerm = (funding, searchTerm) => {
    if (!searchTerm) return true;
    
    const normalizedSearch = normalizeSearchTerm(searchTerm);
    if (normalizedSearch === '') return true;
    
    // Pre-compute normalized values for comparison
    const normalizedName = funding.name.toLowerCase();
    const normalizedOrg = funding.organization.toLowerCase();
    const normalizedDesc = funding.description.toLowerCase();
    
    return normalizedName.includes(normalizedSearch) ||
           normalizedOrg.includes(normalizedSearch) ||
           normalizedDesc.includes(normalizedSearch);
};

export const filterFundings = (searchTerm, typeFilter, stageFilter, selectedCategories, allFundings, frenchRegions) => {
    // Early return if no filters are applied
    if (searchTerm === '' && typeFilter === 'all' && stageFilter === 'all' && selectedCategories.length === 0) {
        return allFundings;
    }
    
    return allFundings.filter(funding => {
        // Search filtering
        if (!matchesSearchTerm(funding, searchTerm)) {
            return false;
        }
        
        // Type filtering
        if (typeFilter !== 'all') {
            if (typeFilter === 'Regional') {
                if (!frenchRegions.includes(funding.type)) {
                    return false;
                }
            } else if (funding.type !== typeFilter) {
                return false;
            }
        }
        
        // Stage filtering
        if (stageFilter !== 'all' && !funding.stages.includes(stageFilter)) {
            return false;
        }
        
        // Category filtering
        if (selectedCategories.length > 0 && !selectedCategories.some(cat => funding.formats.includes(cat))) {
            return false;
        }
        
        return true;
    });
};