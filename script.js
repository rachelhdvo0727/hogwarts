window.addEventListener("DOMContentLoaded", start);

const HTML = {};
let students = [];
let expell = [];
let arrHalf = [];
let arrPure = [];
let theSystemhasbeenHacked = false;

let fileIterator = 0;
const loadArray = [
  "https://petlatkea.dk/2020/hogwarts/students.json",
  "https://petlatkea.dk/2020/hogwarts/families.json"
];

//Prototype for all students
const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  photo: null,
  gender: "",
  house: "",
  blood: "",
  expell: false,
  squad: false,
  prefect: false
};

function start() {
  console.log("start");
  HTML.filterhouse = document.querySelector("select#housefilter");
  HTML.sortname = document.querySelectorAll("[data-action=sort]");
  HTML.searchinput = document.querySelector("#searchelms > input");

  HTML.displaystudents = document.querySelector(".totalstudents");
  HTML.displayexpelled = document.querySelector(".expelledstudents > .number");
  HTML.displaySlytherin = document.querySelector(".slytherin");
  HTML.displayHufflepuff = document.querySelector(".hufflepuff");
  HTML.displayRavenclaw = document.querySelector(".ravenclaw");
  HTML.displayGryffindor = document.querySelector(".gryffindor");

  HTML.thelist = document.querySelector("section#contentlist");
  HTML.blurbg = document.querySelector("article");
  HTML.theclone = document.querySelector("template");
  HTML.clickOnestudent = document.querySelectorAll(".seestudent");

  HTML.popup = document.querySelector(".popup");
  HTML.closepopup = document.querySelector(".close");

  //Click events for sorting and filtering
  HTML.filterhouse.addEventListener("change", filteringhouse);
  HTML.sortname.forEach(button => {
    button.addEventListener("click", sortingname);
  });

  //Search event for search
  HTML.searchinput.addEventListener("keyup", searching);
  loadBlood();
}

async function loadBlood() {
  console.log("loadBlood");
  const response = await fetch(loadArray[1]);
  const jsonBlood = await response.json();

  prepareBlood(jsonBlood);
  loadStudents();
}

function prepareBlood(jsonBlood) {
  console.log("prepareBloodStatus");
  arrHalf = jsonBlood.half;
  arrPure = jsonBlood.pure;
}

async function loadStudents() {
  console.log("loadStudents");
  const response = await fetch(loadArray[0]);
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
  const student = Object.create(Student);

  //Trim and splits names and houses into parts
  const fulltexts = jsonObject.fullname.trim().toLowerCase();
  const house = jsonObject.house.trim().toLowerCase();
  //const fulltexts = cleanup.replace(/"/g, "");
  const splitnames = fulltexts.split(" ");

  //FIRST NAME
  const first = splitnames[0];
  const firstCap = first[0].toUpperCase();
  const firstLower = first.slice(1).toLowerCase();
  const firstName = firstCap + firstLower;
  //Put values into new properties
  student.firstname = firstName;

  //LAST NAME
  const theLastSpace = fulltexts.lastIndexOf(" ");
  const last = fulltexts.substring(theLastSpace + 1, fulltexts.length);
  const lastName = last[0].toUpperCase() + last.slice(1).toLowerCase();
  let nameWithhyphen;
  //Put values into new properties
  if (lastName.includes("-") === true) {
    nameWithhyphen =
      lastName[6].toUpperCase() + lastName.slice(7).toLowerCase();
    student.lastname = lastName.substring(0, 6) + nameWithhyphen;
  } else if (lastName === "Leanne") {
    student.lastname = "";
  } else {
    student.lastname = lastName;
  }

  //MIDDLE NAME & NICK NAME (with quotes)
  const theFirstSpace = fulltexts.indexOf(" ");
  const middleName = fulltexts.substring(theFirstSpace + 1, theLastSpace);
  let ernie;
  let james;
  let lucius;
  //Put values into new properties
  if (middleName.includes("er") === true) {
    //keep quotes and capitalize first letter
    ernie =
      middleName[0] +
      middleName[1].toUpperCase() +
      middleName.slice(2).toLowerCase();
    student.middlename = ernie;
  } else if (middleName.includes("luci") === true) {
    lucius = middleName[0].toUpperCase() + middleName.slice(1).toLowerCase();
    student.middlename = lucius;
  } else if (middleName.includes("jam") === true) {
    james = middleName[0].toUpperCase() + middleName.slice(1).toLowerCase();
    student.middlename = james;
  } else {
    student.middlename = middleName;
  }

  //HOUSE
  const capHouse = house[0].toUpperCase() + house.slice(1).toLowerCase();
  //Put values into new properties
  student.house = capHouse;

  //GENDER
  const gender =
    jsonObject.gender[0].toUpperCase() +
    jsonObject.gender.slice(1).toLowerCase();
  student.gender = gender;

  //PHOTO
  const photo =
    lastName.toLowerCase() + "_" + firstName[0].toLowerCase() + ".png";
  let patilsPhoto = lastName + "_" + firstName.toLowerCase() + ".png";
  let fletchleysPhoto =
    lastName.substring(6) + "_" + firstName[0].toLowerCase() + ".png";
  //Put values into new properties
  if (photo === "patil_p.png") {
    student.photo = patilsPhoto;
  } else if (photo === "finch-fletchley_j.png") {
    student.photo = fletchleysPhoto;
  } else {
    student.photo = photo;
  }

  //BLOODSTATUS
  student.blood = bloodStt();

  function bloodStt() {
    function checking(bloodarr) {
      return student.lastname == bloodarr;
    }
    const checkPure = arrPure.some(checking);
    const checkHalf = arrHalf.some(checking);
    if (checkHalf === true && checkPure === true) {
      return "Halfblood";
    } else if (checkHalf === true) {
      return "Halfblood";
    } else if (checkPure === true) {
      return "Pureblood";
    } else {
      return "Muggle";
    }
  }

  return student;
}
//SEARCH BY FIRST AND LAST NAMES
function searching(event) {
  console.log("search names");
  //Value from the search bar
  let keywords = event.target.value;
  const searchFirstname = event.target.dataset.firstname;
  const searchLastname = event.target.dataset.lastname;
  const searchHouse = event.target.dataset.house;

  if (searchFirstname === "firstname") {
    keywords = "firstname";
  } else if (searchLastname === "lastname") {
    keywords = "lastname";
  } else if (searchHouse === "house") {
    keywords = "house";
  }
  displayList(searchForStudents(keywords));
}

