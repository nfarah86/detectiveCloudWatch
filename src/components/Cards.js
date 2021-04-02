import React from 'react'
import  CardItem  from './CardItem'
import './Cards.css'

const Cards = () => {
  return (

       <div className="cards">
        <h1>Logdetective Offerrings</h1>
        <div className="cards__container">
          <div className="cards__wrapper">
            <ul className="cards__items">
              <CardItem
              src='images/detect-log-activities_chart.jpg'
              text="Analyze Logs"
              label="logs"
              path='/logs'
             />

            <CardItem
              src='images/dogMeme-01.jpg'
              text="Scroll through memes"
              label="memes"
              path='/memes'
             />

            </ul>
          </div>
        </div>
      </div>

  )
}

export default Cards
