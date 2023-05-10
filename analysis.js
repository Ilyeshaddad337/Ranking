var baseData = null
var currentPromo = '2021'
var currentYear = '2022-2023'
var values_count = null
var safe = null
var avrg_succs = null
var means = null
    
class Data {
    constructor(labels, datasets) {
        this.labels = labels;
        this.datasets = datasets;
  }
}
class Dataset {
    constructor(label, data , backgroundColor = 'rgba(255, 99, 132, 0.8)', borderColor = 'rgba(255, 99, 132, 1)', borderWidth = 1) {
        this.label = label;
        this.data = data;
        this.backgroundColor = backgroundColor;
        this.borderColor = borderColor;
    }
}

function findProm(name) {
  return baseData['promos'].filter(prom => {
    return prom['name'] == name
    
  })[0]


}
function findYear(name , year) {
  let prom = findProm(name)
  if (prom != undefined) {
    return prom['years'].filter(y => {
      return y['year'] == year
      
    })[0]

  } else {
    return undefined
  }
}

function initialise() {
  let year = findYear(currentPromo, currentYear)
  if  (year == undefined) {
    console.error('year not found')
    return
  }
  let modules = year["modules_name"]

  let select = document.querySelector('select.modules');
  modules.forEach(modd => {
      let option = document.createElement('option');
      option.value = modd[0];
      option.innerHTML = modd[0];
      select.querySelector('optgroup').appendChild(option);
  
    });

  select.addEventListener('change', (event) => {
    values_count.destroy()
    values_count = drawValueCount(event.target.value)
    values_count.update()
  })
}




function addData(chart, type = 'bar', data ,options = {}) {
  console.log(chart);
  chart.type = type
  chart.data = data
  chart.options = options
  chart.update();
}




