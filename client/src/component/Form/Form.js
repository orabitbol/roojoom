import React, { useState, useEffect } from 'react'
import "./form.css";
import Axios from 'axios'
import { Button, TextField } from '@mui/material';
import { SegmentedControl } from 'segmented-control'

const Form = () => {

    const [userId, setUserId] = useState();
    const [serialNumber, setSerialNumber] = useState("");
    const [problemDes, setProblemDes] = useState("");
    const [indicator1, setIndicator1] = useState("");
    const [indicator2, setIndicator2] = useState("");
    const [indicator3, setIndicator3] = useState("");
    const [status, setStatus] = useState("");

    const [date, setDate] = useState(new Date().toLocaleString());

    const addReportToDataBase = (status) => {
        Axios.post("http://localhost:5000/create", {
            userId: userId,
            serialNumber: serialNumber,
            problemDes: problemDes,
            date: date,
            status: status,
            indicator1: indicator1,
            indicator2: indicator2,
            indicator3: indicator3,

        }).then(response => {
            console.log("create-db: " + response.data)
        })
    }

    const responseStatus = (e) => {
        e.preventDefault();
        let arr = [indicator1, indicator2, indicator3];
        Axios.post("http://localhost:5000/responsestatus", {
            serialNumber: serialNumber,
            indicator1: indicator1,
            indicator2: indicator2,
            indicator3: indicator3,

        }).then(response => {
            addReportToDataBase(response.data);
            setStatus(response.data);
        })
    }

    return (
        <div className='root-form'>
            <div>
                <h1>Fault Report</h1>

                <form className="form">
                    <div className="form-wapper">
                        <div className="position-text">
                            <TextField
                                type="number"
                                label="User-Id"
                                value={userId || ""}
                                onChange={(e) => setUserId(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-wapper">
                        <div className="position-text">
                            <TextField
                                label="device-serial-number"
                                type="text"
                                value={serialNumber}
                                onChange={(e) => setSerialNumber(e.target.value)}
                                required
                                inputProps={{
                                    maxLength: 64
                                }} />
                        </div>
                    </div>

                    <div className="form-textarea" >
                        <textarea
                            className="problem-description"
                            rows="4"
                            maxLength="300"
                            placeholder='Problem description'
                            value={problemDes}
                            onChange={(e) => setProblemDes(e.target.value)}
                            required >
                        </textarea>
                    </div>

                    <div className="segmented-control">
                        <div className='oneDisabled'>
                            <SegmentedControl
                                name="oneDisabled"
                                options={[
                                    { label: "On", value: "on", default: true },
                                    { label: "Off", value: "off" },
                                    { label: "Blinking", value: "blinking", },
                                ]}
                                setValue={newValue => setIndicator1(newValue)}
                                style={{ width: 400, color: '#1565c0' }} />
                        </div>

                        <div className='twoDisabled'>
                            <SegmentedControl
                                name="twoDisabled"
                                options={[
                                    { label: "On", value: "on", default: true },
                                    { label: "Off", value: "off" },
                                    { label: "Blinking", value: "blinking", },
                                ]}
                                setValue={newValue => setIndicator2(newValue)}
                                style={{ width: 400, color: '#1565c0' }} />
                        </div>

                        <div className='threeDisabled'>
                            <SegmentedControl
                                name="threeDisabled"
                                options={[
                                    { label: "On", value: "on", default: true },
                                    { label: "Off", value: "off" },
                                    { label: "Blinking", value: "blinking", },
                                ]}
                                setValue={newValue => setIndicator3(newValue)}
                                style={{ width: 400, color: '#1565c0' }} />
                        </div>
                    </div>

                    <div className='button'>
                        <Button onClick={responseStatus} variant="contained">submit</Button>
                    </div>

                    <div className='result'>
                        <h2>{status}</h2>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form