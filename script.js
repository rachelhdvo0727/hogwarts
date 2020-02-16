window.addEventListener("DOMContentLoaded", start);

const studentlist = "students1991.json";
let students = [];
let selecedIndex = 0;

function start() {
  console.log("start");
  getStudents();
}
async function getStudents() {
  console.log("getStudents");
  const response = await fetch(studentlist);
  students = await response.json();

  showAllStudents();
}

function showAllStudents() {
  const pattern = document.querySelector("template");
  const list = document.querySelector("#contentlist");

  students.forEach(student => {
    const clone = pattern.cloneNode(true).content;
    clone.querySelector(".name").textContent = `${student.fullname}`;
    list.appendChild(clone);

    // click event for one student
    list.lastElementChild.addEventListener("click", () => {
      showOneStudent(student);
    });
  });
}

function showOneStudent(student) {
  document.querySelector(".popup").style.display = "block"

  document.querySelector(".close").addEventListener("click", closePopUp);
  //selectATheme();

  document.querySelector("#onestudent h2").textContent = student.fullname;
  document.querySelector("#onestudent p").textContent =
    "House: " + student.house;
  //show the theme according (dataset has the same value as json object)
  document.querySelector(".popup").dataset.theme = student.house;

}

function closePopUp() {
  document.querySelector(".popup").style.display = "none";

}

// function selectATheme() {
//   console.log("selectATheme");
//   //set options back to null
//   //document.querySelector("select#theme").options[0].selected = "selected";

//   document.querySelector("select#theme").addEventListener("change", selected);
// }

// function selected() {
//   console.log("selected");
//   const selectedTheme = this.value;

//   //document.querySelector(".popup").dataset.theme = selectedTheme;
// }