function searchForStudents(keywords) {
  console.log("searchForStudents");
  const searchresult = students.filter(searchFunction);
  keywords = keywords.toLowerCase();

  function searchFunction(student) {
    let firstnameLower = student.firstname.toLowerCase();
    let lastnameLower = student.lastname.toLowerCase();
    let houseLower = student.house.toLowerCase();

    if (firstnameLower.indexOf(keywords) > -1 || firstnameLower === keywords) {
      return true;
    } else if (lastnameLower.indexOf(keywords) > -1 || lastnameLower === keywords) {
      return true;
    } else if (houseLower.indexOf(keywords) > -1 || houseLower === keywords) {
      return true;
    } else {
      return false;
    }
  }
  return searchresult;
}
//FILTERING BY HOUSE
function filteringhouse(event) {
  //HUSK: atribute 'value' skal have den samme navn som info i listen
  const selectedHouse = event.target.value;
  //løsningen virkede ikke før fordi value = "slytherrin", men student.house = "Slytherin"
  if (selectedHouse === "*") {
    displayList(students);
  } else {
    displayList(filterByHouse(selectedHouse));
  }
}

function filterByHouse(selectedHouse) {
  const result = students.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === selectedHouse) {
      return true;
    } else {
      return false;
    }
  }
  return result;
}

//SORTING BY NAME
function sortingname(event) {
  console.log("sorting name");
  const sortDir = event.target.dataset.sortDirection;
  const sortInfo = event.target.dataset.sort;

  //The switch mellem ascending og descending
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "dsc";
  } else if (sortDir === "dsc") {
    event.target.dataset.sortDirection = "asc";
  }

  displayList(sortByName(sortInfo, sortDir));
}

function sortByName(sortInfo, sortDir) {
  console.log("sortByName");
  let sortedlist;

  if (sortDir === "asc") {
    sortedlist = students.sort(compareAsc);
    console.log("sortAsc");
  } else if (sortDir === "dsc") {
    sortedlist = students.sort(compareDsc);
    console.log("sortDsc");
  }

  //Ascending (stigende)
  function compareAsc(a, b) {
    console.log("compareAsc");
    if (a[sortInfo] < b[sortInfo]) {
      return -1;
    } else {
      return 1;
    }
  }
  //Descending (faldende)
  function compareDsc(a, b) {
    console.log("compareDsc");
    if (a[sortInfo] > b[sortInfo]) {
      return -1;
    } else {
      return 1;
    }
  }
  return sortedlist;
}

