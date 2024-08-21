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

                          document.getElementById('add-abc-data-row-btn').addEventListener('click', function() {
        const abcDataRows = document.getElementById('abc-data-rows');
        const newRowId = ++idCounter;
        const newRow = document.createElement('div');
        newRow.classList.add('row', 'mb-3', 'abc-data-row');
        newRow.id = `row-${newRowId}`;
        newRow.innerHTML = `
            <div class="col-md-2">
                <input type="date" class="form-control equal-height">
            </div>
            <div class="col-md-2">
                <select class="form-control equal-height">
                    <option>Select item</option>
                    <option>Home</option>
                    <option>School</option>
                    <option>Clinic</option>
                    <option>Community</option>
                </select>
            </div>
            <div class="col-md-2">
                <textarea class="form-control textarea-full-height" placeholder="Antecedents"></textarea>
            </div>
            <div class="col-md-2">
                <select class="form-control behavior-select"></select>
            </div>
            <div class="col-md-2">
                <textarea class="form-control textarea-full-height" placeholder="Consequences"></textarea>
            </div>
            <div class="col-md-2 d-flex align-items-center">
                <select class="form-control equal-height">
                    <option>Select item</option>
                    <option>Escape</option>
                    <option>Attention</option>
                    <option>Tangibles</option>
                    <option>Sensory</option>
                </select>
                <button class="remove-btn ms-2" data-section-id="${newRowId}" title="Delete Row">🗑️</button>
            </div>
        `;
        abcDataRows.appendChild(newRow);
        populateBehaviorSelect(newRow.querySelector('.behavior-select'));
    });

    function addReductionSection(sectionId) {
        if (reductionCount < maxSections) {
            const sectionTemplate = document.createElement('div');
            sectionTemplate.classList.add('analysis-section', 'reduction-section');
            sectionTemplate.id = `section-${sectionId}`;
            sectionTemplate.innerHTML = `
                <div class="section-title">ANALYSIS of 
                    <input type="text" class="form-control d-inline w-25" placeholder="Behavior Name">
                    TARGET BEHAVIOR FOR DECELERATION
                    <button class="remove-btn ms-2 float-end" title="Delete Behavior">🗑️</button>
                </div>
                <div class="section-title d-flex justify-content-between align-items-center">
                    <span>Graphed Baseline Data</span>
                    <button class="btn-emoji graph-btn" data-section-id="${sectionId}" data-type="target" title="Open Chart Popup">📈</button>
                </div>
                <div class="chart-container">
                    <canvas class="reduction-chart"></canvas>
                </div>
            `;
            document.getElementById('reduction-container').appendChild(sectionTemplate);
            initializeReductionChart(sectionTemplate.querySelector('.reduction-chart'));
            reductionCount++;
        } else {
            alert('Maximum sections reached.');
        }
    }

                          function addReplacementSection(sectionId) {
        if (replacementCount < maxSections) {
            const sectionTemplate = document.createElement('div');
            sectionTemplate.classList.add('analysis-section', 'replacement-section');
            sectionTemplate.id = `section-${sectionId}`;
            sectionTemplate.innerHTML = `
                <div class="section-title">ANALYSIS of 
                    <input type="text" class="form-control d-inline w-25" placeholder="Behavior Name">
                    REPLACEMENT BEHAVIOR FOR ACCELERATION
                    <button class="remove-btn ms-2 float-end" title="Delete Behavior">🗑️</button>
                </div>
                <div class="section-title d-flex justify-content-between align-items-center">
                    <span>Graphed Baseline Data</span>
                    <button class="btn-emoji graph-btn" data-section-id="${sectionId}" data-type="replacement" title="Open Chart Popup">📉</button>
                </div>
                <div class="chart-container">
                    <canvas class="replacement-chart"></canvas>
                </div>
            `;
            document.getElementById('replacement-container').appendChild(sectionTemplate);
            initializeReplacementChart(sectionTemplate.querySelector('.replacement-chart'));
            replacementCount++;
        } else {
            alert('Maximum sections reached.');
        }
    }

    function initializeReductionChart(chartElement) {
        new Chart(chartElement, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
                    borderColor: '#5192CF',
                    backgroundColor: 'rgba(81, 146, 207, 0.2)',
                    fill: false,
                    tension: 0.1,
                    spanGaps: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Frequency'
                        }
                    },
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            displayFormats: {
                                day: 'MM/dd/yyyy'
                            }
                        }
                    }
                }
            }
        });
    }
