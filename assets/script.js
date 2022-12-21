const addEvent = ({ element = null, type, func, elems }) => {
    if (element) {
        elems ? element.addEventListener(type, () => func(elems)) : element.addEventListener(type, func);
    }
}

const toggleActive = element => {
    element.classList.toggle('active');
}

const isChecked = (element, checked) => {
    if (!checked) {
        return element.getElementsByTagName('input')[0].setAttribute('checked', true);
    }

    element.getElementsByTagName('input')[0].removeAttribute('checked');
}

const toggleChecked = element => {
    const checked = element.getElementsByTagName('input')[0].checked;

    isChecked(element, checked);
}

let grids = 0;

const checkQtdGrids = (button, grids) => {
    button.classList.remove('hidden');

    return `Grades ( ${grids} )`;
}

const removeAddGridsButton = button => {
    button.classList.add('hidden');

    return "Selecione a grade";
}

const toggleCheckedGrids = elems => {
    const [ el, selectGrids, inputs ] = elems;

    const checked = el.getElementsByTagName('input')[0].checked;
    const option = el.getElementsByTagName('input')[0].dataset.grid;
    const closeGridsButton = document.querySelector('.close-grids');

    inputs.map(element => {
        if (element.dataset.grid === option) {
            element.classList.toggle('hidden');
        }
    });

    isChecked(el, checked);

    (!checked) ? grids++ : grids--;

    selectGrids.innerText = grids > 0 ? checkQtdGrids(closeGridsButton, grids) : removeAddGridsButton(closeGridsButton);
}

const staticSuggestions = (input, options) => {
    const filter = input.value.toUpperCase();

    for (i = 0; i < options.length; i++) {
        const label = options[i].getElementsByTagName('label')[0];
        const value = label.textContent || label.innerText;

        if (value.toUpperCase().indexOf(filter) > -1) {
            options[i].classList.remove('hidden');

            continue;
        }

        options[i].classList.add('hidden');
    }
}

const suggestionsClear = (input, options) => {
    input.value = "";

    options.forEach(element => element.classList.remove('hidden'));
}

const onTitleInput = elems => {
    const [ inputTitle, max ] = elems;

    const maxLength = inputTitle.getAttribute('maxlength');
    const currentLength = inputTitle.value.length;

    if (currentLength >= maxLength) {
        return max.innerHTML = 0;
    }

    max.innerHTML = `<p>` + `${maxLength - currentLength}` + `</p>`;
}

// Usuário
const userDocument = document.querySelector('input[name="document"]');
const phone = document.querySelector('input[name="phone"]');

// Título
const inputTitle = document.querySelector('input[name="product-title"]');
const max = document.querySelector('.maxlength');

// Cor
const selectColor = document.querySelector('.select-color');
const colorName = document.querySelector('.color-name');
const colorSquare = document.querySelector('.color-square');
const colorContainer = document.querySelector('.color-options');
const selectColorInput = document.querySelector('.color-options input');
const optionsColor = [...document.querySelectorAll('.color-option')];

// Grade
const selectGrids = document.querySelector('.select-grids');
const gridsContainer = document.querySelector('.grids-options');
const optionsGrids = [...document.querySelectorAll('.grid-option')];
const buttonCloseOptionsGrid = document.querySelector('.close-grids');

const inputs = [...document.querySelectorAll('.options-grid > [data-grid]')];

// Produto ativo
const productActive = document.querySelector('.active');

const inputPrice = document.querySelector('input[name="product-price"]');
const inputPromotional = document.querySelector('input[name="product-promotional-price"]');
const inputStock = document.querySelector('input[name="product-stock"]');
const inputSKU = document.querySelector('input[name="product-sku"]');

const inputWeight = document.querySelector('input[name="product-weight"]');
const inputHeight = document.querySelector('input[name="product-height"]');
const inputWidth = document.querySelector('input[name="product-width"]');
const inputLength = document.querySelector('input[name="product-length"]');

// Usuário
addEvent({
    element: userDocument,
    type: 'keyup',
    func: (event) => mask(event, regexUserDocument),
    elems: null
});

