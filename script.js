"use strict";

window.addEventListener("DOMContentLoaded", init);

let students = [];
//Prototype for all animals
const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  photo: "-unknown-",
  house: ""
};

function init() {
  console.log("init");
  loadJson();
}

function loadJson() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(response => response.json())
    .then(jsonData => {
      students = jsonData;

      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
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

  console.log(student);
  return student;
}

function displayList() {
  // clear the list
  document.querySelector("#list").innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  // create clone
  const clone = document
    .querySelector("template#student")
    .content.cloneNode(true);

  // set clone data
  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=nickname]").textContent = student.nickname;
  clone.querySelector("[data-field=gender]").textContent = student.gender;
  clone.querySelector("[data-field=house]").textContent = student.house;

  // append clone to list
  document.querySelector("#list").appendChild(clone);
}
