export const filterFundings = (searchTerm, typeFilter, stageFilter, selectedCategories, allFundings, frenchRegions) => {
    return allFundings.filter(funding => {
        const matchesSearch = funding.name.toLowerCase().includes(searchTerm) ||
                              funding.organization.toLowerCase().includes(searchTerm) ||
                              funding.description.toLowerCase().includes(searchTerm);
        
        const matchesType = typeFilter === 'all' || 
                            (typeFilter === 'Regional' && frenchRegions.includes(funding.type)) || 
                            funding.type === typeFilter;

        // Check if the funding's stages array includes the selected stage filter
        const matchesStage = stageFilter === 'all' || funding.stages.includes(stageFilter);

        // Check if the funding's formats array includes at least one of the selected categories
        const matchesCategory = selectedCategories.length === 0 || 
                                selectedCategories.some(cat => funding.formats.includes(cat));
        
        return matchesSearch && matchesType && matchesStage && matchesCategory;
    });
};