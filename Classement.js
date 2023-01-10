const table = document.querySelector("table");
let students = [];
const input = document.querySelector('#searching');
const select = document.querySelector('select');
const fileSelect = document.querySelector('#file');
var files = ["./2021-2022/NotesEmd1.csv", "./2021-2022/NotesEmd2.csv", "./2021-2022/Moyennes.csv","./2022-2023/algebre3-s1-emd1-promo.csv","./2022-2023/analyse3-s1-emd1-promo.csv","./2022-2023/proba-s1-emd1-promo.csv","./2022-2023/eln2-s1-emd1-promo.csv","./2022-2023/eng-s1-emd1-promo.csv"];
var myTable = document.querySelector(".myTable");
var form1 = document.querySelector('#form1');
var form2 = document.querySelector('#form2');
var form3 = document.querySelector('#form3');
var alertt = document.querySelector('.alert');

var currentHeaders = [];
window.addEventListener('load', ()=>{
  form1.reset();
  form2.reset();
  form3.reset();
})


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

// sortin numeric values 
function sortTableByColumnN (table,column,asc=true) {
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));
  for (let i = 0; i < rows.length; i++) {
    if (
      isNaN(
        parseFloat(rows[i].querySelector(`td:nth-child(${column + 1})`).textContent.trim()) 
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




async function getData(file) {
  students = []
  const response = await fetch(file);
  const data = await response.text();  
  if (data.indexOf('html') != -1) {
    currentHeaders = ['There is no data'];

    students.push(['No data'])

  }else {
  currentHeaders = data.split("\n")[0].split(",");
  const rows = data.split("\n").slice(1);
  rows.forEach((e) => {
    students.push(e.split(","));
  });
}
}

function insert_labels(content,labels,notes){
  if (currentHeaders.length == 0) {
    content.innerHTML = "<label>No Data</label>";
    alertt.classList.add("hide");
  } else if (currentHeaders[0] == "There is no data") {
    content.innerHTML = "<label>No Data</label>";
    alertt.classList.add("hide");

  } 
  else {
    for (let i = 0; i < currentHeaders.length; i++) {
      var label = document.createElement("label");
      label.setAttribute("for", currentHeaders[i]);
      label.classList.add("selCols")
      label.textContent = currentHeaders[i];
      var input = document.createElement("input");
      input.setAttribute("type", "checkbox");
      input.setAttribute("id", currentHeaders[i]);
      input.setAttribute("value", currentHeaders[i]);
      if (i >= 5) {
        input.checked = false;
        notes.push(input)
        
      } else {
        input.setAttribute("checked", "checked");
      } 
      label.appendChild(input);
      labels.push(label)
      if (i >= 5 ) {
        labels[i].style.textDecoration = 'line-through'
      }
      content.appendChild(label);
    }
  }
}
//inserting the elements
async function inserting(table,file) {
  await getData(file);
  alertt.classList.remove("hide")
  setTimeout(function(){ alertt.classList.add("hide") }, 15000);
  // initialize the labels
  var content = document.querySelector("div.content");
  content.innerHTML = "";
  var labels = []
  var notes = []
  insert_labels(content,labels,notes);
  
  // initialize table headers
  var tHead = table.tHead;
  
  tHead.innerHTML = "";
  let trr = document.createElement("tr");
  
  for (let i = 0; i < currentHeaders.length; i++) {
    var th = document.createElement("th");
    th.textContent = currentHeaders[i];
    if (i >= 5 && showHide.innerText == "Show All") {
      th.classList.add("hide");
    }
    if (isNaN(parseFloat(students[0][i]))) {
      th.classList.add("thA");
      
    } else {  
      th.classList.add("thN");
      
    }
    trr.appendChild(th);
  }
  
  //select all the th in table row
  var ths = trr.querySelectorAll("th");
  ths.forEach((th) => {
    if (th.classList.contains("thA")) {
      th.addEventListener("click", () => {
        const tableElement = th.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(th.parentElement.children, th);
        const currentIsAscending = th.classList.contains("th-sort-asc");
        
        sortTableByColumnA(tableElement, headerIndex, !currentIsAscending);
      });
    } else {
      th.addEventListener("click", () => {
        const tableElement = th.parentElement.parentElement.parentElement;
        const headerIndex = Array.prototype.indexOf.call(th.parentElement.children, th);
        const currentIsAscending = th.classList.contains("th-sort-asc");
        
        sortTableByColumnN(tableElement, headerIndex, !currentIsAscending);
      });
      
    }

  });
  tHead.appendChild(trr);

  // initialize table body
  var tBody = table.tBodies[0];
  if (students[students.length-1].length < currentHeaders.length){
    students.pop();
  }
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
  //adding event listener to the labels
  labels.forEach((e,ind)=>{
    e.addEventListener('change', () =>{
      trs = [];
      trs = table.querySelectorAll("tr");
      trs = Array.from(trs);
      trs.shift();
      
      if (!e.firstElementChild.checked) {
        ths[ind].classList.add("hide");
        trs.forEach((e1) => {
          e1.querySelector(`td:nth-child(${ind + 1})`).classList.add("hide");
          
        });
        e.style.textDecoration = 'line-through'
      } else {
        ths[ind].classList.remove("hide");
        trs.forEach((e1) => {
          e1.querySelector(`td:nth-child(${ind + 1})`).classList.remove("hide");
        });
        e.style.textDecoration = "";
      }
        
        
    })
  
  })


  if (notes.length == 0) {
    showHide.classList.add("hide");
  }else {
    showHide.classList.remove("hide");

    //adding event listener to the show/hide button
    showHide.notes = notes;

    showHide.addEventListener('click',function hello(e) {
      e.preventDefault();
      trs = [];
      trs = table.querySelectorAll("tr");
      trs = Array.from(trs);
      trs.shift();
      if (showHide.innerText == "Show All") {
        showHide.innerText ='Hide All';
        if (e.currentTarget.notes.length > 0) {
          e.currentTarget.notes.forEach((e,ind)=> {
            e.checked = true;
            ths[ind+5].classList.remove("hide");
            trs.forEach((e1) => {
              e1.querySelector(`td:nth-child(${ind + 6})`).classList.remove(
                "hide"
              );
            
            });
            labels[ind + 5].style.textDecoration = "";
                
          })
        }
      } else {
        showHide.innerText = "Show All";
        if (e.currentTarget.notes.length > 0){
          
          e.currentTarget.notes.forEach((e, ind) => {
            e.checked = false;
            ths[ind+5].classList.add("hide");
            trs.forEach((e1) => {
              e1.querySelector(`td:nth-child(${ind + 6})`).classList.add("hide");
            });
            labels[ind+5].style.textDecoration = "line-through";
            
          });
        }
      }
    })
  }
  
}
inserting(table,files[4]);

//now for the search 
input.addEventListener('input',() => {
  var value = input.value.toLowerCase();
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));
  if (value == "") {
    
    rows.forEach((e) => {
      e.classList.remove("selected");
    });
  }else {
    value = value.trim();
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
    
    if (column == "do not choose") {
        rows.forEach((e) => {
        if (e.textContent.toLowerCase().match(value) !== null) {
          e.classList.add('selected');
          e.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
        }else {
          e.classList.remove('selected')
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
  }
});




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
