const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Fill dropdowns
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "from" && currCode === "USD") newOption.selected = true;
        if (select.name === "to" && currCode === "INR") newOption.selected = true;
        select.append(newOption);
    }
    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

// Update flags
const updateFlag = (element) => {
    let countryCode = countryList[element.value];
    let img = element.parentElement.querySelector("img");
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Convert currency
btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    
    let amount = document.querySelector(".amount input");
    let amtval = amount.value || 1;
    if (amtval < 1) amtval = 1;
    amount.value = amtval;

    msg.innerText = "Converting...";

    try {
        // Try API first
        const URL = `https://api.exchangerate.host/convert?from=${fromCurr.value}&to=${toCurr.value}&amount=${amtval}`;
        let response = await fetch(URL);
        let data = await response.json();
        
        if (data.success) {
            let finalAmount = data.result.toFixed(2);
            msg.innerText = `${amtval} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
        } else {
            throw new Error("API failed");
        }
        
    } catch (error) {
        // Fallback to static rates
        calculateWithStaticRates(amtval);
    }
});

// Static rates fallback (USD based)
function calculateWithStaticRates(amtval) {
    const ratesToUSD = {
        "USD": 1, "EUR": 0.93, "GBP": 0.80, "INR": 83.5, "JPY": 150, "CAD": 1.35,
        "AUD": 1.55, "CHF": 0.88, "CNY": 7.25, "TJS": 10.9, "HUF": 360, "HTG": 132,
        "TTD": 6.8, "AED": 3.67, "AFN": 71.5, "ALL": 95, "AMD": 402, "ANG": 1.79,
        "AOA": 850, "ARS": 815, "AZN": 1.7, "BAM": 1.83, "BBD": 2, "BDT": 110,
        "BGN": 1.83, "BHD": 0.38, "BIF": 2850, "BMD": 1, "BND": 1.35, "BOB": 6.9,
        "BRL": 4.95, "BSD": 1, "BWP": 13.6, "BYN": 3.25, "BZD": 2, "CDF": 2700,
        "CLP": 920, "COP": 3900, "CRC": 525, "CUP": 24, "CVE": 104, "CZK": 23.5,
        "DJF": 178, "DKK": 6.95, "DOP": 58.5, "DZD": 134, "EGP": 30.9, "ETB": 56.5,
        "FJD": 2.25, "FKP": 0.80, "GEL": 2.7, "GGP": 0.80, "GHS": 12.5, "GIP": 0.80,
        "GMD": 65, "GNF": 8600, "GTQ": 7.8, "GYD": 209, "HNL": 24.7, "HRK": 7.0,
        "IDR": 15600, "ILS": 3.7, "IQD": 1310, "IRR": 42000, "ISK": 138, "JMD": 155,
        "JOD": 0.71, "KES": 160, "KGS": 89, "KHR": 4100, "KMF": 458, "KPW": 900,
        "KRW": 1330, "KWD": 0.31, "KYD": 0.83, "KZT": 470, "LAK": 21000, "LBP": 15000,
        "LKR": 325, "LRD": 190, "LSL": 18.9, "LYD": 4.85, "MAD": 10.1, "MDL": 18.0,
        "MGA": 4500, "MKD": 57.5, "MMK": 2100, "MNT": 3400, "MOP": 8.1, "MRU": 40,
        "MUR": 46, "MVR": 15.4, "MWK": 1700, "MXN": 17.0, "MYR": 4.75, "MZN": 64,
        "NAD": 18.9, "NIO": 36.7, "NPR": 133, "NZD": 1.67, "OMR": 0.38, "PAB": 1,
        "PEN": 3.8, "PGK": 3.8, "PHP": 56.5, "PKR": 280, "PLN": 4.0, "PYG": 7300,
        "QAR": 3.64, "RON": 4.6, "RSD": 109, "RUB": 92, "RWF": 1300, "SAR": 3.75,
        "SBD": 8.5, "SCR": 13.5, "SDG": 600, "SEK": 10.5, "SGD": 1.35, "SLL": 22000,
        "SOS": 571, "SRD": 35, "SYP": 13000, "SZL": 18.9, "THB": 36, "TMT": 3.5,
        "TND": 3.1, "TOP": 2.35, "TRY": 32, "TWD": 31.5, "TZS": 2500, "UAH": 39,
        "UGX": 3800, "UYU": 39, "UZS": 12500, "VEF": 3500000, "VND": 24500, "VUV": 120,
        "WST": 2.7, "XAF": 610, "XCD": 2.7, "XOF": 610, "XPF": 110, "YER": 250,
        "ZAR": 18.9, "ZMW": 25, "ZWL": 320
    };

    let fromRate = ratesToUSD[fromCurr.value] || 1;
    let toRate = ratesToUSD[toCurr.value] || 1;
    
    // Convert via USD: (amount / fromRate) * toRate
    let finalAmount = ((amtval / fromRate) * toRate).toFixed(2);
    msg.innerText = `${amtval} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
}

// Initialize
updateFlag(fromCurr);
updateFlag(toCurr);