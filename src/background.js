import browser from 'webextension-polyfill'
import {AtmosfairAPI, Flight} from './lib/api.js'

let api = new AtmosfairAPI()

browser.runtime.onMessage.addListener(processRequest);

async function processRequest(msg) {
    let airports = msg.airports, aircrafts = msg.aircrafts
    let emissionData = []

    for (let position = 0; position + 1 < airports.length; position++) {
        let from = airports[position]
        let to = airports[position+1]
        let aircraft = await api.getAircraftByName(aircrafts[position])
        aircraft = aircraft ? aircraft.iataCode : null
        
        emissionData.push(api.getEmission(new Flight(from, to, aircraft)))
    }
    
    return await Promise.all(emissionData)
}