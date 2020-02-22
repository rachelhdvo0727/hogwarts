window.addEventListener("DOMContentLoaded", start);

//const studentlist = "students1991.json";
let students = [];
const HTML = {};

//Prototype for all animals
const Student = {
    firstname: "",
    lastname: "",
    middlename: "",
    photo: "-unknown-",
    house: ""
};

function start() {
    console.log("start");
    HTML.thelist = document.querySelector("section#contentlist");
    HTML.theclone = document.querySelector("template#onestudent");
    HTML.popup = document.querySelector(".popup");
    HTML.closepopup = document.querySelector(".close");
    loadJSON();
}

async function loadJSON() {
    const response = await fetch("https://petlatkea.dk/2020/hogwarts/students.json");
    const jsonData = await response.json();

    // when loaded, prepare data objects
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    console.log("prepareObjects");
    students = jsonData.map(prepareObject);

    displayList(students);
}

function prepareObject(jsonObject) {
    console.log("prepare new objects");
    //TODO:Splits names into parts
    const fulltexts = jsonObject.fullname.trim();
    const housetrim = jsonObject.house.trim();
    const house = housetrim.toLowerCase();
    let smalltexts = fulltexts.toLowerCase();
    const splittexts = smalltexts.split(" ");
    //find last name
    const theLastSpace = smalltexts.lastIndexOf(" ");
    const last = smalltexts.substring(theLastSpace + 1, smalltexts.length);
    //find middle name
    const theFirstSpace = smalltexts.indexOf(" ");
    const middleName = smalltexts.substring(theFirstSpace + 1, theLastSpace);
    //Find nickname & remove ""
    const sign = middleName.indexOf('"', 1);
    const nickName = middleName.substring(1, sign);

    //First name capitalization
    const first = splittexts[0];
    const firstCap = first[0].toUpperCase();
    const firstLower = first.slice(1).toLowerCase();
    const firstName = firstCap + firstLower;

    //Middle name capitalization
    // const middleCap = middle[0].toUpperCase();
    // const middleLower = middle.slice(1).toLowerCase();
    // const middleName = middleCap + middleLower;

    //Last name capitalization
    const lastCap = last[0].toUpperCase();
    const lastLower = last.slice(1).toLowerCase();
    const lastName = lastCap + lastLower;

    //House capitalization
    const firstLetter = house[0].toUpperCase();
    const otherLetters = house.slice(1).toLowerCase();
    const capHouse = firstLetter + otherLetters;
    //Gender capitalization
    const genderCap = jsonObject.gender[0].toUpperCase();
    const genderRest = jsonObject.gender.slice(1).toLowerCase();
    const gender = genderCap + genderRest;

    //Put values into new properties
    const student = Object.create(Student);
    student.firstname = firstName;
    student.middlename = middleName;
    student.lastname = lastName;
    student.nickname = nickName;
    student.house = capHouse;
    student.gender = gender;

    return student;
}

function displayList() {
    // clear the list
    HTML.thelist.innerHTML = "";

    // build a new list
    students.forEach(displayStudent);
}

function displayStudent(student) {
    // create clone
    const clone = HTML.theclone.content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=firstname]").textContent = student.firstname;
    clone.querySelector("[data-field=lastname]").textContent = student.lastname;
    clone.querySelector("[data-field=house]").textContent = student.house;

    // append clone to list
    document.querySelector("#contentlist").appendChild(clone);

    // click event for one student
    HTML.thelist.lastElementChild.addEventListener("click", () => {
        popUpOne(student)
    });
}

function popUpOne(student) {
    HTML.popup.style.display = "block";
    //show the theme according (dataset has the same value as json object)
    HTML.popup.dataset.theme = student.house;
    HTML.closepopup.addEventListener("click", closePopUp);

    document.querySelector("[data-field=firstname]").textContent = student.firstname;
    document.querySelector("[data-field=middlename]").textContent = student.middlename;
    document.querySelector("[data-field=lastname]").textContent = student.lastname;
    document.querySelector("[data-field=gender]").textContent = student.gender;
    document.querySelector("[data-field=house]").textContent = "House: " + student.house;
}

function closePopUp() {
    HTML.popup.style.display = "none";
}
