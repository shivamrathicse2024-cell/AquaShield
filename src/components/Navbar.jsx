function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <div className="logo-icon">💧</div>

        <div>
          <h2>WaterMonitor</h2>
          <span>Smart Water Quality System</span>
        </div>
      </div>

      <div className="nav-links">
        <a className="active">Dashboard</a>
        <a>History</a>
        <a>Alerts</a>
      </div>

      <div className="system-status">
        <span></span>
        System Online
      </div>

    </nav>
  );
}

export default Navbar;