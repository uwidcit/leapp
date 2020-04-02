function convertToLineData(data){
    let categories = [];
    let tested = [];
    let imported = [];
    let deaths = [];
    let community = [];
    let contact = [];

    let uniqeDates = {};

    let i =0;
    for (let ele of data){
        if(ele.date in uniqeDates){
            //console.log('replacing', data[i-1], 'with ', ele);
            tested[i -1] = ele.tested;
            imported[i -1] = ele.cases.imported;
            deaths[i - 1] = ele.cases.deaths;
            community[i - 1] = ele.cases.community;
            contact[i - 1] = ele.cases.contact;
        }else{
            categories.push(`Day ${i}`);
            tested.push(ele.tested);
            imported.push(ele.cases.imported);
            deaths.push(ele.cases.deaths);
            community.push(ele.cases.community);
            contact.push(ele.cases.contact);
            uniqeDates[ele.date] = true;
            i++;
        }
    }
    
    return {
        categories,
        imported,
        deaths,
        tested,
        community,
        contact,
    };
}

function displayLineChart(chartData){

   let {categories, tested, imported, community, contact} = convertToLineData(chartData);

   let style = {
        fontFamily: 'monospace',
        color: "white",
        fontSize: "15px"
    };

    let dataLabels = {
        style:{
            fontSize: "15px"
        }
    }
    
   Highcharts.chart('linechart', {
    chart: {
        type: 'line',
        backgroundColor:'transparent',
        height: '500px',
        scrollablePlotArea: {
            minWidth: 600,
            scrollPositionX: 0
        }
    },
    title: {
        text: undefined,
        style,
        useHtml: true,
    },
    tooltip: {
        pointFormat: '<b>{point.y} cases were {point.series.name}</b>'
    },
    xAxis: {
        categories,
        labels: {
            style
        }
    },
    yAxis: {
        title: {
            text: undefined,
            useHtml: true,
            style:{
                color: 'white',
                fontSize :'12px'
            },
        },
        labels: {
            enabled: false
        }
    },
    plotOptions: {
        line: {
            dataLabels: {
                enabled: true,
                style: {
                fontFamily: 'monospace',
                color: "white"
            }
        },
        enableMouseTracking: true,

        }
    },
    legend : {
    	itemStyle:{
      	color: 'white'
      }
    },
    series: [
      {
          name: 'Imported',
          data: imported,
          dataLabels,
          label:{
             enabled: false,
          }
      },
      {
          name: 'Tested',
          data: tested,
          dataLabels,
          label:{
             enabled: false,
          }
      },
       {
          name: 'Community',
          data: community,
          dataLabels,
          label:{
             enabled: false,
          }
      },
      {
          name: 'Contact',
          data: contact,
          dataLabels,
          label:{
             enabled: false,
          }
      }
    ],
    responsive: {
        rules: [{
            condition: {
                maxWidth: '800px'
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }
});

}

function displayPieChart({cases}){
    let data = [
         {
            name: 'Imported',
            y: cases.imported
        },
        {
            name: "Community",
            y: cases.community,
        },
        {
            name: "Contact",
            y: cases.contact,
        },
    ]

    let style = {
        fontFamily: 'monospace',
        color: "white",
        fontSize: "15px"
    };

    Highcharts.chart('piechart', {
    chart: {
        plotBackgroundColor: 'transparent',
        backgroundColor:'transparent',
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        zoomType:'xy'
    },
    title: {
        text: undefined,
        style,
        useHtml: true,
    },
    tooltip: {
        pointFormat: '<b>{point.y} persons tested positive are {point.name}</b>'
    },
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    legend : {
    	itemStyle:{
      	color: 'white'
      }
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Cases',
        colorByPoint: true,
        data,
    }]
});
}

function displayLastRecord(data){
    document.querySelector('#cases').innerHTML = data.cases.imported + data.cases.community;
    document.querySelector('#date').innerHTML = new Date(data.date*1000).toLocaleDateString('en-US');
    document.querySelector('#updateNum').innerHTML = data['updateNum'];
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
