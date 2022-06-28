import React, {useState} from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { UserSidebarData } from './SidebarData';
 // eslint-disable-next-line
import './UserNavbar.css';
import { IconContext } from 'react-icons';

function UserNavbar() {
    const [sidebar, setSidebar] = useState(true)
    const showSidebar = () => setSidebar(!sidebar)
    return (
        <>
        <IconContext.Provider value={{color: 'black'}}>
            <div className="User-navbar-toggle">
                <Link to="#" classNmae='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
            </div>
            <nav className={sidebar ? 'User-nav-menu active' : 'User-nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className="User-navbar-toggle">
                        <Link to="#" className='menu-bars'>
                            <FaIcons.FaBars /><span>User Dashboard</span>
                        </Link>
                    </li>
                    {UserSidebarData.map((item, index) => {
                        return(
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </IconContext.Provider>
        </>
    )
}


export default UserNavbar;
