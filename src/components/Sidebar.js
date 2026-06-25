import React from 'react';

function Sidebar({ activeSection, onNavClick, isOpen }) {
    const navItems = [
        { id: 'form-section', label: 'Create Record' },
        { id: 'records-section', label: 'Manage Records' }
    ];

    return (
        <aside className={`sidebar ${!isOpen ? 'hidden' : ''}`}>
            <div className="brand">Form Manager</div>
            <nav className="nav-links">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => onNavClick(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer">
                © 2024 Form Manager
            </div>
        </aside>
    );
}

export default Sidebar;
