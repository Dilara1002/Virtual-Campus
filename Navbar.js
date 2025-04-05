import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Button } from './Button';
function Navbar() {
    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false);
        } else {
            setButton(true);
        }
    }

    window.addEventListener('resize', showButton);
    return (
        <div>
            <>
                <nav className="navbar">
                    <div className="navbar-container">
                        <Link to="/" className="navbar-logo">
                            <img src="/Kbu.Logo.png" alt="Logo" className="logo" /> <span className="text-xl font-semibold">KARABÜK UNIVERSITY</span>
                        </Link>
                        <div className='menu-icon' onClick={handleClick}>
                            <i className={click ? 'fa fa-times' : 'fas fa-bars'} />
                        </div>

                        <ul className={`md:flex md:justify-center md:space-x-4 font-medium ${click ? 'flex flex-col items-center space-y-4 mt-4' : 'hidden'}`}>

                            <li className='nav-item'>
                                <Link to="/home" className="hidden md:flex justify-center space-x-4 font-medium" onClick={closeMobileMenu}>
                                    Home
                                </Link>
                            </li>
                            <li className='nav-item'>
                                <Link to="/profile" className="nav-links" onClick={closeMobileMenu}>
                                    Profile
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link to="/exams" className="nav-links" onClick={closeMobileMenu}>
                                    Exams
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link to="/homeworks" className="nav-links" onClick={closeMobileMenu}>
                                    Homeworks
                                </Link>
                            </li>


                            <li className='nav-item'>
                                <Link to="/lectures" className="nav-links" onClick={closeMobileMenu}>
                                    Lectures
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link to="/timetable" className="nav-links" onClick={closeMobileMenu}>
                                    TimeTable
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link to="/announcements" className="nav-links" onClick={closeMobileMenu}>
                                    Announcements
                                </Link>
                            </li>

                            <li className='nav-item'>
                                <Link to="/chats" className="nav-links" onClick={closeMobileMenu}>
                                    Chats
                                </Link>

                            </li>


                        </ul>

                        {button && <Button buttonStyle='btn--outline'>SIGN UP</Button>}
                    </div>
                </nav>


            </>
        </div>
    )
}

export default Navbar
