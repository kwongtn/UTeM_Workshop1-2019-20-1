// Select all constrained labels by default
function textFocus(checkbox) {
    if (document.getElementById("textFocus").checked) {
        console.log(checkbox);
        document.getElementById(checkbox).checked = true;
    }
};

// Checks if there exists an element and name
const isValidElement = element => {
    return element.name && element.value;
};

// Checks if element is an unchecked or checked box
const isValidValue = element => {
    return (!["checkbox", "radio"].includes(element.type) || element.checked);
}

// Checks if element is a checkbox, and if yes is it multi selected
const isCheckbox = element => {
    return element.type === "checkbox";
};
const isMultiSelect = element => {
    return element.options && element.multiple;
}

// Gets the selected values as an array
const getSelectValues = options => [].reduce.call(options, (values, option) => {
    if (option.selected) {
        return values.concat(option.value);
    } else {
        return values;
    }
}, []);

// Converts the form results into JSON format
const formToJSON = elements => [].reduce.call(elements, (data, element) => {

    if (isValidElement(element) && isValidValue(element)) {
        if (isCheckbox(element)) {
            data[element.name] = (data[element.name] || []).concat(element.value);

        } else if (isMultiSelect(element)) {
            data[element.name] = getSelectValues(element);

        } else {
            data[element.name] = element.value;

        }

    }
    return data;

}, {});

const handleFormSubmit = event => {
    // Preventing form from doing default submission.
    event.preventDefault();
    console.log("Intercepted ");

    //To call function to get form data.
    const data = formToJSON(form.elements);

    document.getElementById("formData").innerHTML = JSON.stringify(data);
    console.log(JSON.stringify(data));

    // Send JSON to server using POST method
    var xhr = new XMLHttpRequest();
    var url = "/listUsers/";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.send(JSON.stringify(data));

};

const form = document.getElementsByClassName("query")[0];
var data = form.addEventListener("submit", handleFormSubmit);