async function fetchData(file) {
    baseData = null
    const response = await fetch(file) 
    baseData = await response.json()
      
}
function drawChart(id,type= 'bar', data = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [{
    label: '# of Votes',
    data: [12, 19, 3, 5, 2, 3],
    borderWidth: 1
  }]
}, options = {
  scales: {
    y: {
      beginAtZero: true
    }
  }}) {
  let ctx = document.getElementById(id);
  return new Chart(ctx, {
    type: type,
    data: data,
    options: options
  });
  
}
function drawValueCount(module) {
  let year = findYear(currentPromo, currentYear)
  if  (year == undefined) {
    console.error('year not found')
    return 
  }
  let sorted = year["modules"][0]["s1"]['emd1']["values_count"].sort((a, b) => b[0] - a[0])
  sorted = sorted.filter(dat => dat[1] >= 5)
  let notes = sorted.map(dat => dat[0])
  let counts = sorted.map(dat => dat[1])
  let datasets = [new Dataset(`Spread of ${module} S1 Emd1`, counts,backgroundColor=  '#9BD0F5')]
  let data = new Data(notes, datasets)
  addData(valuesCount, 'bar', data, {
      aspectRatio: 1,
      responsive: true,
      scales: {
          
        y: {
          max: Math.max(...counts) +2
        }
      }
    })
}
function drawSucces(sem) {
  let year = findYear(currentPromo, currentYear)

  if  (year == undefined) {
    console.error('year not found')
    return 
  }
  let em2 = false
  let modules = year["modules_name"].map(mod => ({name: mod[0], ind:  mod[1]}));
  modules = modules.map(mod => {
    let fail_count = 0
    year["modules"][mod['ind']][sem]['emd1']['notes'].forEach(note => {
      if (parseFloat(note[0]) < 10) {
        fail_count += 1
      } 
    });

    mod['emd1_succ'] = fail_count
    fail_count = 0
    if(year["modules"][mod['ind']][sem]['emd2']['notes'].length !== 0) {
      em2 = true
      year["modules"][mod['ind']][sem]['emd2']['notes'].forEach(note => {
        if (parseFloat(note[0]) < 10) {
          fail_count += 1
        }
      });
      mod['emd2_succ'] = fail_count
    }
    return mod});
  let x = modules.map(mod => mod['name'])
  let y1 = modules.map(mod => mod['emd1_succ'])
  let datasets = [new Dataset(`How much students Failed in ${sem.toUpperCase()} EMD1`, y1)]

  if (em2){
    let y2 = modules.map(mod => mod['emd2_succ'])
    datasets.push(new Dataset(`How much students Failed in ${sem.toUpperCase()} EMD2`, y2))
  }
  let data = new Data(x, datasets)
  addData(safe, 'bar', data, {
      aspectRatio: 1,
      responsive: true,
      scales: {
        y: {
          max: year["modules"][0][sem]['emd1']['notes'].length
        }
      }
    })
}
function drawAvrg(sem,emd) {
  let year = findYear(currentPromo, currentYear)

  if  (year == undefined) {
    console.error('year not found')
    return 
  }
  let avrgs = year[sem][emd]['avrgs'].map(mod => (mod[0]));
  let ttl = avrgs.length
  let fail_count = 0
  let nan_count = 0
  avrgs.forEach(avr => {
    if (parseFloat(avr) < 10) {
      
      fail_count += 1
    } else if (isNaN(parseFloat(avr))) {
      nan_count += 1
    }
  })
  

  let datasets = [new Dataset(`How much students Failed in ${sem.toUpperCase()} EMD1`, [ttl-fail_count-nan_count, fail_count-nan_count],backgroundColor=  ['rgba(54, 162, 235,0.7) ', 'rgba(255, 99, 132, 0.8)'],borderColor=  ['rgba(54, 162, 235,1)', 'rgba(255, 99, 132, 0.8)'])]

  
  let data = new Data(['Succeded', 'Failed'], datasets)
  addData(avrg_succs, 'doughnut', data, {
      aspectRatio: 1,
      responsive: true,
      plugins: {
        title: {
            display: true,
            text: `Failed vs Succeded in ${sem.toUpperCase()} ${emd.toUpperCase()}`
        }
    }
      
    })
}
function drawMeans(sem) {
  let year = findYear(currentPromo, currentYear)

  if  (year == undefined) {
    console.error('year not found')
    return 
  }
  let em2 = false
  let modules = year["modules_name"].map(mod => ({name: mod[0], ind:  mod[1]}));
  modules = modules.map(mod => {    
    mod['emd1_mean'] = year["modules"][mod['ind']][sem]['emd1']['mean']
    if(year["modules"][mod['ind']][sem]['emd2']['mean']) {
      em2 = true
      mod['emd2_mean'] = year["modules"][mod['ind']][sem]['emd2']['mean']
    }
    return mod});
  let x = modules.map(mod => mod['name'])
  let y1 = modules.map(mod => mod['emd1_mean'])
  let datasets = [new Dataset(`Mean note for ${sem.toUpperCase()} EMD1`, y1, backgroundColor= 'rgba(54, 162, 235,0.7)',borderColor= 'rgba(54, 162, 235,1)')]

  if (em2){
    let y2 = modules.map(mod => mod['emd2_mean'])
    datasets.push(new Dataset(`Mean note for ${sem.toUpperCase()} EMD2`, y2 ))
  }
  let data = new Data(x, datasets)
  addData(means, 'line', data, {
      aspectRatio: 1,
      responsive: true,
      scales: {
        y: {
          max: Math.max(...y1) + 2
        }
      }
    })
}
async function main() {
  await fetchData('data.json')

  values_count = drawChart('valuesCount')
  safe = drawChart('safe') 
  means = drawChart('means') 
  avrg_succs = drawChart('avrg_succs') 
  drawValueCount('Analyse')
  drawSucces('s1')
  drawAvrg('s1','emd1')
  drawMeans('s1')
  
}


main()


  
