let selected;
const server = "http://localhost:8080";

//converts a form date value into an integer unix timestamp
function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
}

function displayMedia(data){
    //TO DO: write data as cards inside of #media-list
    const list = document.querySelector('#media-list');
    let html = '';
    for(let item of data){
        html+= `<div class="card" id="card${item.id}">
        <div class="card-content black-text">
            <span class="card-title">Update #: ${item.updateNum}</span>
            <p>Date: ${item.date}</p>
            <p>Tested: ${item.tested}</p>
            <p>Contact: ${item.cases.contact}</p>
            <p>Imported Cases: ${item.cases.imported}</p>
            <p>Community Cases: ${item.cases.community}</p>
        </div>
        <div class="card-action">
            <a href="${item.url}" rel="noopener" target="_blank" style="font-weight: 700" class="red-text darken-2">View on Facebook</a>
            <a href="#deleteModal" id="del${item.id}" class="modal-trigger red-text darken-2" onclick="selected = ${item.id}" style="font-weight: 700">Delete</a>
        </div>
    </div>`;
    }
    list.innerHTML = html;
}

async function sendRequest(url, method, data){
    try{
     
  
      let options = {//options passed to fetch function
          method: method,
      };
  
      if(data)//data will be given for PUT & POST requests
        options.body = JSON.stringify(data);//convert data to JSON string
    
      console.log(url, method);
      let response = await fetch(url, options);
        
      let result = await response.json();//Get json data from response
      
      return result;//return the result
  
    }catch(error){
      return error;//catch and log any errors
    }
  }

async function postData(data){
    //TO DO: send http post request
    //TO DO: call getData()

    getData();
}

async function deleteData(id, data){
    //TO DO: send http delete request
    sendRequest(`${server}/records/${selected}`, 'DELETE', {'password':'MY SECRET'});
    getData();
}

function createRecord(event){
    //TO DO: get data from form and pass to postData
    const form = event.target;
    
     
}

function deleteRecord(event){
    //TO DO: get data form form and pass to deleteData
    
}

async function getData(){
    
    //TO DO: perfrom http get request
    const records = await sendRequest(server+'/records', 'GET');

    // const response = await fetch('http://localhost:8080/records');
    // const records = await response.json();;

    //TO DO: pass the records to this function
    displayLineChart(records);
    
    // //TO DO: pass the records to this function in reverse order
    displayMedia(records.reverse());

    const lastRecord = records.reverse()[0];

    // //TO DO: pass the last record to these functions
    displayPieChart(lastRecord);
    displayLastRecord(lastRecord);
}

function main(){
    initMaterialize();
    getData();    
    //TO DO: attach createRecord() to the submit event of createForm
    //TO DO: attach deleteRecord() to the submit event of deleteForm
    document.querySelector('#createForm').addEventListener('submit', createRecord);
    document.querySelector('#deleteForm').addEventListener('submit', deleteRecord);
}

//attach main() the load event of window
window.addEventListener('load', main);