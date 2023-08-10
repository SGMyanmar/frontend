import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot, faPhone, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import base_url from "./base_url";
import bg from './assets/bg.png'

interface Address {
  id: number;
  country: string;
  address: string;
  phone: string;
}

const Home: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);

  useEffect(() => {
    axios.get(`${base_url()}/api/address`)
      .then(response => {
        setAddresses(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const singaporeAddresses = addresses.filter(address => address.country === "singapore");
  const myanmarAddresses = addresses.filter(address => address.country === "myanmar");

  return (
    <div className="">
        <div className="w-screen h-screen absolute top-0 left-0 bg-amber-200 opacity-50 -z-10"></div>
        <img className="w-screen h-screen absolute top-0 left-0 cover -z-20 brightness-75" src={bg}></img>
    <h1 className="mt-8 mb-6 text-xl md:text-4xl text-white font-bold text-center">SGMYANMAR LOGISTICS SERVICE</h1>
    <button onClick={()=>window.open('/form', '_self')} className="mb-14 px-12 py-4 bg-lime-500 border-white border-2 text-white hover:bg-lime-400 rounded-xl mx-auto block text-lg"><FontAwesomeIcon icon={faTruckFast}></FontAwesomeIcon> Submit an online form</button>
    <div className="bg-lime-50 shadow-md p-8 rounded-xl">
      <div className="my-12">
        <h2 className="mb-6 text-lg text-amber-600 font-bold">Singapore Addresses</h2>
        <div className="flex flex-row flex-wrap justify-start">
          {singaporeAddresses.map(address => (
            <div key={address.id} className="address-card me-0 sm:me-8 mb-6 p-4 bg-white rounded-xl">
              <p className="mb-2"> <FontAwesomeIcon className="me-4 text-amber-800" icon={faMapLocationDot}></FontAwesomeIcon> {address.address}</p>
              <p> <FontAwesomeIcon className="me-4 text-amber-800" icon={faPhone}></FontAwesomeIcon> {address.phone}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="my-12">
      <h2 className="mb-6 text-lg text-amber-600 font-bold">Myanmar Addresses</h2>
        <div className="flex flex-row flex-wrap justify-start">
          {myanmarAddresses.map(address => (
            <div key={address.id} className="address-card sm:me- mb-6 p-4 bg-white rounded-xl">
              <p className="mb-2"> <FontAwesomeIcon className="me-4 text-amber-800" icon={faMapLocationDot}></FontAwesomeIcon> {address.address}</p>
              <p> <FontAwesomeIcon className="me-4 text-amber-800" icon={faPhone}></FontAwesomeIcon> {address.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default Home;
