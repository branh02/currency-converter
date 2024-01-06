const originalCur = document.querySelector(".original select");
const newCur = document.querySelector(".new select");
const enterBttn = document.querySelector("form button");
const swapBttn = document.querySelector("form .reverse");
const amount = document.querySelector("form input");
const exRateTxt = document.querySelector("form .result");

[originalCur, newCur].forEach((choose, i) => {
    for (let currency_code in countryList) {
        const chosen = ((i === 0 && currency_code === "GBP") || (i === 1 && currency_code === "USD")) ? "selected" : "";
        choose.insertAdjacentHTML("beforeend", `<option value="${currency_code}" ${chosen}>${currency_code}</option>`);    }
    choose.addEventListener("change", () => {
        const code = choose.value;
        const img = choose.parentElement.querySelector("img");
        img.src = `https://flagcdn.com/48x36/${countryList[code].toLowerCase()}.png`
    })
})

async function getExRate() {
    const amVal = amount.value || 1;
    exRateTxt.innerText = "Retrieving rate..."
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/fcd55c7325a69c1cf3d13a5c/latest/${originalCur.value}`)
        const result = await res.json()
        const exRate = result.conversion_rates[newCur.value]
        const totalExRate = (amVal * exRate).toFixed(2);
        exRateTxt.innerText = `${amVal} ${originalCur.value} = ${totalExRate} ${newCur.value}`;
    } catch (err) {
        exRateTxt.innerText = `ERROR ${err}`
    }
}

window.addEventListener("load", getExRate);
enterBttn.addEventListener("click", (e) => {
    e.preventDefault();
    getExRate();
});

swapBttn.addEventListener("click", () => {
    [originalCur.value, newCur.value] = [newCur.value, originalCur.value];
    [originalCur, newCur].forEach((select) => {
        const code = select.value;
        const img = select.parentElement.querySelector("img");
        img.src = `https://flagcdn.com/48x36/${countryList[code].toLowerCase()}.png`;
    });
    getExchangeRate();
})

function updateConversion() {
    if (amount.value && !isNaN(amount.value)) {
        getExRate();
    } else {
        exRateTxt.innerText = "Please enter a valid amount";
    }
}

amount.addEventListener('input', updateConversion);
originalCur.addEventListener('change', updateConversion);
newCur.addEventListener('change', updateConversion);