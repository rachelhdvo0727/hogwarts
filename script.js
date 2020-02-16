"use strict";

window.addEventListener("DOMContentLoaded", init);
let students;

function init() {
    console.log("init");
    loadJson();
}

function loadJson() {
    fetch("https://petlatkea.dk/2020/hogwarts/students.json")
        .then(response => response.json())
        .then(jsonData => {
            students = jsonData;
            // when loaded, display the list
            displayList();
        })
}

function displayList() {
    // clear the list
    document.querySelector("#list").innerHTML = "";

    // build a new list
    students.forEach(displayStudent);
}

function displayStudent(student) {
    // create clone
    const clone = document.querySelector("template#student").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=fullname]").textContent = student.fullname;
    clone.querySelector("[data-field=gender]").textContent = student.gender;
    clone.querySelector("[data-field=house]").textContent = student.house;

    // append clone to list
    document.querySelector("#list").appendChild(clone);

}