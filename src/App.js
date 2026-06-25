import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import RecordForm from './components/RecordForm';
import RecordList from './components/RecordList';

function App() {
    const [activeSection, setActiveSection] = useState('form-section');
    const [records, setRecords] = useState([]);
    const [editId, setEditId] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);

    // Load records from localStorage on mount
    useEffect(() => {
        const savedRecords = localStorage.getItem('records');
        if (savedRecords) {
            try {
                setRecords(JSON.parse(savedRecords));
            } catch (e) {
                console.error('Failed to load records:', e);
            }
        }
    }, []);

    // Save records to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('records', JSON.stringify(records));
    }, [records]);

    // Handle window resize for responsive sidebar
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setSidebarOpen(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSaveRecord = (formData) => {
        if (editId) {
            // Update existing record
            setRecords(records.map(record =>
                record.id === editId
                    ? { ...record, ...formData }
                    : record
            ));
            setEditId(null);
        } else {
            // Create new record
            const newRecord = {
                id: Date.now(),
                ...formData,
                createdAt: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                })
            };
            setRecords([newRecord, ...records]);
        }
    };

    const handleDeleteRecord = (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            setRecords(records.filter(record => record.id !== id));
        }
    };

    const handleEditRecord = (id) => {
        setEditId(id);
        setActiveSection('form-section');
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    const handleCancelEdit = () => {
        setEditId(null);
    };

    const getEditingRecord = () => {
        return editId ? records.find(r => r.id === editId) : null;
    };

    const handleNavClick = (section) => {
        setActiveSection(section);
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    return (
        <div className="app-shell">
            <Sidebar
                activeSection={activeSection}
                onNavClick={handleNavClick}
                isOpen={sidebarOpen}
            />
            <main className="content">
                <header className="topbar">
                    <h1>Responsive Record Manager</h1>
                    <button
                        className="toggle-menu"
                        aria-label="Toggle navigation"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        ☰
                    </button>
                </header>

                <section id="form-section" className={`panel ${activeSection === 'form-section' ? 'active-panel' : ''}`}>
                    <RecordForm
                        onSave={handleSaveRecord}
                        editingRecord={getEditingRecord()}
                        onCancelEdit={handleCancelEdit}
                    />
                </section>

                <section id="records-section" className={`panel ${activeSection === 'records-section' ? 'active-panel' : ''}`}>
                    <RecordList
                        records={records}
                        onDelete={handleDeleteRecord}
                        onEdit={handleEditRecord}
                    />
                </section>

                {/* <section id="help-section" className={`panel ${activeSection === 'help-section' ? 'active-panel' : ''}`}> */}
                {/* <Help /> */}
                {/* </section> */}
            </main>
        </div>
    );
}

export default App;
