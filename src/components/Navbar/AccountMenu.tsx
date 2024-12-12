
const AccountMenu = () => {

    return (
        <div className="account-menu">
            <div className="menu-section">
                <div className="menu-item">
                    <img src="images/user.png" alt="Profile Icon" className="account-icon"/>
                    <span>Profile</span>
                </div>
                <div className="menu-item">
                    <img src="images/user.png" alt="My Account Icon" className="account-icon" />
                    <span>My Account</span>
                </div>
            </div>
            <hr />
            <div className="menu-section">
                <div className="menu-item">
                    <img src="images/add-user.png" alt="Add Another Account Icon" className="account-icon" />
                    <span>Add another account</span>
                </div>
                <div className="menu-item">
                    <img src="images/setting.png" alt="Settings Icon" className="account-icon" />
                    <span>Settings</span>
                </div>
                <div className="menu-item">
                    <img src="images/logout.png" alt="Logout Icon" className="account-icon" />
                    <span>Log Out</span>
                </div>
            </div>
        </div>
    );
};

export default AccountMenu;