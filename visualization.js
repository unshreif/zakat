/**
 * Visualization Module for Zakat Calculator
 * Provides interactive charts and graphs for better financial insights
 */

const Visualization = {
    // Chart configuration
    config: {
        colors: {
            assets: '#4CAF50',
            liabilities: '#F44336',
            netWorth: '#2196F3',
            zakat: '#FFC107'
        },
        animation: {
            duration: 800,
            easing: 'easeOutQuart'
        }
    },
    
    /**
     * Initialize the visualization module
     */
    init() {
        // Create container for charts if it doesn't exist
        if (!document.querySelector('.visualization-container')) {
            const resultsSection = document.querySelector('.results-section');
            
            if (resultsSection) {
                const vizContainer = document.createElement('div');
                vizContainer.className = 'visualization-container';
                vizContainer.innerHTML = `
                    <h3>Financial Breakdown</h3>
                    <div class="chart-container">
                        <canvas id="assetsChart"></canvas>
                    </div>
                    <div class="chart-tabs">
                        <button class="chart-tab active" data-chart="breakdown">Breakdown</button>
                        <button class="chart-tab" data-chart="history">History</button>
                    </div>
                `;
                
                // Insert after results but before explanation
                const explanationBox = document.querySelector('.zakat-explanation');
                if (explanationBox) {
                    resultsSection.insertBefore(vizContainer, explanationBox);
                } else {
                    resultsSection.appendChild(vizContainer);
                }
                
                // Add event listeners to tabs
                this.initTabListeners();
            }
        }
        
        console.log('Visualization module initialized');
    },
    
    /**
     * Initialize tab listeners for switching between charts
     */
    initTabListeners() {
        const tabs = document.querySelectorAll('.chart-tab');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Show appropriate chart
                const chartType = tab.dataset.chart;
                if (chartType === 'breakdown') {
                    this.renderBreakdownChart();
                } else if (chartType === 'history') {
                    this.renderHistoryChart();
                }
            });
        });
    },
    
    /**
     * Render the financial breakdown chart
     * @param {Object} data - Financial data for visualization
     */
    renderBreakdownChart(data = null) {
        // If no data is provided, get it from the results section
        if (!data) {
            data = this.getDataFromResults();
        }
        
        const canvas = document.getElementById('assetsChart');
        if (!canvas) return;
        
        // Clear any existing chart
        if (canvas._chart) {
            canvas._chart.destroy();
        }
        
        // Create the doughnut chart
        const ctx = canvas.getContext('2d');
        
        // Prepare data for chart
        const chartData = {
            labels: ['Assets', 'Liabilities', 'Zakat Due'],
            datasets: [{
                data: [data.totalAssets, data.totalLiabilities, data.zakatDue],
                backgroundColor: [
                    this.config.colors.assets,
                    this.config.colors.liabilities,
                    this.config.colors.zakat
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        };
        
        // Chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            animation: this.config.animation,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        font: {
                            family: "'Poppins', sans-serif",
                            size: 12
                        },
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const currency = document.getElementById('currency').value;
                            
                            // Format the value as currency
                            const formatter = new Intl.NumberFormat(undefined, {
                                style: 'currency',
                                currency: currency
                            });
                            
                            return `${label}: ${formatter.format(value)}`;
                        }
                    }
                }
            }
        };
        
        // Create chart
        canvas._chart = new Chart(ctx, {
            type: 'doughnut',
            data: chartData,
            options: options
        });
    },
    
    /**
     * Render the calculation history chart
     */
    renderHistoryChart() {
        const canvas = document.getElementById('assetsChart');
        if (!canvas) return;
        
        // Get history data from localStorage
        const history = JSON.parse(localStorage.getItem('zakatHistory') || '[]');
        
        // If no history, show message
        if (history.length === 0) {
            if (canvas._chart) {
                canvas._chart.destroy();
            }
            
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "14px 'Poppins', sans-serif";
            ctx.fillStyle = '#757575';
            ctx.textAlign = 'center';
            ctx.fillText('No calculation history available', canvas.width / 2, canvas.height / 2);
            return;
        }
        
        // Clear any existing chart
        if (canvas._chart) {
            canvas._chart.destroy();
        }
        
        // Format dates for display
        const labels = history.map(item => {
            const date = new Date(item.date);
            return date.toLocaleDateString();
        });
        
        // Get zakat values
        const zakatValues = history.map(item => item.zakatDue);
        
        // Create the line chart
        const ctx = canvas.getContext('2d');
        
        // Chart data
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Zakat Due',
                data: zakatValues,
                borderColor: this.config.colors.zakat,
                backgroundColor: 'rgba(255, 193, 7, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: this.config.colors.zakat,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        };
        
        // Chart options
        const options = {
            responsive: true,
            maintainAspectRatio: false,
            animation: this.config.animation,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            // Use the currency from the most recent calculation
                            const currency = history[0].currency;
                            
                            // Format the value as currency
                            const formatter = new Intl.NumberFormat(undefined, {
                                style: 'currency',
                                currency: currency,
                                maximumFractionDigits: 0
                            });
                            
                            return formatter.format(value);
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const value = context.raw || 0;
                            const index = context.dataIndex;
                            const currency = history[index].currency;
                            
                            // Format the value as currency
                            const formatter = new Intl.NumberFormat(undefined, {
                                style: 'currency',
                                currency: currency
                            });
                            
                            return `Zakat Due: ${formatter.format(value)}`;
                        },
                        title: function(context) {
                            const index = context[0].dataIndex;
                            const date = new Date(history[index].date);
                            return date.toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            });
                        },
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            const item = history[index];
                            const currency = item.currency;
                            
                            // Format values as currency
                            const formatter = new Intl.NumberFormat(undefined, {
                                style: 'currency',
                                currency: currency
                            });
                            
                            return [
                                `Total Assets: ${formatter.format(item.totalAssets)}`,
                                `Total Liabilities: ${formatter.format(item.totalLiabilities)}`,
                                `Net Assets: ${formatter.format(item.netAssets)}`
                            ];
                        }
                    }
                }
            }
        };
        
        // Create chart
        canvas._chart = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: options
        });
    },
    
    /**
     * Get financial data from the results section
     * @returns {Object} - Financial data object
     */
    getDataFromResults() {
        // Get values from results section
        const totalAssetsEl = document.getElementById('total-assets');
        const totalLiabilitiesEl = document.getElementById('total-liabilities');
        const netAssetsEl = document.getElementById('net-assets');
        const zakatDueEl = document.getElementById('zakat-due');
        
        // Parse currency values
        const parseCurrencyValue = (element) => {
            if (!element) return 0;
            const text = element.textContent;
            // Remove currency symbol and commas, then parse as float
            return parseFloat(text.replace(/[^\d.-]/g, '')) || 0;
        };
        
        return {
            totalAssets: parseCurrencyValue(totalAssetsEl),
            totalLiabilities: parseCurrencyValue(totalLiabilitiesEl),
            netAssets: parseCurrencyValue(netAssetsEl),
            zakatDue: parseCurrencyValue(zakatDueEl)
        };
    },
    
    /**
     * Update the visualization with new data
     * @param {Object} data - Financial data for visualization
     */
    update(data) {
        // Get active chart type
        const activeTab = document.querySelector('.chart-tab.active');
        if (!activeTab) return;
        
        const chartType = activeTab.dataset.chart;
        if (chartType === 'breakdown') {
            this.renderBreakdownChart(data);
        } else if (chartType === 'history') {
            this.renderHistoryChart();
        }
    }
};

// Initialize visualization when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if Chart.js is loaded
    if (typeof Chart === 'undefined') {
        // Load Chart.js dynamically
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js';
        script.onload = function() {
            // Initialize visualization after Chart.js is loaded
            Visualization.init();
        };
        document.head.appendChild(script);
    } else {
        // Chart.js already loaded, initialize visualization
        Visualization.init();
    }
});

// Export the Visualization module
window.ZakatVisualization = Visualization;