export const renderFundings = (fundingsToRender, containerElement) => {
    containerElement.innerHTML = '';
    if (fundingsToRender.length === 0) {
        containerElement.innerHTML = `<p class="col-12 text-center text-muted">No funding opportunities found matching your criteria.</p>`;
        return;
    }

    fundingsToRender.forEach(funding => {
        const card = document.createElement('div');
        card.className = 'col-lg-4 col-md-6 mb-4';

        // Display stages as info tags and formats as primary tags
        const stageTagsHtml = funding.stages.map(stage => `<span class="badge bg-info text-dark">${stage}</span>`).join(' ');
        const formatTagsHtml = funding.formats.map(format => `<span class="badge bg-primary">${format}</span>`).join(' ');
        const allTagsHtml = `${stageTagsHtml} ${formatTagsHtml}`.trim();

        card.innerHTML = `
            <div class="card funding-card">
                <div class="card-body">
                    <h5 class="card-title">${funding.name}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">${funding.organization}</h6>
                    <div class="d-flex mb-3">
                        <span class="badge bg-secondary">${funding.type}</span>
                    </div>
                    <div class="card-tags">
                        ${allTagsHtml}
                    </div>
                    <p class="card-text">${funding.description}</p>
                    <p class="card-text"><small class="text-muted">Montant: ${funding.amount}</small></p>
                    <p class="card-text"><small class="text-muted">Prochaine Deadline: ${funding.nextDeadline}</small></p>
                    <p class="card-text"><small class="text-muted">Deadline Générique: ${funding.genericDeadline}</small></p>
                    <a href="${funding.link}" target="_blank" class="btn btn-primary mt-auto">Learn More</a>
                </div>
            </div>
        `;
        containerElement.appendChild(card);
    });
};