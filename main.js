//intial data
let initialDB = [
  { firstName: "Martin", lastName: "Oberhofer", department: "Marketing", skills: "SEO, SEA, Copywriting, Wireframing" },
  { firstName: "Lea", lastName: "Manner", department: "Development", skills: "SCRUM-Master, JIRA, Design Thinking, UX-Evaluation" },
  { firstName: "Leo", lastName: "Kamer", department: "Development", skills: "JavaScript/TypeScript, React, Vue, Angular, Bootstrap, HTML/XML, CSS" }
];

//if local Storage is empty, then load initialDB into local storage 
if (localStorage.getItem('tableDB') === null) {
  localStorage.setItem('tableDB', JSON.stringify(initialDB));
}

//parse local storage tableDB to a JS-workable variable storing an array of objects
let localDB = JSON.parse(localStorage.tableDB);

//form input to JSON & convert the form to JSON
const formElement = document.getElementById('applicationForm');

const getFormJSON = (form) => {
  const data = new FormData(form);
  return Array.from(data.keys()).reduce((result, key) => {
    if (result[key]) {
      result[key] = data.getAll(key)
      return result
    }
    result[key] = data.get(key);
    return result;
  }, {});
};

// handle the form submission event, convert form to JSON, store Input in tempData variable, push tempData array to tableDB
const handler = () => {
  let tempData = [];
  const result = getFormJSON(formElement);
  tempData = JSON.parse(localStorage.getItem('tableDB')) || [];
  tempData.unshift(result);
  localStorage.setItem('tableDB', JSON.stringify(tempData));
  localDB = JSON.parse(localStorage.tableDB);
};

//create & configure table 
const table = new Tabulator("#applicationTable", {
  data: localDB,
  minHeight: "5 em",
  index: "lastName",
  layout: "fitColumns",
  responsiveLayout: "true",
  addRowPos: "top",
  history: true,
  pagination: "true",
  paginationSize: "10",
  paginationSizeSelector: [25, true],
  paginationCounter: "rows",
  columnDefaults: {
    tooltip: true,
  },
  columns: [
    { title: "First Name", field: "firstName", widthGrow: 0.5, editor: "input" },
    { title: "Last Name", field: "lastName", widthGrow: 0.5, editor: "input" },
    {
      title: "Department", field: "department", widthGrow: 0.5, editor: "list", editorParams: {
        values: ["Sales", "Marketing", "Development", "Consulting"],
      }
    },
    { title: "Skills", field: "skills", widthGrow: 2, editor: "input" }
  ],
});

//update Table after User Input is being sent to tableDB Array 
document.getElementById("add").onclick = function () { updateTable() };
function updateTable() {
  formElement.addEventListener("submit", handler);
  setTimeout(function () {
    table.setData(localDB);
  }, 200);
};

//trigger download of data.csv file
document.getElementById("download-csv").addEventListener("click", function () {
  table.download("csv", "data.csv");
});

//trigger download of data.xlsx file
document.getElementById("download-xlsx").addEventListener("click", function () {
  table.download("xlsx", "bewerbungen.xlsx", { sheetName: "Bewerbungen" });
});

//trigger download of data.pdf file
document.getElementById("download-pdf").addEventListener("click", function () {
  table.downloadToTab("pdf", "data.pdf", {
    orientation: "portrait", //set page orientation to portrait
    title: "Applications", //add title to report
    autoTable: { //advanced table styling
      styles: {
        fillColor: [220, 220, 220],
        valign: "middle"
      },
      headStyles: {
        textColor: [255, 255, 255],
        fillColor: [199, 44, 65]
      },
      margin: { top: 50 },
    }
  });
});

//delete newest Entry
document.getElementById("deleteNewestEntry").addEventListener("click", function () {
  let tempData = [];
  tempData = JSON.parse(localStorage.getItem('tableDB')) || [];
  tempData.shift();
  localStorage.setItem('tableDB', JSON.stringify(tempData));
  localDB = JSON.parse(localStorage.tableDB);
  setTimeout(function () {
    table.setData(localDB);
  }, 200);
});

//delete oldest Entry
document.getElementById("deleteOldestEntry").addEventListener("click", function () {
  let tempData = [];
  tempData = JSON.parse(localStorage.getItem('tableDB')) || [];
  tempData.pop();
  localStorage.setItem('tableDB', JSON.stringify(tempData));
  localDB = JSON.parse(localStorage.tableDB);
  setTimeout(function () {
    table.setData(localDB);
  }, 200);
});

//reset table to inital values
document.getElementById("resetToInitialValues").addEventListener("click", function () {
  localStorage.setItem('tableDB', JSON.stringify(initialDB));
  localDB = JSON.parse(localStorage.tableDB);
  setTimeout(function () {
    table.setData(localDB);
  }, 200);
});