import React from 'react';

function LoadingIndicator({ isLoading, progress, message }) {
    if (!isLoading) return null;

    return (
        <div className="loading-container">
            {progress !== undefined ? (
                <div>
                    <progress value={progress} max="100" />
                    <span>{progress}%</span>
                </div>
            ) : (
                <div className="spinner" />
            )}
            {message && <p>{message}</p>}
        </div>
    );
}

export default LoadingIndicator;