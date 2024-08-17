# Crypto Portfolio Track

Crypto Portfolio Track is a web application that allows you to track your cryptocurrency portfolio's live profit and loss (PnL) without needing to connect a wallet. It provides real-time insights into your portfolio's performance and value.

## Features

- Live PnL tracking of your cryptocurrency portfolio
- No wallet connection required
- Easy-to-use interface

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/username/crypto-portfolio-track.git
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Obtin API key:**
   Sign up at [Coinlib][https://coinlib.io/] and obtain your API key.

4. **Configure Environment Variables:**
   Create a .env file in the root of your project and add your API key:
   
   ```code
   COINLIB_API_KEY=your_api_key_here
   ```
   (Optional: You can directly hardcode the API key into the code, but it's recommended to use environment variables.)

6. **Start the Application:**
   ```bash
   npm start
   ```