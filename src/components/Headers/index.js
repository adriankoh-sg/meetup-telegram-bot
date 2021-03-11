import React from 'react';

const Header = () => {
    return (
        <nav className="navbar navbar-expand-sm navbar-light bg-light">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                        <a className="nav-link" href="/">Events</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/broadcast">Broadcast</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/subscribers">Subscribers</a>
                        </li>
                        <li className="nav-item">
                        <a className="nav-link" href="/settings">Settings</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
 
export default Header;