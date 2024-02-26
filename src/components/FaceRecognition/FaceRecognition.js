import React from 'react';
import './FaceRecognition.css';
import { v4 as uuidv4 } from 'uuid';

const FaceRecognition = ({box, imageUrl}) => {
    const facesDiv = box.map((person) => {
        return <div key={uuidv4()} className='bounding-box' style={{
                    top: person.top_row,
                    bottom: person.bottom_row,
                    left: person.left_col,
                    right: person.right_col}}>
                </div>
    })
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img id="faceRec" alt="" src={imageUrl} style={{width: "500px", height: "auto"}} />
                {facesDiv}
            </div>
        </div>
    );
}

export default FaceRecognition;