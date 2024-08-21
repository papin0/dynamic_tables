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

                          function initializeReplacementChart(chartElement) {
        new Chart(chartElement, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'Independent',
                        data: [],
                        borderColor: '#4CAF50',
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        fill: false
                    },
                    {
                        label: 'Prompt',
                        data: [],
                        borderColor: '#FFC107',
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        title: {
                            display: true,
                            text: 'Percentage'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    },
                    x: {
                        type: 'time',
                        time: {
                            parser: 'MM/DD/YYYY',
                            unit: 'day',
                            displayFormats: {
                                day: 'MM/dd/yyyy'
                            }
                        },
                        ticks: {
                            source: 'labels'
                        }
                    }
                }
            }
        });
    }

    function openChartPopup(sectionId, type) {
        const popupOverlay = document.getElementById('popup-overlay');
        const chartPopup = document.getElementById('chart-popup');
        const popupFields = document.getElementById('popup-fields');

        popupFields.innerHTML = '';

        const behaviorName = document.querySelector(`#section-${sectionId} input[type="text"]`).value;

        const titlesRow = document.createElement('div');
        titlesRow.classList.add('row', 'mb-2');
        titlesRow.innerHTML = `
            <div class="col-md-6"><strong>Date</strong></div>
            <div class="col-md-6"><strong>${behaviorName}</strong></div>
        `;
        popupFields.appendChild(titlesRow);

        for (let i = 0; i < 12; i++) {
            const fieldRow = document.createElement('div');
            fieldRow.classList.add('row', 'mb-2');
            fieldRow.innerHTML = `
                <div class="col-md-6">
                    <input type="date" class="form-control">
                </div>
                <div class="col-md-6">
                    <input type="number" class="form-control" placeholder="Enter Value">
                </div>
            `;
            popupFields.appendChild(fieldRow);
        }

        if (sectionData[sectionId]) {
            const dateInputs = popupFields.querySelectorAll('input[type="date"]');
            const valueInputs = popupFields.querySelectorAll('input[type="number"]');
            sectionData[sectionId].forEach((item, index) => {
                if (dateInputs[index] && valueInputs[index]) {
                    dateInputs[index].value = item.date || '';
                    valueInputs[index].value = item.value !== null ? item.value : '';
                }
            });
        }

        popupOverlay.classList.add('active');
        chartPopup.classList.add('active');

        document.getElementById('save-btn').onclick = function() {
            savePopupData(sectionId, type);
        };
    }

                          function openReplacementChartPopup(sectionId) {
        console.log('Opening replacement popup for section:', sectionId);
        const popupOverlay = document.getElementById('popup-overlay');
        const chartPopup = document.getElementById('chart-popup');
        const popupFields = document.getElementById('popup-fields');

        popupFields.innerHTML = '';

        const behaviorName = document.querySelector(`#section-${sectionId} input[type="text"]`).value;

        const titlesRow = document.createElement('div');
        titlesRow.classList.add('row', 'mb-2');
        titlesRow.innerHTML = `
            <div class="col-md-4"><strong>Date</strong></div>
            <div class="col-md-4"><strong>I (${behaviorName})</strong></div>
            <div class="col-md-4"><strong>P (${behaviorName})</strong></div>
        `;
        popupFields.appendChild(titlesRow);

        for (let i = 0; i < 12; i++) {
            const fieldRow = document.createElement('div');
            fieldRow.classList.add('row', 'mb-2');
            fieldRow.innerHTML = `
                <div class="col-md-4">
                    <input type="date" class="form-control">
                </div>
                <div class="col-md-4">
                    <input type="number" class="form-control i-input" placeholder="I">
                </div>
                <div class="col-md-4">
                    <input type="number" class="form-control p-input" placeholder="P">
                </div>
            `;
            popupFields.appendChild(fieldRow);
        }

        if (sectionData[sectionId]) {
            const dateInputs = popupFields.querySelectorAll('input[type="date"]');
            const iInputs = popupFields.querySelectorAll('.i-input');
            const pInputs = popupFields.querySelectorAll('.p-input');
            sectionData[sectionId].forEach((item, index) => {
                if (dateInputs[index] && iInputs[index] && pInputs[index]) {
                    dateInputs[index].value = item.date || '';
                    iInputs[index].value = item.independent !== null ? item.independent : '';
                    pInputs[index].value = item.prompt !== null ? item.prompt : '';
                }
            });
        }

        popupOverlay.classList.add('active');
        chartPopup.classList.add('active');

        document.getElementById('save-btn').onclick = function() {
            saveReplacementPopupData(sectionId);
        };
    }

    function savePopupData(sectionId, type) {
        const popupFields = document.getElementById('popup-fields');
        const dateInputs = popupFields.querySelectorAll('input[type="date"]');
        const valueInputs = popupFields.querySelectorAll('input[type="number"]');

        sectionData[sectionId] = Array.from(dateInputs).map((dateInput, index) => ({
            date: dateInput.value,
            value: valueInputs[index].value === '' ? null : parseFloat(valueInputs[index].value)
        }));

        const section = document.getElementById(`section-${sectionId}`);
        const chartElement = section.querySelector('canvas');
        const chart = Chart.getChart(chartElement);

        if (chart) {
            chart.data.labels = sectionData[sectionId].map(item => item.date);
            chart.data.datasets[0].data = sectionData[sectionId].map(item => item.value);
            chart.data.datasets[0].label = section.querySelector('input[type="text"]').value;
            chart.update();
        }

        const validValues = sectionData[sectionId].filter(item => item.value !== null).map(item => item.value);
        if (validValues.length > 0) {
            const total = validValues.reduce((acc, val) => acc + val, 0);
            const average = Math.round(total / validValues.length);
            section.querySelector('.baseline-avg').value = average;
            section.querySelector('.prior-auth-avg').value = average;
            section.querySelector('.current-avg').value = average;
        }

        document.getElementById('popup-overlay').classList.remove('active');
        document.getElementById('chart-popup').classList.remove('active');
    }

                          function saveReplacementPopupData(sectionId) {
        console.log('Saving replacement data for section:', sectionId);
        const popupFields = document.getElementById('popup-fields');
        const dateInputs = popupFields.querySelectorAll('input[type="date"]');
        const iInputs = popupFields.querySelectorAll('.i-input');
        const pInputs = popupFields.querySelectorAll('.p-input');

        sectionData[sectionId] = Array.from(dateInputs).map((dateInput, index) => ({
            date: dateInput.value,
            independent: iInputs[index].value === '' ? null : parseInt(iInputs[index].value),
            prompt: pInputs[index].value === '' ? null : parseInt(pInputs[index].value)
        }));

        const section = document.getElementById(`section-${sectionId}`);
        const chartElement = section.querySelector('.replacement-chart');
        const chart = Chart.getChart(chartElement);

        if (chart) {
            chart.data.labels = sectionData[sectionId].map(item => item.date);
            chart.data.datasets = [
                {
                    label: 'Independent',
                    data: sectionData[sectionId].map(item => item.independent),
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76, 175, 80, 0.2)',
                    fill: false
                },
                {
                    label: 'Prompt',
                    data: sectionData[sectionId].map(item => item.prompt),
                    borderColor: '#FFC107',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    fill: false
                }
            ];
            chart.update();
        }

        const validIValues = sectionData[sectionId].filter(item => item.independent !== null).map(item => item.independent);
        if (validIValues.length > 0) {
            const total = validIValues.reduce((acc, val) => acc + val, 0);
            const average = Math.round(total / validIValues.length);
            section.querySelector('.baseline-avg').value = average;
            section.querySelector('.prior-auth-avg').value = average;
            section.querySelector('.current-avg').value = average;
        }

        document.getElementById('popup-overlay').classList.remove('active');
        document.getElementById('chart-popup').classList.remove('active');
    }

    function updateTargetBehaviorOptions() {
        const behaviorNames = Array.from(document.querySelectorAll('.target-behavior-name')).map(input => input.value);
        targetBehaviorOptions.splice(0, targetBehaviorOptions.length, ...behaviorNames);
        document.querySelectorAll('.behavior-select').forEach(select => {
            populateBehaviorSelect(select);
        });
    }

    function populateBehaviorSelect(selectElement) {
        selectElement.innerHTML = '<option>Select item</option>';
        targetBehaviorOptions.forEach(behavior => {
            if (behavior.trim() !== '') {
                const option = document.createElement('option');
                option.value = behavior;
                option.textContent = behavior;
                selectElement.appendChild(option);
            }
        });
    }

    // Initialize the page
    updateTargetBehaviorOptions();
});
