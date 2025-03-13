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
    
    // Calculate button functionality
    document.getElementById('calculate-zakat').addEventListener('click', calculateZakat);
    
    function calculateZakat() {
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
        
        // Get nisab method and calculate zakat
        const nisabMethod = document.getElementById('nisab-method').value;
        const currency = document.getElementById('currency').value;
        
        // Sample nisab values (should be updated with real-time values)
        const nisabValues = {
            'gold': 4400, // USD value for ~85 grams of gold
            'silver': 560  // USD value for ~595 grams of silver
        };
        
        let zakatDue = 0;
        // Apply calculation mode
        const zakatRate = calculationMode === 'monthly' ? 0.025 / 12 : 0.025; // 0.025 is 2.5%
        
        if (netAssets >= nisabValues[nisabMethod]) {
            zakatDue = netAssets * zakatRate; // Monthly or yearly rate
        }
        
        // Update results
        const currencyFormatter = new Intl.NumberFormat(undefined, {
            style: 'currency',
            currency: currency
        });
        
        document.getElementById('total-assets').textContent = currencyFormatter.format(totalAssets);
        document.getElementById('total-liabilities').textContent = currencyFormatter.format(totalLiabilities);
        document.getElementById('net-assets').textContent = currencyFormatter.format(netAssets);
        document.getElementById('zakat-due').textContent = currencyFormatter.format(zakatDue);
        
        // Animate the results
        const resultCards = document.querySelectorAll('.result-card');
        resultCards.forEach(card => {
            card.classList.add('animate');
            setTimeout(() => {
                card.classList.remove('animate');
            }, 1000);
        });
    }
});
