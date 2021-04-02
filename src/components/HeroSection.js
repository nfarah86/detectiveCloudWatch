import React from 'react';
import '../App.css';
import { Button } from './Button';
import './HeroSection.css';

function HeroSection() {

  var divStyle = {
    backgroundImage: 'url(/images/detectiveBackground-01-01.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  };

  return (
    <div className='hero-container' style={divStyle}>

      <h1>Logdetective</h1>
      <p>What in the world is going on with my logs?</p>
      <div className='hero-btns' >
        <Button
          className='btns'
          path='/logs'
          buttonStyle='btn--outline'
          onClick={console.log('bye')}
          buttonSize='btn--large'>
          Analyze the logs <i class="fas fa-search"/>

        </Button>
        <Button
          className='btns'
          path='/memes'
          buttonStyle='btn--primary'
          buttonSize='btn--large'
          onClick={console.log('hey')}
        >
          De-stress with memes <i className='fas fa-images' />
        </Button>
      </div>
    </div>
  );
}

export default HeroSection;
