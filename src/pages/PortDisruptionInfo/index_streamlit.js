import React, { useEffect, useRef } from 'react';

const PortDisruptionInfo = () => {

    const handleDisruptionInfo = () => {
        // Redirect to the specified URL
        window.location.href = '/portdisruption';
    };

    const localhostUrl = 'http://18.141.34.124:8501/';

    const goBack = () => {
        window.location.href = `http://localhost:3000/data-synthesizer`;
    };


    return (

        <>

            <div className='flex mb-2'>
                <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm' onClick={handleDisruptionInfo}>
                    Port Disruption Info
                </button>
            </div>
            <div>

                <button onClick={goBack}>back</button>
            </div>
            <div className="procurement-title flex mb-2">
                <h1>DISRUPTION MONITORING</h1>
            </div>
            <div className='datasynthesizer'>
                <iframe
                    title="Embedded JavaScript Content"
                    src={localhostUrl}
                    width="100%"
                    height='1200vh'
                ></iframe>
            </div></>
    );
};

export default PortDisruptionInfo;