addEvent({
    element: phone,
    type: 'keyup',
    func: (event) => mask(event, regexPhone),
    elems: null
});

// Titulo
addEvent({
    element: inputTitle,
    type: 'input',
    func: onTitleInput,
    elems: [ inputTitle, max ]
});

// Cor
addEvent({
    element: selectColor,
    type: 'click',
    func: toggleActive,
    elems: colorContainer
});

addEvent({
    element: selectColorInput,
    type: 'keyup',
    func: () => staticSuggestions(selectColorInput, optionsColor),
    elems: null
});

optionsColor.forEach(el => {
    el.addEventListener('click', () => {
        const { code } = el.dataset;

        colorName.innerText = el.querySelector('label').textContent;
        colorSquare.classList.replace(colorSquare.classList.item(1), code);

        colorContainer.classList.remove('active');
        colorContainer.scrollTop = 0;

        suggestionsClear(selectColorInput, optionsColor);
    }, false);
});

// Grade
addEvent({
    element: selectGrids,
    type: 'click',
    func: toggleActive,
    elems: gridsContainer
});

addEvent({
    element: buttonCloseOptionsGrid,
    type: 'click',
    func: toggleActive,
    elems: gridsContainer
});

optionsGrids.forEach(el => {
    addEvent({
        element: el,
        type: 'click',
        func: toggleCheckedGrids,
        elems: [ el, selectGrids, inputs ]
    });
});

// Produto ativo
addEvent({
    element: productActive,
    type: 'click',
    func: toggleChecked,
    elems: productActive
});

// Mask
const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const mask = async ({ target }, func) => {
    await sleep(1);

    target.value = func(target.value);
}

const regexUserDocument = v => {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");

    return v;
}

const regexPhone = v => {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");

    return v;
}

const regexPrice = v => {
    if (v.charAt(0) === "0") {
        return "";
    }

    v = v.replace(/[^0-9]+/g, "");
    v = v.replace(/([0-9]{2})$/g, ",$1");

    if (v.length > 6) {
        v = v.replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
    }

    return v;
}

const regexInt = v => {
    if (v.charAt(0) === "0") {
        return "";
    }

    v = v.replace(/[^0-9]+/g, "");

    return v;
}

const regexDouble = v => {
    if (v.charAt(0) === "0" || v.charAt(0) === ".") {
        return "";
    }

    v = v.replace(/[^0-9\.]+/g, "");
    v = v.replace(/(?<=\.)([0-9]*)(\.*)/g, "$1");

    return v;
}

const regexWeight = v => {
    if (v.charAt(0) === ".") {
        return "";
    }

    v = v.replace(/[^0-9\.]+/g, "");
    v = v.replace(/(?<=\.)([0-9]*)(\.*)/g, "$1");

    return v;
}

const regexSKU = v => {
    v = v.toUpperCase();

    v = v.replace(/\s/g, "-");

    if (v.charAt(0) === "-") {
        return "";
    }

    v = v.replace(/[-_]+/g, "-");
    v = v.replace(/[^\w-]+/g, "");

    return v;
}

addEvent({
    element: inputPrice,
    type: 'keyup',
    func: (event) => mask(event, regexPrice),
    elems: null
});

addEvent({
    element: inputPromotional,
    type: 'keyup',
    func: (event) => mask(event, regexPrice),
    elems: null
});

addEvent({
    element: inputStock,
    type: 'keyup',
    func: (event) => mask(event, regexInt),
    elems: null
});

addEvent({
    element: inputSKU,
    type: 'keyup',
    func: (event) => mask(event, regexSKU),
    elems: null
});

addEvent({
    element: inputWeight,
    type: 'keyup',
    func: (event) => mask(event, regexWeight),
    elems: null
});

addEvent({
    element: inputHeight,
    type: 'keyup',
    func: (event) => mask(event, regexDouble),
    elems: null
});

addEvent({
    element: inputWidth,
    type: 'keyup',
    func: (event) => mask(event, regexDouble),
    elems: null
});

addEvent({
    element: inputLength,
    type: 'keyup',
    func: (event) => mask(event, regexDouble),
    elems: null
});
