//check

var fileTypes = ["csv"]; //acceptable file types

function readURL(files) {
  if (files && files[0]) {
    var extension = files[0].name.split(".").pop().toLowerCase(), //file extension from input file
      isSuccess = fileTypes.indexOf(extension) > -1; //is extension in acceptable types

    if (isSuccess) {
      return true;
    } else {
      alert('File gavno')
      localStorage.removeItem('Last_uploaded_table');
      document.getElementById("output").innerHTML = "";
      return false;
    }
  }
}

window.onload = function () {
  let lastTable = localStorage.getItem("Last_uploaded_table");
  if (!lastTable) {
    return;
  }
  let lines = JSON.parse(lastTable);
  drawOutput(lines);
};

function handleCsv(files) {
  // Check for the various File API support.
  if (window.FileReader) {
    if (readURL(files)){
      getAsText(files[0]);
    }   
  }
  else {
    alert("FileReader are not supported in this browser.");
  }
}

function getAsText(fileToRead) {
  let reader = new FileReader();
  // Read file into memory as UTF-8
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}

function loadHandler(event) {
  let csv = event.target.result;
  processData(csv);
}

function processData(csv) {
  let allTextLines = csv.split(/\r\n|\n/);
  let lines = [];
  for (let i = 0; i < allTextLines.length; i++) {
    let data = allTextLines[i].split(";");
    let tarr = [];
    for (let j = 0; j < data.length; j++) {
      tarr.push(data[j]);
    }
    lines.push(tarr);
  }
  console.log(lines);
  //adding this item to localstorage - array to JSON localstorage
  localStorage.setItem("Last_uploaded_table", JSON.stringify(lines));
  drawOutput(lines);
}

function errorHandler(evt) {
  if (evt.target.error.name == "NotReadableError") {
    alert("Canno't read file !");
  }
}

function drawOutput(lines) {
  //Clear previous data
  document.getElementById("output").innerHTML = "";
  let table = document.createElement("table");
  for (let i = 0; i < lines.length; i++) {
    let row = table.insertRow(-1);
    for (let j = 0; j < lines[i].length; j++) {
      let firstNameCell = row.insertCell(-1);
      firstNameCell.appendChild(document.createTextNode(lines[i][j]));
    }
  }
  document.getElementById("output").appendChild(table);
}
