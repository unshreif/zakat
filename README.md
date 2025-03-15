# Modern Zakat Calculator

A beautiful, responsive, and feature-rich Zakat calculator web application to help Muslims calculate their obligatory charity (Zakat) accurately based on their financial assets.

## Features

- **Modern UI**: Clean, intuitive interface with both light and dark theme support
- **Calculation Modes**: Calculate Zakat on a monthly or yearly basis
- **Multiple Currency Support**: Calculate in USD, EUR, GBP, SAR, MYR, INR and more
- **Nisab Standards**: Choose between Gold and Silver standard for Nisab threshold
- **Dynamic Fields**: Add custom assets and liabilities as needed
- **Real-time Calculations**: Fast, client-side calculations with visual feedback
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Multilingual Support**: Interface available in English and Arabic (expandable to more languages)
- **Data Visualization**: Interactive charts for better financial insights

## How to Use

1. **Select Your Preferences**:
   - Choose your preferred currency
   - Select a Nisab calculation method (Gold or Silver standard)
   - Set the calculation date

2. **Enter Your Financial Data**:
   - Add values for your assets (cash, gold/silver, investments, property)
   - Enter your liabilities (debts, expenses)
   - Add custom assets or liabilities as needed

3. **Calculate Your Zakat**:
   - Click "Calculate Zakat" to see your results
   - View your total assets, liabilities, net assets, and Zakat due
   - Explore visual breakdowns of your financial data

## About Zakat

Zakat is one of the Five Pillars of Islam, requiring Muslims who meet the necessary criteria of wealth to donate 2.5% of their qualifying assets to those in need. It is typically calculated annually, but this calculator also provides a monthly option to help with financial planning.

The Nisab threshold (minimum amount for Zakat eligibility) can be calculated using either the Gold standard (approximately 85 grams of gold) or Silver standard (approximately 595 grams of silver).

## Technical Details

This application is built using:

- **Frontend**: HTML5, CSS3 with custom variables for theming
- **JavaScript**: Vanilla JavaScript with modern ES6+ features
- **Visualization**: Chart.js for interactive data visualization
- **API Integration**: Real-time currency conversion and precious metal prices
- **UI Components**: Font Awesome for icons, Google Fonts for typography
- **Localization**: Built-in translation system for multilingual support

No server-side processing is required as all calculations happen in the browser.

## Project Structure

- `index.html` - Main application structure and UI components
- `styles.css` - Styling with responsive design and theme support
- `script.js` - Core application logic and event handling
- `api.js` - API integration for currency and metal price data
- `visualization.js` - Chart generation and data visualization

## Installation

Simply download or clone the repository and open index.html in a web browser. No build process or server is required.

```bash
# Clone the repository
git clone https://github.com/yourusername/zakat-calculator.git

# Navigate to the project directory
cd zakat-calculator

# Open in your browser
# You can simply double-click index.html or use a local server
```

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to submit issues or pull requests to help improve this Zakat calculator.