const puppeteer = require('puppeteer');
const { expect, assert }  = require('chai');
const tv4 = require('tv4');
const environment = require('../environment.json');



let URL = environment.values[0].value;
const HEADLESS = true;
const TIMEOUT = 12000;
const EXAMMODE = false;


let browser;
let page;
let requests = [];
let reqCount =0;

const viewports = {
    "mobile": {
        height: 731,
        width: 411
    },
    "pc": {
        height: 850,
        width: 1000
    }
};

function lastRequest(){
    return requests[reqCount - 1];
}

before(async function(){
    this.timeout(TIMEOUT);
    browser = await puppeteer.launch({ headless: HEADLESS,  defaultViewport: null,  args: ['--no-sandbox', '--disable-setuid-sandbox']});
    page = await browser.newPage();
    await page.setRequestInterception(true);
    await page.emulateMedia("screen");

    page.on('request', request => {
        if(request.url().includes(URL)){
            requests.push({
                url:request.url(),
                data: request.postData(),
                method: request.method(),
                response: request.response()
            });
            reqCount++;
        }
        request.continue();
    });

    await page.goto(URL, { waitUntil: 'networkidle2'});
});

function getInnerText(selector){
  return page.evaluate(selector=>document.querySelector(selector).innerText, selector);
}

function checkElements(elements){
  for(let [name, ele] of Object.entries(elements)){
    it(`Should have ${name}`, async()=>{
      expect(await page.$(ele)).to.be.ok;
    });
  }
}

function pause(timeout) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("resolved");
    }, timeout);
  });
}

async function getStyles(selector){
  return await page.evaluate(selector => {
    try{
      return JSON.parse(
        JSON.stringify(
          getComputedStyle(document.querySelector(selector)
        ))
      );
    }catch(e){
      return null;
    }
 
  }, selector);
}

function getHTML(selector){
  return page.evaluate(selector=>{
    try{
      return document.querySelector(selector).outerHTML;
    }catch(e){
      return null;
    }
  }, selector);
}

function runCases(cases){
  cases.forEach(async testcase => {
    let {text, selector, property, value, mode, debug} = testcase;
    return it(text, async ()=>{
        await page.setViewport(viewports[mode]);
        let styles = await getStyles(selector);
        if(debug)console.log('Debug:', styles);
        if(EXAMMODE){
            let ans = styles[property] === value ? true : "Found unexpected style for element";
            expect(ans).to.be.true;
        }else{
            expect(styles[property]).to.eql(value);
        }
    });
  })
}

context('Lab Exam', () => {

    describe('Test Suite 1: All <main> elements of the page', async ()=>{
        let mode = 'pc';
        let selector = 'main';
        runCases([
            { mode, text:'#1.1 All main element must have a spacing of 70px outside of its top border \t| 1 mark', selector, property:'marginTop', value:'70px'},
            { mode, text:'#1.2 Should be displayed using flex layout \t| 1 mark', selector, property:'display', value:'flex'},
            { mode, text:'#1.3 should layout its children vertically in a column \t| 1 mark', selector, property:'flexDirection', value:'column'},
        ]);
    });

    describe('Test Suite 2: All section and figure elements', async ()=>{
        let mode = 'pc';
        let selector = 'section, figure';
        runCases([
            { mode, text:'#2.1 should be displayed as flex layout \t| 1 mark', selector, property:'display', value:'flex'},
            { mode, text:'#2.2 should have its content justified to the center \t| 1 mark', selector, property:'justifyContent', value:'center'},
            { mode, text:'#2.3 should be layout its children as a column \t| 1 mark', selector, property:'flexDirection', value:'column'},
        ]);
    
    });

    describe('Test Suite 3: The media tab', async ()=>{
        
        it('#3.1 Should have at least 27 elements with the class "card" loaded on the page \t| 2 marks', async ()=>{
           await page.click("#mediaTab");
            let cards = await page.$$('.card');
            expect(cards.length).to.gt(26);
        });

        it('#3.2 Should should make an http GET request to {{your-server}}/records \t| 2 marks', async ()=>{
            let found = false;
            for(let req of requests){
                if(req.url === `${URL}/records` && req.method === "GET")
                    found = true;
            }
            expect(found).to.be.true;
        });
    
    });

    describe('Test Suite 4: The form named "createform"', async ()=>{
        it('#4.1 Should send a post request to {{your server}}/records when submitted \t| 4 marks', async ()=>{
           await page.click("#mediaTab");
           await page.click("#addFab");
           await page.type('[name="password"]', 'MYSECRET');
           await page.type('[name="updateNum"]', '50');
           await page.type('[name="url"]', "https://google.com");
           await page.type('[name="date"]', "02042020");
           await page.type('[name="imported"]', '5');
           await page.type('[name="contact"]', '5');
           await page.type('[name="community"]', '5');
           await page.type('[name="deaths"]', '5');
           await page.type('[name="tested"]', '5');
           await page.keyboard.press('Enter');
            let found = false;
            for(let req of requests){
                if(req.url === `${URL}/records` && req.method === "POST")
                    found = true;
            }
           
           expect(found).to.be.true;
        });

        it('#4.2 should send the post data in the specified format \t| 4 marks', async ()=>{
            var schema = {
                    "type": "object",
                    "properties": {
                        "date":{"type":"number"},
                        "updateNum":{"type":["number", "string"]},
                        "url":{"type":"string"},
                        "tested":{"type":["number", "string"]},
                        "password": {"type":"string"},
                        "cases":{
                            "type":"object",
                            "properties":{
                                "deaths": {"type": ["number", "string"]},
                                "imported":{"type":["number", "string"]},
                                "community":{"type":["number", "string"]},
                                "contact":{"type":["number", "string"]},
                            }
                        },
                    },
                    "required": ["date", "password", "updateNum", "url", "cases", "tested"]
            };

            let data = {};

            for(let req of requests){
                if(req.url === `${URL}/records` && req.method === "POST"){
                    data = JSON.parse(req.data);
                }
            }
            let isValid = tv4.validate(data, schema);
            expect(isValid).to.be.true;
        });

    });

    // describe('Test Suite 5: The form named "deleteform"', async ()=>{
    //     it('#5.1 should be able to send a delete request to {{your server}}/request/5 when submitted \t| 6 marks', async ()=>{
    //         await page.click("#statusTab");
    //         await page.click("#mediaTab");
    //         await page.click("#del5");
    //         await page.type('[name="password2"]', 'MYSECRET');
    //         await page.keyboard.press('Enter');
    //         let found = false;
    //         for(let req of requests){
    //             if(req.url === `${URL}/records/5` && req.method === "DELETE")
    //                 found = true;
    //         }
    //         expect(found).to.be.true;
    //     });

    //     it('#5.2 should send the delete data in the specified format \t| 4 marks', async ()=>{
    //         var schema = {
    //                 "type": "object",
    //                 "properties": {
    //                     "password": {"type":"string"}
    //                 },
    //                 "required": ["password"]
    //         };

    //         let data = {};

    //         for(let req of requests){
    //             if(req.url === `${URL}/records/5` && req.method === "DELETE"){
    //                 data = JSON.parse(req.data);
    //             }
    //         }
    //         let isValid = tv4.validate(data, schema);
    //         expect(isValid).to.be.true;
    //     });
    // });

})


after(async () => {
  await browser.close();
});