/**
 * API Integration Module for Zakat Calculator
 * Handles real-time data fetching for currency rates and precious metal prices
 */

const API = {
    // API configuration
    config: {
        // Metal price API settings
        metalPriceAPI: {
            baseURL: 'https://api.metalpriceapi.com/v1/latest',
            apiKey: null, // To be set by user
            fallbackValues: {
                gold: 4400, // USD value for ~85 grams of gold
                silver: 560  // USD value for ~595 grams of silver
            }
        },
        // Currency conversion API settings
        currencyAPI: {
            baseURL: 'https://api.exchangerate-api.com/v4/latest/USD',
            apiKey: null, // To be set by user
            fallbackRates: {
                USD: 1,
                EUR: 0.85,
                GBP: 0.75,
                SAR: 3.75,
                MYR: 4.16,
                INR: 74.5,
                AED: 3.67,
                CAD: 1.25,
                AUD: 1.35,
                SGD: 1.35,
                PKR: 175.5,
                BDT: 85.8,
                IDR: 14300,
                EGP: 15.7
            }
        },
        // Cache settings
        cache: {
            enabled: true,
            duration: 3600000 // 1 hour in milliseconds
        }
    },
    
    // Cache storage
    cache: {
        metalPrices: {
            data: null,
            timestamp: null
        },
        currencyRates: {
            data: null,
            timestamp: null
        }
    },
    
    /**
     * Initialize the API module
     * @param {Object} options - Configuration options
     */
    init(options = {}) {
        // Merge provided options with default config
        if (options.metalPriceAPIKey) {
            this.config.metalPriceAPI.apiKey = options.metalPriceAPIKey;
        }
        
        if (options.currencyAPIKey) {
            this.config.currencyAPI.apiKey = options.currencyAPIKey;
        }
        
        if (options.cacheEnabled !== undefined) {
            this.config.cache.enabled = options.cacheEnabled;
        }
        
        if (options.cacheDuration) {
            this.config.cache.duration = options.cacheDuration;
        }
        
        console.log('API module initialized');
    },
    
    /**
     * Check if cached data is valid
     * @param {Object} cacheItem - The cache item to check
     * @returns {Boolean} - Whether the cache is valid
     */
    isCacheValid(cacheItem) {
        if (!this.config.cache.enabled || !cacheItem.data || !cacheItem.timestamp) {
            return false;
        }
        
        const now = Date.now();
        return (now - cacheItem.timestamp) < this.config.cache.duration;
    },
    
    /**
     * Fetch current metal prices (gold and silver)
     * @returns {Promise<Object>} - Object containing gold and silver prices
     */
    async fetchMetalPrices() {
        // Check cache first
        if (this.isCacheValid(this.cache.metalPrices)) {
            console.log('Using cached metal prices');
            return this.cache.metalPrices.data;
        }
        
        try {
            // Only attempt API call if API key is provided
            if (this.config.metalPriceAPI.apiKey) {
                const url = `${this.config.metalPriceAPI.baseURL}?base=USD&currencies=XAU,XAG&api_key=${this.config.metalPriceAPI.apiKey}`;
                const response = await fetch(url);
                const data = await response.json();
                
                if (!data || !data.rates) {
                    throw new Error('API data not available');
                }
                
                // Calculate nisab values
                // Gold nisab: 85 grams of gold (approx)
                // Silver nisab: 595 grams of silver (approx)
                const goldPricePerGram = 1 / data.rates.XAU * 31.1; // Convert troy oz to gram
                const silverPricePerGram = 1 / data.rates.XAG * 31.1; // Convert troy oz to gram
                
                const result = {
                    gold: goldPricePerGram * 85,
                    silver: silverPricePerGram * 595,
                    timestamp: new Date().toISOString(),
                    source: 'api'
                };
                
                // Update cache
                this.cache.metalPrices = {
                    data: result,
                    timestamp: Date.now()
                };
                
                return result;
            } else {
                throw new Error('No API key provided');
            }
        } catch (error) {
            console.warn('Using fallback metal prices due to:', error.message);
            
            // Use fallback values
            const fallback = {
                ...this.config.metalPriceAPI.fallbackValues,
                timestamp: new Date().toISOString(),
                source: 'fallback'
            };
            
            // Update cache with fallback values
            this.cache.metalPrices = {
                data: fallback,
                timestamp: Date.now()
            };
            
            return fallback;
        }
    },
    
    /**
     * Fetch current currency exchange rates
     * @returns {Promise<Object>} - Object containing currency exchange rates
     */
    async fetchCurrencyRates() {
        // Check cache first
        if (this.isCacheValid(this.cache.currencyRates)) {
            console.log('Using cached currency rates');
            return this.cache.currencyRates.data;
        }
        
        try {
            const url = this.config.currencyAPI.baseURL;
            const response = await fetch(url);
            const data = await response.json();
            
            if (!data || !data.rates) {
                throw new Error('Currency API data not available');
            }
            
            const result = {
                rates: data.rates,
                timestamp: new Date().toISOString(),
                source: 'api'
            };
            
            // Update cache
            this.cache.currencyRates = {
                data: result,
                timestamp: Date.now()
            };
            
            return result;
        } catch (error) {
            console.warn('Using fallback currency rates due to:', error.message);
            
            // Use fallback values
            const fallback = {
                rates: this.config.currencyAPI.fallbackRates,
                timestamp: new Date().toISOString(),
                source: 'fallback'
            };
            
            // Update cache with fallback values
            this.cache.currencyRates = {
                data: fallback,
                timestamp: Date.now()
            };
            
            return fallback;
        }
    },
    
    /**
     * Get nisab values based on current metal prices
     * @returns {Promise<Object>} - Object containing nisab values for gold and silver standards
     */
    async getNisabValues() {
        const metalPrices = await this.fetchMetalPrices();
        return {
            gold: metalPrices.gold,
            silver: metalPrices.silver,
            timestamp: metalPrices.timestamp,
            source: metalPrices.source
        };
    },
    
    /**
     * Convert amount from one currency to another
     * @param {Number} amount - The amount to convert
     * @param {String} fromCurrency - Source currency code
     * @param {String} toCurrency - Target currency code
     * @returns {Promise<Number>} - Converted amount
     */
    async convertCurrency(amount, fromCurrency, toCurrency) {
        if (fromCurrency === toCurrency) {
            return amount;
        }
        
        const currencyData = await this.fetchCurrencyRates();
        const rates = currencyData.rates;
        
        // Convert to USD first (if not already USD)
        let amountInUSD = fromCurrency === 'USD' ? 
            amount : 
            amount / rates[fromCurrency];
        
        // Convert from USD to target currency
        return amountInUSD * rates[toCurrency];
    },
    
    /**
     * Get the latest status of API services
     * @returns {Object} - Status information for the APIs
     */
    getStatus() {
        return {
            metalPriceAPI: {
                hasKey: !!this.config.metalPriceAPI.apiKey,
                cacheValid: this.isCacheValid(this.cache.metalPrices),
                lastUpdated: this.cache.metalPrices.timestamp
            },
            currencyAPI: {
                hasKey: !!this.config.currencyAPI.apiKey,
                cacheValid: this.isCacheValid(this.cache.currencyRates),
                lastUpdated: this.cache.currencyRates.timestamp
            }
        };
    }
};

// Export the API module
window.ZakatAPI = API;