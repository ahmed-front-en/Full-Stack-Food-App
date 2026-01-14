import React from 'react'
import image2 from '../assets/image2.jpg'
import "../App.css"
import AllRecipes from '../components/AllRecipes'

function Home() {
  return (
    <div>
        <section className='home'>   
             <div className='left'>
                <h1>Share Your Favourite Recipe With The World</h1>
                <p>join our community of food lovers and share your favorite recipes with the world.
                    where it's a family affair, a cultural tradition, or a personal masterpiece, your recipes deserve to be shared and celebrated.
                </p>
                <button>Share Your Recipe</button>
             </div>
              <div className='right'>
                <img src={image2} width="350px"  height="350px" />
              </div>
        </section>
        <div className='bg'> 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#ff5500" fill-opacity="1" d="M0,192L30,186.7C60,181,120,171,180,176C240,181,300,203,360,208C420,213,480,203,540,197.3C600,192,660,192,720,202.7C780,213,840,235,900,218.7C960,203,1020,149,1080,149.3C1140,149,1200,203,1260,208C1320,213,1380,171,1410,149.3L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"></path></svg>  
        </div>

        <AllRecipes />
    </div>
  )
}

export default Home