function buildList() {
  const currentList = students;

  // TODO: Add filter and sort on this list, before displaying
  displayList(currentList);
}

function displayList(students) {
  // clear the list
  HTML.thelist.innerHTML = "";

  // build a new list
  students.forEach(displayStudent);
}

function displayStudent(student) {
  //Show the list's status
  const displaySlytherin = students.filter(student => student.house === "Slytherin");
  const displayHufflepuff = students.filter(student => student.house === "Hufflepuff");
  const displayRavenclaw = students.filter(student => student.house === "Ravenclaw");
  const displayGryffindor = students.filter(student => student.house === "Gryffindor");
  // const displayExpelled = expell.filter(expelled => expell.house === "Gryffindor");

  HTML.displaySlytherin.textContent = "Slytherin: " + displaySlytherin.length + " students";
  HTML.displayHufflepuff.textContent = "Hufflepuff: " + displayHufflepuff.length + " students";
  HTML.displayRavenclaw.textContent = "Ravenclaw: " + displayRavenclaw.length + " students";
  HTML.displayGryffindor.textContent = "Gryffindor: " + displayGryffindor.length + " students";

  HTML.displaystudents.textContent = "Current total: " + students.length + " students";


  // create clone
  const clone = HTML.theclone.content.cloneNode(true);

  // set clone data
  clone.querySelector(".studentphoto").src = "images/" + student.photo;
  clone.querySelector("[data-field=firstname]").textContent = student.firstname;
  clone.querySelector("[data-field=lastname]").textContent = student.lastname;
  clone.querySelector("[data-field=house]").textContent = student.house;

  if (theSystemhasbeenHacked) {
    hackTheSystem();
  }
  // append clone to list
  HTML.thelist.appendChild(clone);


  // click event for one student
  HTML.thelist.lastElementChild.addEventListener("click", () => {
    popUpOne(student);
  });
}

function popUpOne(student) {
  //Show popup box & blur background
  HTML.popup.style.display = "block";
  HTML.blurbg.style.filter = "blur(3px)";

  //show the theme according (dataset has the same value as json object)
  HTML.popup.dataset.theme = student.house;
  HTML.closepopup.addEventListener("click", closePopUp);

  //remove all click events when closing popup
  function closePopUp() {
    HTML.popup.style.display = "none";
    HTML.blurbg.style.filter = "none";

    document
      .querySelector("[data-action=expell]")
      .removeEventListener("click", clickExpell);
    document.querySelector("[data-field=expell]").textContent = "";
    document
      .querySelector("[data-field=squad]")
      .removeEventListener("click", clickSquad);

    document
      .querySelector("[data-field=prefect]")
      .removeEventListener("click", clickPrefect);
  }

  //show detailed info on popup
  document.querySelector("[data-field=firstname]").textContent =
    student.firstname;
  document.querySelector("[data-field=middlename]").textContent =
    student.middlename;
  document.querySelector("[data-field=lastname]").textContent =
    student.lastname;
  document.querySelector("[data-field=photo]").src = "images/" + student.photo;
  document.querySelector("[data-field=gender]").textContent =
    "Gender: " + student.gender;
  document.querySelector("[data-field=house]").textContent =
    "House: " + student.house;
  document.querySelector("[data-field=bloodstatus]").textContent =
    "Blood status: " + student.blood;

  //Display squad symbol
  if (student.squad === true) {
    document.querySelector("[data-field=squad]").style.filter = "none";
  } else {
    document.querySelector("[data-field=squad]").style.filter =
      "grayscale(100%)";
  }

  //Display prefect
  if (student.prefect === true) {
    document.querySelector("[data-field=prefect]").style.filter = "none";
  } else {
    document.querySelector("[data-field=prefect]").style.filter =
      "grayscale(100%)";
  }
  document.querySelector("[data-field=prefect]").dataset.prefect =
    student.prefect;

  //Toggle prefect symbol and squad
  document
    .querySelector("[data-field=squad]")
    .addEventListener("click", clickSquad);
  document
    .querySelector("[data-field=prefect]")
    .addEventListener("click", clickPrefect);

  function clickSquad() {
    console.log("clickSquad");
    if (theSystemhasbeenHacked) {
      setTimeout(() => toggleSquad(student), 1000);
    } else {
      toggleSquad(student);
    }
  }

  function clickPrefect() {
    console.log("clickPrefect");
    togglePrefect(student);
  }

  //Expelling a student
  document
    .querySelector("[data-action=expell]")
    .addEventListener("click", clickExpell);

  function clickExpell() {
    console.log("clickExpell");
    expellStudent(student);
  }

  if (theSystemhasbeenHacked) {
    student.blood = Math.floor(Math.random() * 30);
  }
}

