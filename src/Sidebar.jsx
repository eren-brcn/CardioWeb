function Sidebar() {
  return (
    <aside className="sidebar" style={{ width: '200px', backgroundColor: '#242424', padding: '20px', height: 'calc(100vh - 60px)', borderRight: '1px solid #444' }}>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ margin: '20px 0' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>🏠 Dashboard</a>
        </li>
        <li style={{ margin: '20px 0' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>📊 Progress</a>
        </li>
        <li style={{ margin: '20px 0' }}>
          <a href="#" style={{ color: 'white', textDecoration: 'none' }}>⚙️ About</a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;