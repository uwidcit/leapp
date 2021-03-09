let selected;
const server = "";

//converts a form date value into an integer unix timestamp
function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
}

function displayMedia(data){
    //TO DO: write data as cards inside of #media-list
}

async function postData(data){
    //TO DO: send http post request
    //TO DO: call getData()
}

async function deleteData(id, data){
    //TO DO: send http delete request
    //TO DO: call getData()
}

function createRecord(event){
    //TO DO: get data from form and pass to postData
}

function deleteRecord(event){
    //TO DO: get data form form and pass to deleteData
}

async function getData(){
    
    //TO DO: perfrom http get request

    //TO DO: pass the records to this function
    //TO DO: displayLineChart(records);
    
    //TO DO: pass the records to this function in reverse order
    //TO DO: displayMedia(records);

    //TO DO: pass the last record to these functions
    //TO DO: displayPieChart(lastRecord);
    //TO DO: displayLastRecord(lastRecord);
}

function main(){
    initMaterialize();
    getData();    
    //TO DO: attach createRecord() to the submit event of createForm
    //TO DO: attach deleteRecord() to the submit event of deleteForm
}

//attach main() the load event of window
window.addEventListener('load', main);