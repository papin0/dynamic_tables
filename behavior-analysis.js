// behavior-analysis.js

document.addEventListener('DOMContentLoaded', function() {
    const maxSections = 20;
    let replacementCount = 0;
    let reductionCount = 0;
    let idCounter = 0;

    const sectionData = {};
    const targetBehaviorOptions = [];

    const analysisContainer = document.getElementById('analysis-container');

    analysisContainer.addEventListener('click', function(event) {
        if (event.target.matches('.remove-btn')) {
            const sectionId = event.target.dataset.sectionId;
            const row = document.getElementById(`row-${sectionId}`);
            const section = document.getElementById(`section-${sectionId}`);
            if (row) row.remove();
            if (section) section.remove();
            updateTargetBehaviorOptions();
        }

        if (event.target.matches('.btn-emoji.graph-btn')) {
            const sectionId = event.target.dataset.sectionId;
            const type = event.target.dataset.type;
            if (type === 'target') {
                openChartPopup(sectionId, type);
            } else if (type === 'replacement') {
                openReplacementChartPopup(sectionId);
            }
        }
    });

    document.getElementById('popup-close-btn').addEventListener('click', function() {
        document.getElementById('popup-overlay').classList.remove('active');
        document.getElementById('chart-popup').classList.remove('active');
    });

  document.getElementById('add-target-behavior-row-btn').addEventListener('click', function() {
        const targetBehaviorRows = document.getElementById('target-behaviors-rows');
        const newRowId = ++idCounter;
        const newRow = document.createElement('div');
        newRow.classList.add('row', 'mb-3', 'target-behavior-row');
        newRow.id = `row-${newRowId}`;
        newRow.innerHTML = `
            <div class="col-md-2">
                <input type="text" class="form-control equal-height target-behavior-name" placeholder="Enter Behavior Name">
            </div>
            <div class="col-md-8">
                <textarea class="form-control textarea-full-height" rows="2"></textarea>
            </div>
            <div class="col-md-2 d-flex align-items-center">
                <input type="date" class="form-control equal-height">
                <button class="remove-btn ms-2" data-section-id="${newRowId}" title="Delete Row">🗑️</button>
            </div>
        `;
        targetBehaviorRows.appendChild(newRow);
        addReductionSection(newRowId); 

        newRow.querySelector('.target-behavior-name').addEventListener('input', function() {
            document.querySelector(`#section-${newRowId} input[type="text"]`).value = this.value;
            updateTargetBehaviorOptions();
        });
    });

    document.getElementById('add-replacement-behavior-row-btn').addEventListener('click', function() {
        const replacementBehaviorRows = document.getElementById('replacement-behaviors-rows');
        const newRowId = ++idCounter;
        const newRow = document.createElement('div');
        newRow.classList.add('row', 'mb-3', 'replacement-behavior-row');
        newRow.id = `row-${newRowId}`;
        newRow.innerHTML = `
            <div class="col-md-2">
                <input type="text" class="form-control equal-height behavior-name" placeholder="Enter Behavior Name">
            </div>
            <div class="col-md-8">
                <textarea class="form-control textarea-full-height" rows="2"></textarea>
            </div>
            <div class="col-md-2 d-flex align-items-center">
                <input type="date" class="form-control equal-height">
                <button class="remove-btn ms-2" data-section-id="${newRowId}" title="Delete Row">🗑️</button>
            </div>
        `;
        replacementBehaviorRows.appendChild(newRow);
        addReplacementSection(newRowId);

        newRow.querySelector('input[type="text"]').addEventListener('input', function() {
            document.querySelector(`#section-${newRowId} input[type="text"]`).value = this.value;
        });
    });
