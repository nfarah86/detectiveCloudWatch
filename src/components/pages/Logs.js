import React from 'react';
import rockset from '@rockset/client';

import '../../App.css';
import { VictoryBar, VictoryChart, VictoryAxis,VictoryTheme, VictoryStack, VictorySharedEvents, VictoryPie, VictoryLabel, VictoryScatter, VictoryContainer } from 'victory';
import { useState, useLayoutEffect } from 'react'

let IPinfo = require("node-ipinfo");

const apikey = "ih6z3McGXj3mtMvmCxHD52DlbLcgtiJwiiYYG59vTho0Sv1V8Bc0UVYc97Cjr9g6";
const rocksetClient = rockset(apikey);


const Logs = () => {
  // state for getting country
  const [rdata, setrdata] = React.useState([])
  const [ipAddress, setIpAddress] = React.useState("");
  const [countryobj, setcountryobj] = React.useState({})
  const [lengthobj, setlengthobj] = React.useState(0)
  const [counter, setCounter]= React.useState(0)
  const [arrayObjsForData, setArrayObjsForData]= React.useState([{"x": '1',
  "y": 1}
])

// state for dhcp message and date
const [rdatamessage, setrdatamessage]= React.useState([])
const [rdatemessageObj, setrdatemessageObj]= React.useState([])

// Get country of what's attacking the instance
  function getRocksetDataIP() {
   return rocksetClient.queryLambdas.executeQueryLambda("commons", "getIPAddress", "a6a37f26e5d6964a", null)
  .then(response => {
    return response.results;
    })
  }

// convert ip address to country code
let getIP = function() {
  return new Promise((resolve, reject) => {
  const token = "c70219da4df6dd"
  let ipinfo = new IPinfo(token);
  var ipAddressCountryList = [];

  if(rdata.length != 0) {
 // if(rdata.length >= countryobj.length) {
  console.log('this is the length of rdata', rdata.length)
   //var num = rdata.length - objipaddress.length
   //console.log('this is the num of the difference',)
   var newData = rdata.slice(-5) // get an array back

   //console.log("new data", newData)
  // add all the ip addresses to object in state

  for (const data of newData) {
    var ipAddressExtracted =  data['?REGEXP_EXTRACT']
      ipinfo.lookupIp(ipAddressExtracted).then(response => {
      var country = response.country
      ipAddressCountryList.push(country);
        if(ipAddressCountryList.length == newData.length){
          resolve (ipAddressCountryList)
         }
      })
    }
  } else {
    resolve("no data on startup\n")
    }
  })
}

let  reduceList = function(countryListToObject) {
  return new Promise((resolve, reject) => {
      if (countryListToObject == undefined)   {
        reject()
      } else {
        const map = countryListToObject.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
        resolve(map)
      }
    })
  }

 let addListToObj = function(reducedList) {
  var allCountries = {}
  return new Promise((resolve, reject) => {
      for (let [key, value] of  reducedList.entries()) {
        console.log(key + " = " + value)
        if(!Object.keys(countryobj).length) {
          countryobj[key] = value;
        } else if (!countryobj[key]) {
          countryobj[key] = value;
        } else {
          console.log("else statment")
          var oldVal = countryobj[key]
          console.log("oldval after calc", oldVal)
          var newVal = value + oldVal
          console.log("newval after calc", newVal)
          countryobj[key] = newVal
        }
      }
      resolve(countryobj)
  })
}

let getArrayObj = function (receivedObj) {
  var arrayObjs = []
  return new Promise((resolve, reject) => {
    for(let obj in receivedObj) {
      var objName = obj.substring(0,2);
      var objToStore = {}
      objToStore['x'] = objName
      objToStore['y'] = receivedObj[obj]
      arrayObjs.push(objToStore);
    }
    console.log(arrayObjs)
    resolve(arrayObjs)
  })
}


// Isolate day and message to see when ack fails

function getRocksetDataDHCP() {
  console.log("get rockset data")
 return rocksetClient.queryLambdas.executeQueryLambda("commons", "ExtractDateAndDHCP", "6429dfff90e3ad6e", null)
.then(response => {
  return response.results;
  })
}

let aggregateDayAndMessage = function () {
  return new Promise((resolve, reject) => {

    var dateMsgObj = {}
    var arrayDateMsgObjs = []
    var dateString = "0"
    var msgCount = 0

    var newData = rdatamessage.slice(-200)
    console.log("new data", newData)
    for (let i =0; i < newData.length; i++) {
      var messageExtracted = newData[i]['?REGEXP_EXTRACT']
      var dateExtracted =  newData[i]['?REGEXP_EXTRACT0']

      if (dateString == "0" && msgCount == 0) {
        console.log("if statement msg obj")
        dateString = dateExtracted
        msgCount += 1
        Object.assign(dateMsgObj, {"x": dateString, "y":msgCount});
      } else if(dateExtracted != dateString) {
        Object.assign(dateMsgObj, {"x": dateString, "y":msgCount});
        arrayDateMsgObjs.push(dateMsgObj)
        dateMsgObj = {}
        msgCount = 1
        dateString = dateExtracted
      } else if (dateExtracted == dateString ) {
        msgCount += 1
      }
    }

    Object.assign(dateMsgObj, {"x": dateString, "y":msgCount});
    arrayDateMsgObjs.push(dateMsgObj)
    console.log("Date msg obj", dateMsgObj)
    resolve (arrayDateMsgObjs)
  })
}




const fn = () => {
  setCounter(counter + 1);
  console.log(counter);
};

useLayoutEffect(()=> {
  console.log("in layout effect")

  let someAsyncFunction = async () => {
    try {
      let receivedRocksetData = await getRocksetDataIP()
      setrdata(receivedRocksetData)

      let receivedRocksetDHCP = await getRocksetDataDHCP()
      setrdatamessage(receivedRocksetDHCP)

      console.log("DHCP", receivedRocksetDHCP)
      let receivedAggregateDayAndMessage = await aggregateDayAndMessage()
      console.log("received",receivedAggregateDayAndMessage)
      setrdatemessageObj(receivedAggregateDayAndMessage)







      console.log("r data", rdata, "length: ", rdata.length)
      let receivedIPlist = await getIP()
      console.log("received ip list\n", receivedIPlist)
      let receivedReduceList = await reduceList(receivedIPlist)
      console.log("received reduced list", receivedReduceList )
      let receivedObj = await addListToObj(receivedReduceList)
      setcountryobj(receivedObj)
      console.log("receivedobj asyn function", receivedObj)
      console.log("set obj final", countryobj)
      let arrayObj = await getArrayObj(receivedObj)
      setArrayObjsForData(arrayObj)
      console.log("arrayObj for data", arrayObjsForData)
    }
    catch (err) {
    }
  }
  someAsyncFunction()
}, [counter])

return (

    <div class='chart__container'>
      <h1>Logs</h1>
      <button onClick={fn}>add +1 count</button>
      <p>This is a data point {counter} </p>

      <div className="chart__wrapper">
        <div className="pie_chart">


<svg viewBox="0 0 250 350" class="svg">
  <VictorySharedEvents
    events={[{
      childName: ["pie"],
      target: "data",
      eventHandlers: {
        onMouseOver: () => {
          return [{
            childName: ["pie"],
            mutation: (props) => {
              return {
                style: Object.assign({}, props.style, {fill: "tomato"})
              };
            }
          }];
        },
        onMouseOut: () => {
          return [{
            childName: ["pie"],
            mutation: () => {
              return null;
            }
          }];
        }
      }
    }]}
  >
    <g transform={"translate(0, -75)"}>
      <VictoryPie name="pie"
        width={300}
        origin={{ x:150, y: 250 }}
        standalone={false}
        style={{ labels: {fontSize: 10, padding: 15}}}
        labels="This is a label"
        labelComponent={
          <VictoryLabel angle={-45} textAnchor="end"/>
        }

        // set the state for data and put it here data=data
        data=  {arrayObjsForData}
      />
    </g>
  </VictorySharedEvents>
</svg>
<h3 className="pie"> Pie Chart </h3>

</div>


<div class='scatter_chart'>
<VictoryChart

  theme={VictoryTheme.material}
  domainPadding={30}
  domain={{ y: [0, 300] }}
  width={900}
  containerComponent={<VictoryContainer responsive={false} />}
  style={{
    background: {
      fill: "pink"
    },
    labels:
    { fontSize: 12 }
  }}
>
<VictoryAxis
            dependentAxis={true}
            style={{
              grid: { stroke: "grey" }
            }}
          />
          <VictoryAxis tickFormat={x => ``} />

  <VictoryScatter
    style={{data: { fill: "#c43b11" } }}
    size={5}
    data={rdatemessageObj}
    // {arrayObjsForData}
    labels={({ datum }) =>[`${datum.x}`]}
    labelComponent={<VictoryLabel y={330} angle={-45} verticalAnchor={"start"}
  />}
/>
</VictoryChart>
        <h3 className="scatter"> scatter chart </h3>
    </div>
 </div>
 </div>
  )
}

export default Logs
