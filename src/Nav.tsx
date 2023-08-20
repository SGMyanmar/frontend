import { useState, useEffect } from 'react';
import logo from './assets/logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faTruckFast, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import './Nav.css';

export default function Nav() {
    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            const scrollingUp = currentScrollPos < prevScrollPos;

            setPrevScrollPos(currentScrollPos);
            setVisible(scrollingUp || currentScrollPos === 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    return (
        <div
            className={`bg-amber-50 px-8 py-2 sticky top-0 shadow-md z-50 ${visible ? 'nav-visible' : 'nav-hidden'}`}
        >
            <img src={logo} onClick={()=>window.open('/', '_self')} className="cursor-pointer block sm:hidden mx-auto mb-8 w-32"></img>
        <div className="flex flex-row justify-between items-center text-sm sm:text-base mb-4">
        <img src={logo} onClick={()=>window.open('/', '_self')}  className="hidden cursor-pointer sm:block w-32"></img>
        <div className='mb-4 sm:mb-0'>
            <a href='/' className="me-8 text-amber-600 font-normal"><FontAwesomeIcon icon={faHome}></FontAwesomeIcon> Home</a>
            <a href='/form' className="me-8 text-amber-600 font-normal"><FontAwesomeIcon icon={faTruckFast}></FontAwesomeIcon> Online Form</a>
            <a href='/track' className="hidden sm:inline px-8 py-2 rounded-xl bg-amber-600 hover:bg-amber-400 text-amber-100"><FontAwesomeIcon icon={faBoxOpen}></FontAwesomeIcon> Track your parcel</a>
        </div>
        </div>
        <div className="mb-2 block sm:hidden"></div>
        <a href='/track' className="inline sm:hidden px-8 py-2 rounded-xl bg-amber-600 hover:bg-amber-400 text-amber-100"><FontAwesomeIcon icon={faBoxOpen}></FontAwesomeIcon> Track your parcel</a>
        <div className="mb-6 block sm:hidden"></div>
        </div>
    );
}
