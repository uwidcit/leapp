let selected;
const server = "";

//converts a form date value into unix timestamp
function toTimestamp(strDate){
 var datum = Date.parse(strDate);
 return datum/1000;
}

function displayLastRecord(data){
    document.querySelector('#cases').innerHTML = data.cases.imported + data.cases.community;
    document.querySelector('#date').innerHTML = new Date(data.date*1000).toLocaleDateString('en-US');
    document.querySelector('#updateNum').innerHTML = data['updateNum'];
}

function displayMedia(data){

    let str = "";

    for(let ele of data){
        str+=`
        <div class="card" id="card${ele.id}">
            <div class="card-content black-text">
                <span class="card-title">Update #: ${ele['updateNum']}</span>
                <p>Date: ${(new Date(ele.date*1000)).toLocaleDateString('en-US')}</p>
                <p>Tested: ${ele.tested}</p>
                <p>Contact: ${ele.contact}</p>
                <p>Imported Cases: ${ele.cases.imported}</p>
                <p>Community Cases: ${ele.cases.community}</p>
            </div>
            <div class="card-action">
                <a href="${ele.url}" rel="noopener" target="_blank" style="font-weight: 700" class="red-text darken-2">View on Facebook</a>
                <a href="#deleteModal" id="del${ele.id}" class="modal-trigger red-text darken-2" onclick="selected = ${ele.id}" style="font-weight: 700">Delete</a>
            </div>
        </div>
        `;
    }

    document.querySelector('#media-list').innerHTML = str;
}

async function postData(data){
    let response = await fetch(
        `${server}/records`, 
            {
                method: 'POST',
                body: JSON.stringify(data),
                headers: { 'Content-Type':'application/json' }
            },
    );
    let text = await response.text();
    console.log(text);
    getData();
}

async function deleteData(id, data){
    //make delete request
    let response = await fetch(
    `${server}/records/${id}`, 
        {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: { 'Content-Type':'application/json' }
        },
    );
    let text = await response.text();
    console.log(text);
    getData();
}

function createRecord(event){
    //get data from form and pass to postData
    event.preventDefault();
    let form = event.target.elements;
    let record = {
        password: form['password'].value,
        updateNum: form['updateNum'].value,
        url: form['url'].value,
        date: toTimestamp(form['date'].value),
        cases: {
            deaths: form['deaths'].value,
            imported: parseInt(form['imported'].value),
            community: parseInt(form['community'].value),
            contact: parseInt(form['contact'].value)
        },
        tested: parseInt(form['tested'].value)
    };
    console.log(record);
    postData(record);
}

function deleteRecord(event){
    //get data form form and make delete request
    console.log(selected);//selected is the id of the recored selected for deteletion
    event.preventDefault();
    let form = event.target.elements;
    let data = {
        password: form['password2'].value
    }
    deleteData(selected, data);
}

async function getData(){
    
    let response = await fetch(`${server}/records`);
    let records = await response.json()

    //pass the records to this function
    displayLineChart(records);

    let lastRec = records.reverse()[0];
    
    //pass the records to this function in reverse order
    displayMedia(records);

    //pass the latest record to these functions
    displayPieChart(lastRec);
    displayLastRecord(lastRec);
}

function initMaterialize(){
    M.Tabs.init(document.querySelector(".tabs"));
    const addModal = M.Modal.init(document.querySelector('#addModal'));

    // https://materializecss.com/modals.html
    const deleteModal = M.Modal.init(document.querySelector('#deleteModal'), {
        onOpenStart : function(){
            document.querySelector("#selected").innerHTML = selected;
        }
    });
}


function main(){
    initMaterialize();

    document.forms['createForm'].addEventListener('submit', createRecord);
    document.forms['deleteForm'].addEventListener('submit', deleteRecord);

    getData();    
}


window.addEventListener('load', main);