import React from 'react';
import HeaderStreaming from './Trainers/HeaderStreaming';


const Streaming = () => {

    return (
        <div>
            <HeaderStreaming />
            <div style={{ width: '360px', padding: '8% 0 0', margin: 'auto' }}>
                <div className="p-field p-grid" style={{ position: 'relative', textAlign: 'center' }}>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/OueSA47Kjxo" frameborder="0" allowfullscreen></iframe>
                </div>
            </div >
        </div>
    )
}
export default Streaming