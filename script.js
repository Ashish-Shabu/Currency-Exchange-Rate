const BASE_URL = "https://v6.exchangerate-api.com/v6/241bc57c96536946ebaaf84b/latest/";

const dropDown = document.querySelectorAll(".dropdown select");
const convertButton = document.querySelector("#convertBtn")
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


for (let select of dropDown) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        select.append(newOption);
        if(select.name === "from" && currCode === "USD") {
            newOption.selected = "selected"
        } else if (select.name === "to" && currCode === "INR") {
            newOption.selected = "selected"
        }
    }

    select.addEventListener("change",(evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    let currCode = element.value;
    let countryCode = countryList[currCode];
    let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`
    let img = element.parentElement.querySelector("img");
    img.src = newSrc;
}


const updateExchangeRate =async () => {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal <= 0) {
        amtVal = 1;
        amount.value = "1";
    }

    const URL = `${BASE_URL}${fromCurr.value}`;
    try {
        let response = await fetch(URL);
        let data = await response.json();

        if (data.result !== "success") {
            msg.innerText = "Failed to fetch exchange rate.";
            return;
        }

        let rate = data.conversion_rates[toCurr.value];
        let finalAmount = (amtVal * rate).toFixed(2);

        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Error fetching data.";
        console.error(error);
    }
}

convertButton.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});