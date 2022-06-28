import React, {useState} from 'react'
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AdminSidebarData } from './SidebarData';
 // eslint-disable-next-line
import './AdminNavbar.css';
import { IconContext } from 'react-icons';

function AdminNavbar() {
    const [sidebar, setSidebar] = useState(false)
    const showSidebar = () => setSidebar(!sidebar)
    return (
        <>
        <IconContext.Provider value={{color: 'black'}}>
            <div className="navbar-toggle">
                <Link to="#" classNmae='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className="navbar-toggle">
                        <Link to="#" className='menu-bars'>
                            <FaIcons.FaBars /><span>Admin Dashboard</span>
                        </Link>
                    </li>
                    {AdminSidebarData.map((item, index) => {
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

export default AdminNavbar;
