import React from 'react';

function RecordList({ records, onDelete, onEdit }) {
    return (
        <div className="panel-card">
            <div className="records-header">
                <h2>Saved Records</h2>
                <span className="record-count">
                    {records.length} {records.length === 1 ? 'record' : 'records'}
                </span>
            </div>

            <div className="record-list">
                {records.length === 0 ? (
                    <p className="empty-state">No records yet. Add one from the create form.</p>
                ) : (
                    records.map(record => (
                        <article key={record.id} className="record-card">
                            <div>
                                {record.image ? (
                                    <img src={record.image} alt={record.title} className="record-image" />
                                ) : (
                                    <div className="record-image">No image</div>
                                )}
                            </div>

                            <div className="record-content">
                                <h3>{record.title}</h3>
                                <p>{record.description}</p>
                                {record.url && (
                                    <a
                                        href={record.url}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="record-link"
                                    >
                                        {record.url}
                                    </a>
                                )}
                                {record.notes && <p style={{ fontStyle: 'italic', color: '#6b7280' }}>{record.notes}</p>}
                                <div className="record-meta">
                                    <span>Created: {record.createdAt}</span>
                                    <span>{record.url ? 'Has link' : 'No link'}</span>
                                </div>
                            </div>

                            <div className="record-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => onEdit(record.id)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="danger-btn"
                                    onClick={() => onDelete(record.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
}

export default RecordList;
