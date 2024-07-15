import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import '../styles/Home.css'
const Home = () => {
  const rooms = [
    {
      text:"Unforgettable Memories Await at Our Delightful Guest House.",
      image: 'https://www.thespruce.com/thmb/2_Q52GK3rayV1wnqm6vyBvgI3Ew=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/put-together-a-perfect-guest-room-1976987-hero-223e3e8f697e4b13b62ad4fe898d492d.jpg'
    },
    {
      text:"Experience Luxury That Fits Your Budget.",
      image: 'https://hips.hearstapps.com/hmg-prod/images/guest-bedroom-1-1576617523.jpg'
    },
    {
      text:"Indulge in Luxury, Choose Our Guest House for Your Stay.",
      image: 'https://www.marthastewart.com/thmb/9Fkuck9OK7P9-vJ1RO2Eo_TGLlw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/guest-bedroom-ideas-1-1114-ca3c1e61b40241f28d872251b632d071.jpeg'
    }
  ];

  return (
    <div className="home-page">
      <Navbar/>
      <Carousel showArrows={true} showThumbs={false} infiniteLoop={true} autoPlay={true}>
        {rooms.map((room, index) => (
          <div key={index} style={{ position: 'relative', height: '550px' }}>
            <img src={room.image} alt={room.name} style={{ height: '550px' }} />
            <div className='book'>
              <h3>{room.text}</h3>
            <Link to='/login' className='book-link'>Book now</Link>
            </div>
          </div>
        ))}
      </Carousel>
      <div className="about-us">
        <img 
          src="https://cf2.bstatic.com/xdata/images/hotel/square600/576523782.webp?k=4c287654b2d33a51ac6f401c89dfb37cbf64a12373ba37797c85b58083a9962f&o="
          alt="About Us"
          className="about-us-image"
        />
        <div className="about-us-text">
          <h2>About Us</h2>
          <p>We provide world-class accommodations with the highest priority on customer satisfaction. All properties are verified by the owners to ensure a secure and trustworthy booking experience.</p>
        </div>
      </div>
      <div className="about-us">
        <img 
          src="https://www.cureuppharma.in/wp-content/uploads/2018/12/why-choose-us.png"
          alt="About Us"
          className="about-us-image"
        />
      <div className="slogan">
        <h2>Why Choose Us?</h2>
        <p>Your comfort is our priority. Discover the perfect place to stay, verified by trusted owners worldwide.</p>
      </div>
      </div>
      <div className="cta">
        {/* <Link to="/about" className="cta-button">Learn More About Us</Link> */}
        
      </div>
    </div>
  );
};

export default Home;
