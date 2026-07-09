import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Footer from './components/Footer';
import axios from 'axios';
import { Link } from 'react-router';

const Admin = () => {
    const downloadLink = "https://asubeb.esbatech.org/attendance/Download.php";
    const downloadLink2 = "https://asubeb.esbatech.org/attendance/Download2.php";
    const resetLink = "https://asubeb.esbatech.org/attendance/Reset.php";
    const updateLink = "https://asubeb.esbatech.org/attendance/Update.php";
    const [startDownload, setStartDownload] = useState(false);
    const [startDownload2, setStartDownload2] = useState(false);
    const [startUpdate, setStartUpdate] = useState(false);
    const [startReset, setStartReset] = useState(false);
    const [resetNote, setResetNote] = useState("Reset");
    const [updateNote, setUpdateNote] = useState("Update");

    const API_KEY = 'pk.755484fc63e9f72aedb24655d1ed965f';

    // const [location, setLocation] = useState(`https://eu1.locationiq.com{API_KEY}&lat=${lat}&lon=${lon}&format=json&accept-language=en`);

    const fetchLocation = () => {
        let api = `https://eu1.locationiq.com${API_KEY}&lat=${lat}&lon=${lon}&format=json&accept-language=en`;
    }

    const action = (e) => {
        let id = e.target.id;

        const now = new Date();

        const day = now.getDate();        // d
        const month = now.getMonth() + 1; // m (0-indexed, so +1)
        const year = now.getFullYear();   // y

        const formattedDate = `${day}_${month}_${year}`;

        switch(id) {
            case 'download':
                const downloadData = async () => {
                    try {
                        setStartDownload(true);
                        const response = await axios.get(downloadLink, {
                            responseType: 'blob',
                        });

                        //let's create a URL for the downloaded data
                        const url = window.URL.createObjectURL(new Blob([response.data]));

                        //create a hidden link 
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'attendance_report_'+formattedDate+'.csv');

                        document.body.appendChild(link);
                        link.click();

                         // Cleanup
                        link.parentNode.removeChild(link);
                        window.URL.revokeObjectURL(url);
                        setStartDownload(false);
                    } catch (err) {
                        setStartDownload(false);
                    }
                }
                downloadData();
                break;
            case 'download2':
                const downloadData2 = async () => {
                    try {
                        setStartDownload2(true);
                        const response = await axios.get(downloadLink2, {
                            responseType: 'blob',
                        });

                        //let's create a URL for the downloaded data
                        const url = window.URL.createObjectURL(new Blob([response.data]));

                        //create a hidden link 
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'attendance_report_not_reg_'+formattedDate+'.csv');

                        document.body.appendChild(link);
                        link.click();

                         // Cleanup
                        link.parentNode.removeChild(link);
                        window.URL.revokeObjectURL(url);
                        setStartDownload2(false);
                    } catch (err) {
                        setStartDownload2(false);
                    }
                }
                downloadData2();
                break;
            case 'update':
                 const updateTable = async () => {
                    setStartUpdate(true);
                    try {
                        const response = await axios.get(updateLink);
                        console.log(response.data);
                        if (response.status === 200 && response.data.code === "sw321") {
                            setStartUpdate(false);
                            setUpdateNote("Updated");
                            setTimeout(() => {
                                setUpdateNote("Update");
                            }, 3000);
                        }
                    } catch (err) {
                        setUpdateNote("Error");
                        setTimeout(() => {
                            setStartUpdate(false);
                            setUpdateNote("Update");
                        }, 3000);
                    }
                 }
                 updateTable();
                break;
            case 'reset':
                //write code to reset table
                const resetTable = async () => {
                    setStartReset(true);
                    try {
                        const response = await axios.get(resetLink);
                        // console.log(response.data);
                        if (response.status === 200 && response.data.code === "sw321") {
                            setStartReset(false);
                            setResetNote("Done");
                            setTimeout(() => {
                                setResetNote("Reset");
                            }, 3000);
                        }
                    } catch(err) {
                        setResetNote("Error");
                        setTimeout(() => {
                            setStartReset(false);
                            setResetNote("Reset");
                        }, 3000);
                    }
                }
                resetTable();
                break;
        }
    }

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav/>

        <div className="grow">
            <section className='flex flex-wrap items-center justify-center w-full pt-40 gap-4'>
                {startDownload == true ?
                    <button className="btn btn-secondary">
                        <span className="loading loading-spinner"></span>
                        Downloading...
                    </button>
                :
                    <button onClick={action} id='download' className='btn btn-primary'>Download Attendance</button>
                }

                {startDownload2 == true ?
                    <button className="btn btn-secondary">
                        <span className="loading loading-spinner"></span>
                        Downloading...
                    </button>
                :
                    <button onClick={action} id='download2' className='btn btn-primary'>Download Not On Portal</button>
                }

                {startUpdate == true ?
                    <button className="btn btn-secondary">
                        <span className="loading loading-spinner"></span>
                        Updating...
                    </button>
                :
                    <button onClick={action} id='update' className='btn btn-accent'>Update Table</button>
                }

                {startReset == true ?
                    <button className="btn btn-secondary">
                        <span className="loading loading-spinner"></span>
                        Resetting...
                    </button>
                :
                    <button onClick={action} id='reset' className='btn btn-warning text-black'>
                        {resetNote}
                    </button>
                }
            </section>
        </div>

      <Footer/>
    </div>
  )
}

export default Admin