function toggleSquad(student) {
  if (student.blood === "Pureblood" || student.house === "Slytherin") {
    if (student.squad === true) {
      student.squad = false;
      document.querySelector("[data-field=squad]").style.filter =
        "grayscale(100%)";
      document.querySelector(".squadnote").textContent = "";
    } else {
      student.squad = true;
      document.querySelector("[data-field=squad]").style.filter = "none";
    }
  }
}

function togglePrefect(thisStudent) {
  console.log("toggle prefect");
  //total prefects: check each house and each gender
  const totalPrefects = students.filter(student => student.prefect && student.house === thisStudent.house && student.gender === thisStudent.gender ? true : false);

  if (totalPrefects.length === 0 || thisStudent.prefect === true) {
    thisStudent.prefect = thisStudent.prefect ? false : true;
    document.querySelector("[data-field=prefect]").style.filter = "none";
  } else {
    alertChangePrefects(thisStudent, totalPrefects[0]);
  }
  displayList(students);
}

function alertChangePrefects(thisStudent, totalPrefects) {
  console.log("alertChangePrefects");
  document.querySelector("#onlytwostudents").classList.add("show");
  document.querySelector("#onlytwostudents .student1").textContent = `${totalPrefects.firstname} ${totalPrefects.lastname} (${totalPrefects.gender}), from ${totalPrefects.house}`;
  document.querySelector("#onlytwostudents .student2").textContent = `${thisStudent.firstname} ${thisStudent.lastname} (${thisStudent.gender}), from ${thisStudent.house}`;

  removeButtons(totalPrefects, thisStudent);
}

function removeButtons(totalPrefects, thisStudent) {
  console.log("removeButtons");
  document
    .querySelector("[data-action=remove1]")
    .addEventListener("click", remove1st);
  document
    .querySelector("[data-action=remove2]")
    .addEventListener("click", remove2nd);

  function remove1st() {
    console.log("remove the 1st student");
    totalPrefects[0].prefect = false;
    document.querySelector("#onlytwostudents").classList.remove("show");

    thisStudent.prefect = true;
    displayList(students);

    document
      .querySelector("[data-action=remove1]")
      .removeEventListener("click", remove1st);
    document
      .querySelector("[data-action=remove2]")
      .removeEventListener("click", remove2nd);
  }

  function remove2nd() {
    console.log("remove the 2nd student");
    totalPrefects[1].prefect = false;
    document.querySelector("#onlytwostudents").classList.remove("show");

    thisStudent.prefect = true;
    displayList(students);

    document
      .querySelector("[data-action=remove1]")
      .removeEventListener("click", remove1st);
    document
      .querySelector("[data-action=remove2]")
      .removeEventListener("click", remove2nd);
  }

  document.querySelector(".closebutton").addEventListener("click", () => {
    document.querySelector("#onlytwostudents").classList.remove("show");
    document
      .querySelector("[data-action=remove1]")
      .removeEventListener("click", remove1st);
    document
      .querySelector("[data-action=remove2]")
      .removeEventListener("click", remove2nd);
  });

}


function expellStudent(student) {
  console.log("expell this student");
  //expell = students.indexOf(student);
  // students.splice(expell, 1);
  expell = expell.concat(
    students.splice(students.indexOf(student), 1)
  );

  document.querySelector(
    "[data-field=expell]"
  ).textContent = `${student.firstname} ${student.lastname} has been expelled!`;
  HTML.displayexpelled.textContent = expell.length;

  buildList();
  displayList(students);
}

function hackTheSystem() {
  console.log("hacking Hogwarts");

  theSystemhasbeenHacked === true;
  const me = Object.create(Student);
  me.photo = "-unknown-";
  me.firstname = "Rachel";
  me.lastname = "Vo";
  me.house = "Hufflepuff";
  me.gender = "Girl";
  me.squad = true;
  me.prefect = true;
  me.expell = false;

  students.push(me);
  buildList();

  //Mess up blood status
  students.forEach(student => {
    student.blood = Math.floor(Math.random() * 30);
  });
}
