document.addEventListener('DOMContentLoaded', function() {
    // Translations
    const translations = {
        en: {
            title: "Zakat",
            calculator: "Calculator",
            tagline: "Calculate your monthly Zakat obligation with precision and ease",
            currency: "Currency:",
            nisabMethod: "Nisab Calculation Method:",
            goldStandard: "Gold Standard",
            silverStandard: "Silver Standard",
            calculationDate: "Calculation Date:",
            assets: "Assets",
            addAsset: "Add Asset",
            cash: "Cash on Hand and Bank Deposits:",
            goldSilver: "Gold and Silver (Market Value):",
            stocks: "Stocks and Investments:",
            property: "Property and Real Estate:",
            liabilities: "Liabilities",
            addLiability: "Add Liability",
            debts: "Debts and Loans:",
            expenses: "Expenses:",
            calculateZakat: "Calculate Zakat",
            results: "Results",
            totalAssets: "Total Assets",
            totalLiabilities: "Total Liabilities",
            netAssets: "Net Assets",
            zakatDue: "Zakat Due",
            learnMore: "Learn more about",
            zakatImportance: "Zakat and its importance",
            inIslam: "in Islam.",
            customAsset: "Custom Asset:",
            customLiability: "Custom Liability:",
            calcMode: "Calculation Mode:",
            monthly: "Monthly",
            yearly: "Yearly",
            monthlyIndicator: "Monthly Calculation",
            yearlyIndicator: "Annual Calculation",
            monthlyExplanation: "This calculator shows your monthly Zakat amount (approximately 0.208% of eligible assets). Traditional Zakat is 2.5% annually, but monthly payment can help with budgeting."
        },
        ar: {
            title: "زكاة",
            calculator: "آلة حاسبة",
            tagline: "احسب زكاتك الشهرية بدقة وسهولة",
            currency: "العملة:",
            nisabMethod: "طريقة حساب النصاب:",
            goldStandard: "معيار الذهب",
            silverStandard: "معيار الفضة",
            calculationDate: "تاريخ الحساب:",
            assets: "الأصول",
            addAsset: "إضافة أصل",
            cash: "النقد في اليد والودائع البنكية:",
            goldSilver: "الذهب والفضة (القيمة السوقية):",
            stocks: "الأسهم والاستثمارات:",
            property: "الممتلكات والعقارات:",
            liabilities: "الخصوم",
            addLiability: "إضافة خصم",
            debts: "الديون والقروض:",
            expenses: "المصاريف:",
            calculateZakat: "احسب الزكاة",
            results: "النتائج",
            totalAssets: "إجمالي الأصول",
            totalLiabilities: "إجمالي الخصوم",
            netAssets: "صافي الأصول",
            zakatDue: "الزكاة المستحقة",
            learnMore: "تعلم المزيد عن",
            zakatImportance: "الزكاة وأهميتها",
            inIslam: "في الإسلام.",
            customAsset: "أصل مخصص:",
            customLiability: "خصم مخصص:",
            calcMode: "وضع الحساب:",
            monthly: "شهري",
            yearly: "سنوي",
            monthlyIndicator: "حساب شهري",
            yearlyIndicator: "حساب سنوي",
            monthlyExplanation: "تعرض هذه الآلة الحاسبة مبلغ الزكاة الشهرية (حوالي 0.208٪ من الأصول المؤهلة). الزكاة التقليدية هي 2.5٪ سنويًا، لكن الدفع الشهري يمكن أن يساعد في إدارة الميزانية."
        }
    };
    
    // Theme toggle functionality
    const themeSwitch = document.getElementById('theme-switch');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeSwitch.checked = true;
    }
    
    // Theme switcher event listener
    themeSwitch.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Set current date as default calculation date
    const today = new Date();
    const formattedDate = today.toISOString().substr(0, 10);
    document.getElementById('calculation-date').value = formattedDate;
    
    // Calculation Mode Toggle
    const modeButtons = document.querySelectorAll('.mode-btn');
    let calculationMode = localStorage.getItem('calculationMode') || 'monthly';
    
    // Set the initial state of calculation mode
    updateCalculationModeUI(calculationMode);
    
    modeButtons.forEach(btn => {
        if (btn.dataset.mode === calculationMode) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            calculationMode = mode;
            
            // Update active button
            modeButtons.forEach(button => {
                button.classList.remove('active');
            });
            this.classList.add('active');
            
            // Save mode preference
            localStorage.setItem('calculationMode', mode);
            
            // Update UI
            updateCalculationModeUI(mode);
        });
    });
    
    function updateCalculationModeUI(mode) {
        // Update mode indicator text
        const modeIndicator = document.querySelector('.mode-indicator span');
        const lang = localStorage.getItem('language') || 'en';
        
        if (modeIndicator) {
            modeIndicator.textContent = translations[lang][mode === 'monthly' ? 'monthlyIndicator' : 'yearlyIndicator'];
        }
        
        // Update explanation text
        const explanationText = document.querySelector('.zakat-explanation p');
        if (explanationText && mode === 'yearly') {
            explanationText.textContent = 'This is the traditional annual Zakat calculation (2.5% of eligible assets above nisab).';
        } else if (explanationText) {
            explanationText.textContent = translations[lang].monthlyExplanation;
        }
    }
    
    // Add asset button functionality
    document.querySelector('.add-asset').addEventListener('click', function() {
        const assetItems = document.querySelector('.asset-items');
        const newAsset = document.createElement('div');
        newAsset.className = 'asset-item';
        newAsset.innerHTML = `
            <div class="form-group">
                <label for="custom-asset-${Date.now()}">Custom Asset:</label>
                <input type="number" id="custom-asset-${Date.now()}" placeholder="0.00" min="0" step="0.01">
                <button class="remove-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        assetItems.appendChild(newAsset);
        
        // Add remove functionality to the new asset
        newAsset.querySelector('.remove-btn').addEventListener('click', function() {
            assetItems.removeChild(newAsset);
        });
    });
    
    // Add liability button functionality
    document.querySelector('.add-liability').addEventListener('click', function() {
        const liabilityItems = document.querySelector('.liability-items');
        const newLiability = document.createElement('div');
        newLiability.className = 'liability-item';
        newLiability.innerHTML = `
            <div class="form-group">
                <label for="custom-liability-${Date.now()}">Custom Liability:</label>
                <input type="number" id="custom-liability-${Date.now()}" placeholder="0.00" min="0" step="0.01">
                <button class="remove-btn"><i class="fas fa-times"></i></button>
            </div>
        `;
        liabilityItems.appendChild(newLiability);
        
        // Add remove functionality to the new liability
        newLiability.querySelector('.remove-btn').addEventListener('click', function() {
            liabilityItems.removeChild(newLiability);
        });
    });
    
    // Initialize the API module
    window.ZakatAPI.init({
        // You can provide API keys here if available
        // metalPriceAPIKey: 'YOUR_METAL_PRICE_API_KEY',
        // currencyAPIKey: 'YOUR_CURRENCY_API_KEY',
        cacheEnabled: true,
        cacheDuration: 3600000 // 1 hour
    });
    
    // Fetch real-time Nisab values using the API module
    async function fetchNisabValues() {
        try {
            const nisabValues = await window.ZakatAPI.getNisabValues();
            console.log('Nisab values:', nisabValues);
            return nisabValues;
        } catch (error) {
            console.error('Error fetching nisab values:', error);
            return {
                gold: 4400, // USD value for ~85 grams of gold
                silver: 560  // USD value for ~595 grams of silver
            };
        }
    }
    
    // Get currency rates using the API module
    async function getCurrencyRates() {
        try {
            const currencyData = await window.ZakatAPI.fetchCurrencyRates();
            return currencyData.rates;
        } catch (error) {
            console.error('Error fetching currency rates:', error);
            // Fallback currency rates
            return {
                USD: 1,
                EUR: 0.85,
                GBP: 0.75,
                SAR: 3.75,
                MYR: 4.16,
                INR: 74.5,
                AED: 3.67,
                CAD: 1.25,
                AUD: 1.35,
                SGD: 1.35
            };
        }
    }
    
    // Initialize currency rates
    let currencyRates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.75,
        SAR: 3.75,
        MYR: 4.16,
        INR: 74.5
    };
    
    // Update currency rates on page load
    (async function() {
        try {
            currencyRates = await getCurrencyRates();
            console.log('Currency rates updated:', currencyRates);
        } catch (error) {
            console.warn('Using fallback currency rates');
        }
    })();
    
    // Calculate button functionality
    document.getElementById('calculate-zakat').addEventListener('click', calculateZakat);
    
    async function calculateZakat() {
        // Show loading indicator
        const calculateBtn = document.getElementById('calculate-zakat');
        const lang = localStorage.getItem('language') || 'en';
        calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + translations[lang].calculateZakat;
        calculateBtn.disabled = true;
        
        // Add loading class to results section
        const resultsSection = document.querySelector('.results-section');
        resultsSection.classList.add('loading');
        
        try {
            // Get all asset values
            let totalAssets = 0;
            const assetInputs = document.querySelectorAll('.asset-items input[type="number"]');
            assetInputs.forEach(input => {
                const value = parseFloat(input.value) || 0;
                totalAssets += value;
            });
            
            // Get all liability values
            let totalLiabilities = 0;
            const liabilityInputs = document.querySelectorAll('.liability-items input[type="number"]');
            liabilityInputs.forEach(input => {
                const value = parseFloat(input.value) || 0;
                totalLiabilities += value;
            });
            
            // Calculate net assets
            const netAssets = totalAssets - totalLiabilities;
            
            // Get nisab method and currency
            const nisabMethod = document.getElementById('nisab-method').value;
            const currency = document.getElementById('currency').value;
            
            // Get real-time currency rates if needed
            if (!currencyRates[currency]) {
                console.log('Fetching updated currency rates...');
                currencyRates = await getCurrencyRates();
            }
            
            // Get real-time or fallback nisab values
            const nisabValues = await fetchNisabValues();
            
            // Convert nisab value to selected currency
            const nisabInSelectedCurrency = nisabValues[nisabMethod] * (1 / currencyRates[currency]);
            
            let zakatDue = 0;
            // Apply calculation mode
            const zakatRate = calculationMode === 'monthly' ? 0.025 / 12 : 0.025; // 0.025 is 2.5%
            
            // Only calculate Zakat if net assets are above nisab threshold
            if (netAssets >= nisabInSelectedCurrency) {
                zakatDue = netAssets * zakatRate; // Monthly or yearly rate
            }
            
            // Update results
            const currencyFormatter = new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currency
            });
            
            // Show nisab threshold in the UI
            const nisabThreshold = document.createElement('div');
            nisabThreshold.className = 'nisab-info';
            nisabThreshold.innerHTML = `
                <div class="info-icon"><i class="fas fa-info-circle"></i></div>
                <p>Nisab threshold (${nisabMethod === 'gold' ? 'Gold' : 'Silver'} standard): 
                   <strong>${currencyFormatter.format(nisabInSelectedCurrency)}</strong></p>
            `;
            
            // Update result values
            document.getElementById('total-assets').textContent = currencyFormatter.format(totalAssets);
            document.getElementById('total-liabilities').textContent = currencyFormatter.format(totalLiabilities);
            document.getElementById('net-assets').textContent = currencyFormatter.format(netAssets);
            document.getElementById('zakat-due').textContent = currencyFormatter.format(zakatDue);
            
            // Add nisab info after the results
            const explanationBox = document.querySelector('.zakat-explanation');
            if (explanationBox.previousElementSibling && explanationBox.previousElementSibling.classList.contains('nisab-info')) {
                explanationBox.parentNode.removeChild(explanationBox.previousElementSibling);
            }
            explanationBox.parentNode.insertBefore(nisabThreshold, explanationBox);
            
            // Add animation to results section
            resultsSection.style.display = 'block';
            resultsSection.classList.remove('loading');
            
            // Animate the results
            const resultCards = document.querySelectorAll('.result-card');
            resultCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate');
                }, index * 150);
            });
            
            // Update visualization if available
            if (window.ZakatVisualization) {
                // Pass the financial data to the visualization module
                window.ZakatVisualization.update({
                    totalAssets,
                    totalLiabilities,
                    netAssets,
                    zakatDue
                });
            }
            
            // Save calculation to localStorage for history
            saveCalculationHistory({
                date: new Date().toISOString(),
                currency,
                nisabMethod,
                totalAssets,
                totalLiabilities,
                netAssets,
                zakatDue,
                calculationMode
            });
            
        } catch (error) {
            console.error('Error calculating zakat:', error);
            resultsSection.classList.remove('loading');
            
            // Show error message in a more user-friendly way
            const errorBox = document.createElement('div');
            errorBox.className = 'error-message';
            errorBox.innerHTML = `
                <div class="error-icon"><i class="fas fa-exclamation-circle"></i></div>
                <p>There was an error calculating your Zakat. Please try again or check your inputs.</p>
            `;
            
            // Remove any existing error message
            const existingError = document.querySelector('.error-message');
            if (existingError) {
                existingError.parentNode.removeChild(existingError);
            }
            
            // Add error message to the page
            const calculateBtnContainer = document.querySelector('.calculate-btn-container');
            calculateBtnContainer.parentNode.insertBefore(errorBox, calculateBtnContainer.nextSibling);
            
            // Auto-remove error after 5 seconds
            setTimeout(() => {
                if (errorBox.parentNode) {
                    errorBox.parentNode.removeChild(errorBox);
                }
            }, 5000);
        } finally {
            // Restore calculate button
            calculateBtn.innerHTML = translations[lang].calculateZakat;
            calculateBtn.disabled = false;
        }
    }
    
    // Function to save calculation history
    function saveCalculationHistory(calculation) {
        const history = JSON.parse(localStorage.getItem('zakatHistory') || '[]');
        history.unshift(calculation); // Add to beginning of array
        
        // Keep only the last 10 calculations
        if (history.length > 10) {
            history.pop();
        }
        
        localStorage.setItem('zakatHistory', JSON.stringify(history));
    }
    
    // Add additional event listener for Enter key press on input fields
    const inputFields = document.querySelectorAll('input[type="number"]');
    inputFields.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateZakat();
            }
        });
    });
    
    // Update currency rate on currency change
    document.getElementById('currency').addEventListener('change', function() {
        // You could fetch real-time currency rates here
        // For now, we're using the static rates defined above
    });
});
