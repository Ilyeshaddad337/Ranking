const table = document.querySelector("table");
let students = [];
const input = document.querySelector('#searching');
const select = document.querySelector('select');
const fileSelect = document.querySelector('#file');
var files = ["./2021-2022/NotesEmd1.csv", "./2021-2022/NotesEmd2.csv", "./2021-2022/Moyennes.csv","./2022-2023/NotesEmd1.csv"];
var myTable = document.querySelector(".myTable");
var form1 = document.querySelector('#form1');
var form2 = document.querySelector('#form2');
var form3 = document.querySelector('#form3');

window.addEventListener('load', ()=>{
  form1.reset();
  form2.reset();
  form3.reset();
})

/**
 * Sorts a HTML table.
 * 
 * @param {HTMLTableElement} table The table to sort
 * @param {number} column The index of the column to sort
 * @param {boolean} asc Determines if the sorting will be in ascending
 */
function sortTableByColumnA(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column +1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column +1})`)
      .textContent.trim();

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });
 
  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}
//sort just the hesders with the class thA (which contains Alphabetical values)
document.querySelectorAll(".table-sortable .thA").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumnA(tableElement, headerIndex, !currentIsAscending);
    });
});

// sortin numeric values 
function sortTableByColumnN (table,column,asc=true) {
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));
  for (let i = 0; i < rows.length; i++) {
    if (
      isNaN(
        rows[i].querySelector(`td:nth-child(${column + 1})`).textContent.trim()
      )
    ) {
      rows[i].querySelector(`td:nth-child(${column + 1})`).textContent = 0;
    }
  }
  //now we have an array of the values in the specified column ,we sort it
  //compare the content but changing the row it self
  function sortAsc(arr) {
    for (let i = 1; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i; j++) {
         var aj = parseFloat(
           arr[j].querySelector(`td:nth-child(${column + 1})`).textContent
         );
         var aj1 = parseFloat(
           arr[j + 1].querySelector(`td:nth-child(${column + 1})`).textContent
         );
        if (aj <   aj1) {
          var x = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = x;
        }
      }
    }
  }

  function sortDsc(arr) {
    for (let i = 1; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i; j++) {
        var aj=parseFloat(arr[j].querySelector(`td:nth-child(${column + 1})`).textContent);
        var aj1=parseFloat(arr[j+1].querySelector(`td:nth-child(${column + 1})`).textContent);
        if (aj > aj1) {
          var x = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = x;
        }
      }
    }
  }

  if (asc) {
    sortAsc(rows);
  } else {
    sortDsc(rows);
  }
  
  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...rows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}
//sort just the headers with the class thN (which contains numeric values)
document.querySelectorAll(".table-sortable .thN").forEach(headerCell => {
    headerCell.addEventListener("click", () => {
        const tableElement = headerCell.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
        const currentIsAscending = headerCell.classList.contains("th-sort-asc");

        sortTableByColumnN(tableElement, headerIndex, !currentIsAscending);
    });
});
async function getData(file) {
  const response = await fetch(file);
  const data = await response.text();

  const rows = data.split("\n").slice(1);
  rows.forEach((e) => {
    students.push(e.split(","));
  });
  
}
//inserting the elements
async function inserting(table,file) {
  await getData(file);
  var tBody = table.tBodies[0];
  students.pop();
  for (let i = 0; i < students.length; i++) {
    var tr = document.createElement("tr");
    for (let j = 0; j < students[i].length; j++) {
      var td = document.createElement("td");
      td.textContent = students[i][j];
      if (j >= 5 && showHide.innerText == "Show All") {
        td.classList.add("hide");
      }
      tr.appendChild(td);
    }

    tBody.appendChild(tr);
  } 

}
inserting(table,'./2021-2022/NotesEmd1.csv');

//now for the search 
input.addEventListener('input',() => {
  const value = input.value.toLowerCase().trim();
  var column = select.value;
  switch (column) {
    case "All":
      column = "do not choose";
      break;
    case "Sct":
      column = 0;
      break;
    case "Groupe":
      column = 1;
      break;
    case "#Rank":
      column = 2;
      break;
    case "Full Name":
      column = 3;
      break;
    case "Avrg":
      column = 4;
      break;
    case "Algo":
      column = 5;
      break;
    case "Analyse":
      column = 6;
      break;
    case "Archi":
      column = 7;
      break;
    case "Electricity":
      column = 8;
      break;
    case "Algebra":
      column = 9;
      break;
    case "T.E.E":
      column = 10;
      break;
    case "B&W":
      column = 11;
      break;
    case "Sys":
      column = 12;
      break;
  };
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));
  if (column == "do not choose") {
      rows.forEach((e) => {
      if (e.textContent.toLowerCase().match(value) === null) {
        e.classList.add('hide');
      }else {
        e.classList.remove('hide')
      }
    });
  } else {
  
      rows.forEach((e) => {
        if (!e.querySelector(`td:nth-child(${column + 1})`).classList.contains('hide')) {
          if (
            e
              .querySelector(`td:nth-child(${column + 1})`)
              .textContent.toLowerCase()
              .match(value) === null
          ) {
            e.classList.add("hide");
          } else {
            e.classList.remove("hide");
          }
        }
      })
      
      
  }
});


//hiding rows 
const labels = document.querySelectorAll(".selCols");
const theads = document.querySelectorAll("th");
var notes =[];
var trs;
var inputs = Array.from(document.querySelectorAll('input'));
inputs.pop();
inputs.shift();
window.addEventListener('load', ()=>{
    inputs.forEach((inp,ind) =>{
      if (ind >=5) {
        inp.checked = false;
        notes.push(inp)
        labels[ind].style.textDecoration = 'line-through'  
      }
    })
})

labels.forEach((e,ind)=>{
  e.addEventListener('change', () =>{
    trs = [];
    trs = table.querySelectorAll("tr");
    trs = Array.from(trs);
    trs.shift();
    
    if (!e.firstElementChild.checked) {
      theads[ind].classList.add("hide");
      trs.forEach((e1) => {
        e1.querySelector(`td:nth-child(${ind + 1})`).classList.add("hide");
        
      });
      e.style.textDecoration = 'line-through'
    } else {
      console.error(trs);
      theads[ind].classList.remove("hide");
      trs.forEach((e1) => {
        e1.querySelector(`td:nth-child(${ind + 1})`).classList.remove("hide");
        console.error(e1)
      });
      e.style.textDecoration = "";
    }
      
      
  })

})


const dropDown = document.querySelector('.btn');
const content =document.querySelector('.content');


dropDown.addEventListener("click", () => {
   const width =
     window.innerWidth ||
     document.documentElement.clientWidth ||
     document.body.clientWidth;

   if (width <= 900){
    var dropDownInput = document.querySelector("#hack");
    if (dropDownInput.checked) {
      content.style.display = "block";
      dropDownInput.checked = false;
    } else {
      content.style.display = "none";
      dropDownInput.checked = true;
    }
   } 
  })
window.addEventListener('resize',() =>{
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    var dropDownInput = document.querySelector("#hack");
    if (width>900) {
      content.style.display = "flex";
      dropDownInput.checked =true
    } else {
      content.style.display = "none";
      dropDownInput.checked =false
    }
} )

const showHide =document.querySelector('.hideAll');
showHide.addEventListener('click',() => {
  trs = [];
  trs = table.querySelectorAll("tr");
  trs = Array.from(trs);
  trs.shift();
  if (showHide.innerText == "Show All") {
    showHide.innerText ='Hide All';
    notes.forEach((e,ind)=> {
      e.checked = true;
      theads[ind+5].classList.remove("hide");
      trs.forEach((e1) => {
        e1.querySelector(`td:nth-child(${ind + 6})`).classList.remove(
          "hide"
        );
       
      });
      labels[ind + 5].style.textDecoration = "";
          
    })
  } else {
    showHide.innerText = "Show All";
    notes.forEach((e, ind) => {
      e.checked = false;
      theads[ind+5].classList.add("hide");
      trs.forEach((e1) => {
        e1.querySelector(`td:nth-child(${ind + 6})`).classList.add("hide");
      });
      labels[ind+5].style.textDecoration = "line-through";
      
    });
  }
})


//choose between the files
fileSelect.addEventListener('change',() => {
  var ind = parseInt(fileSelect.value);
  var tBody = table.tBodies[0];
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }
  students = [];
  inserting(table,files[ind]);
  
})
