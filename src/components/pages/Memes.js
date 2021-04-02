import React from 'react';
import axios from 'axios';
import { Button } from '../Button';

import redditImageFetcher from 'reddit-image-fetcher'
import { useState, useLayoutEffect } from 'react'


const Memes = () => {
  const [imglink, setimglink] = React.useState("")
  const [counter, setCounter]= React.useState(0)

  const fn = () => {
    setCounter(counter + 1);
    console.log(counter);
  };

  useLayoutEffect(()=> {
  redditImageFetcher.fetch()
    .then(result => {
      setimglink(result[0].image)
    })
}, [counter])

  return (
    <div class="meme_container">
    <div className="sznWrapper">
        <img class="sznImg"
          src={imglink}
          alt="new"/>
  </div>

  <div id="wrapper">
      <button class="button" onClick={fn}>Show me the memes</button>
  </div>
     </div>
  )
}

export default Memes
