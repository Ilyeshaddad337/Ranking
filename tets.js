//hiding rows 
const labels = document.querySelectorAll(".selCols");
var notes =[];
var trs;
var inputs = Array.from(document.querySelectorAll('input'));
inputs.pop();
inputs.shift();


labels.forEach((e,ind)=>{
  e.addEventListener('change', () =>{
    trs = [];
    trs = table.querySelectorAll("tr");
    trs = Array.from(trs);
    trs.shift();
    
    if (!e.firstElementChild.checked) {
      currentHeaders[ind].classList.add("hide");
      trs.forEach((e1) => {
        e1.querySelector(`td:nth-child(${ind + 1})`).classList.add("hide");
        
      });
      e.style.textDecoration = 'line-through'
    } else {
      console.error(trs);
      currentHeaders[ind].classList.remove("hide");
      trs.forEach((e1) => {
        e1.querySelector(`td:nth-child(${ind + 1})`).classList.remove("hide");
        console.error(e1)
      });
      e.style.textDecoration = "";
    }
      
      
  })

})


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
      currentHeaders[ind+5]?.classList.remove("hide");
      trs.forEach((e1) => {
        e1.querySelector(`td:nth-child(${ind + 6})`)?.classList.remove(
          "hide"
        );
       
      });
      labels[ind + 5]?.style.textDecoration = "";
          
    })
  } else {
    showHide.innerText = "Show All";
    notes.forEach((e, ind) => {
      e.checked = false;
      currentHeaders[ind+5].classList.add("hide");
      trs.forEach((e1) => {
        e1.querySelector(`td:nth-child(${ind + 6})`)?.classList.add("hide");
      });
      labels[ind+5]?.style.textDecoration = "line-through";
      
    });
  }
})
