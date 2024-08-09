const tickers = [
    'AAPL', 'ABBV', 'BA', 'BABA', 'BAC', 'BAX', 'BBY', 'BDX', 'BIDU', 'BIIB',
    'BMY', 'BP', 'BRK.A', 'BRK.B', 'BSX', 'C', 'CL', 'DIS', 'EA', 'F', 'GM',
    'GS', 'HD', 'IBM', 'JNJ', 'KO', 'LMT', 'LOW', 'META', 'MSFT', 'NFLX', 'NKE',
    'NOK', 'NVDA', 'ORCL', 'OXY', 'PFE', 'PG', 'PYPL', 'QCOM', 'RBLX', 'REGN',
    'SBUX', 'SHOP', 'SQ', 'T', 'TSLA', 'U', 'UNH', 'V', 'VZ', 'WMT', 'XOM', 'ZM'
];

let count = 0;
const columnWidth = 200; // Adjust according to your needs
const startTime = Date.now();
const randchars = ['*','%','$','&','@','!','^','~','+','?','/','|','<','>'];

function drawScreen() {
    const container = document.getElementById('ticker-container');
    container.innerHTML = '';
    tickers.forEach(ticker => {
        const item = document.createElement('div');
        item.className = 'ticker-item';
        item.dataset.ticker = ticker;
        item.textContent = `${ticker} - `;
        container.appendChild(item);
    });
}

async function grab() {
    for (const singleticker of tickers) {
        try {
            const response = await fetch(`https://generic709.herokuapp.com/stockc/${singleticker}`);
            const quote = await response.json();
            if (!quote || !quote.price) continue;

            const item = Array.from(document.querySelectorAll('.ticker-item'))
                .find(el => el.dataset.ticker === singleticker);
            
            if (item) {
                const price = quote.price.toFixed(2);
                const char = randchars[Math.floor(Math.random() * randchars.length)];
                item.textContent = `${singleticker} - ${price}${char}`;
            }

            count++;
            if (count % 250 === 0 && count > 1) {
                const endTime = Date.now();
                const elapsedTime = (endTime - startTime) / 1000;
                const seconds = Math.floor(elapsedTime % 60);
                const minutes = Math.floor(elapsedTime / 60);
                const rate = Math.floor(count / elapsedTime);

                document.getElementById('status').innerHTML = `
                    Data Received: ${count} <br>
                    Time Elapsed: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} <br>
                    Rate: ${rate}x
                `;
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
}

drawScreen();
setInterval(grab, 500);
