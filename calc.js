"use strict";

const catalog = {
    pipe: {
        title: "Средство для очистки труб",
        price: 695
    },
    mop: {
        title: "Швабра",
        price: 399,
        options: {
            label: "Тип насадки",
            items: [
                {id: "classic", title: "Классическая", price: 0},
                {id: "flat", title: "Плоская с отжимом", price: 250},
                {id: "steam", title: "Паровая", price: 900}
            ]
        }
    },
    bucket: {
        title: "Ведро",
        price: 83,
        property: {
            label: "С крышкой",
            price: 45
        }
    }
};

function formatRub(value) {
    return value.toLocaleString("ru-RU") + "\u00A0₽";
}

function getItem() {
    const checked = document.querySelector("input[name=\"prodType\"]:checked");
    return catalog[checked.value];
}

function renderExtras() {
    const item = getItem();
    const optionsBlock = document.getElementById("options-block");
    const propertyBlock = document.getElementById("property-block");
    const select = document.getElementById("option");
    const checkbox = document.getElementById("property");

    optionsBlock.hidden = !item.options;
    propertyBlock.hidden = !item.property;
    select.textContent = "";
    checkbox.checked = false;

    if (item.options) {
        document.getElementById("option-label").textContent = item.options.label;
        item.options.items.forEach(function (option) {
            const element = document.createElement("option");
            element.value = option.id;
            element.textContent = option.title;
            if (option.price > 0) {
                element.textContent += " (+" + formatRub(option.price) + ")";
            }
            select.appendChild(element);
        });
    }

    if (item.property) {
        document.getElementById("property-label").textContent =
                item.property.label + " (+" + formatRub(item.property.price) + ")";
    }
}

function calculate() {
    const quantityField = document.getElementById("quantity");
    const errorBox = document.getElementById("error");
    const result = document.getElementById("result");
    const quantityText = quantityField.value.trim();

    const pattern = /^[1-9]\d*$/;

    function fail(message) {
        errorBox.textContent = message;
        quantityField.classList.add("invalid");
        result.textContent = "";
    }

    errorBox.textContent = "";
    quantityField.classList.remove("invalid");

    if (quantityText === "") {
        fail("Введите количество товара.");
        return;
    }

    if (!pattern.test(quantityText)) {
        fail("Введите количество товара целым положительным числом (только цифры, без пробелов и знаков).");
        return;
    }

    const quantity = parseInt(quantityText, 10);

    if (quantity > 1000000) {
        fail("Максимальное количество — 1 000 000 шт.");
        return;
    }

    const item = getItem();
    const details = [item.title];
    let price = item.price;

    if (item.options) {
        const select = document.getElementById("option");
        const selected = item.options.items.find(function (option) {
            return option.id === select.value;
        });
        price += selected.price;
        details.push(selected.title);
    }

    if (item.property && document.getElementById("property").checked) {
        price += item.property.price;
        details.push(item.property.label.toLowerCase());
    }

    details.push(quantity + "\u00A0шт.");
    result.textContent = "Стоимость заказа (" + details.join(", ") + "): " +
            formatRub(price * quantity);
}

function init() {
    const form = document.getElementById("calc-form");

    document.getElementById("quantity").addEventListener("input", calculate);

    form.addEventListener("change", function (event) {
        if (event.target.name === "prodType") {
            renderExtras();
        }
        calculate();
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault();
    });

    renderExtras();
    calculate();
}

document.addEventListener("DOMContentLoaded", init);
