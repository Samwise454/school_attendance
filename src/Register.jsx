import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Header from './components/Header';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [startLogin, setStartLogin] = useState(false);
    const [btnClass, setBtnClass] = useState("btn btn-success mt-6");//new update
    const [btnNote, setBtnNote] = useState('Mark');
    const [attVal, setAttVal] = useState("");
    const [toggleSubmitModal, setToggleSubmitModal] = useState(false);
    const [animateModal, setAnimateModal] = useState('flex flex-col items-center justify-center');
    const submitData = "https://asubeb.esbatech.org/attendance/registerSubmit.php";//old form

    const [staffData, setStaffData] = useState({
        surname: "",
        middlename: "",
        othername: "",
        lga: "",
        stafftype: "",
        dutypost: "",
        wipernum: "",
        attendance: ""
    });

    const handleAtt = (e) => {
        let id = e.target.id;

        let present = document.querySelector("#present");
        let leave = document.querySelector("#leave");

        switch(id) {
            case "present":
                if (leave.checked) {
                    leave.checked = false;
                }
                else if (present.checked) {
                    setAttVal("present");
                }
                else {
                    setAttVal("");
                }
                break;
            case "leave":
                if (present.checked) {
                    present.checked = false;
                }
                else if (leave.checked) {
                    setAttVal("leave");
                }
                else {
                    setAttVal("");
                }
                break;
        }
    }

    const handleInput = (e) => {
        let id = e.target.id;
        let val = e.target.value;
        setStaffData({...staffData, [id]:val}); 
    }

    const markAttendance = (e) => {
        e.preventDefault();

        setStaffData({...staffData, attendance:attVal}); 
        setToggleSubmitModal(true);
        setAnimateModal('animate__animated animate__backInRight flex flex-col items-center justify-center overflow-hidden');
    }

    const cancelWiper = () => {
        setAnimateModal('animate__animated animate__backOutRight flex flex-col items-center justify-center overflow-hidden');
        setTimeout(() => {
            setToggleSubmitModal(false);
        }, 600);
    }

    const submitWiper = (e) => {
        e.preventDefault();

        let btnclasserror = 'btn btn-secondary mt-6';
        // let btnclasssuccess = 'btn btn-success mt-6';
        let btnnote = "";

        setStartLogin(true);

        const handleBtn = (btnnote, btnclass) => {
            setBtnNote(btnnote);
            setBtnClass(btnclass);

            setTimeout(() => {
                setBtnNote("Submit");
                setBtnClass('btn btn-success mt-6');
            }, 3000);
        }

        const closeAndCancel = (btnnote) => {
            handleBtn(btnnote, btnclasserror);
            setStartLogin(false);
            setTimeout(() => {
                cancelWiper();
            }, 3200);
        }

        if (staffData.attendance === "") {
            btnnote = "Mark Present or On leave";
            closeAndCancel(btnnote);
        }
        else if (staffData.surname == "" || staffData.middlename == "" || staffData.othername == "") {
            btnnote = "Type in names properly";
            closeAndCancel(btnnote);
        }
        else if (staffData.lga == "") {
            btnnote = "Select LGA";
            closeAndCancel(btnnote);
        }
        else if (staffData.stafftype == "") {
            btnnote = "Select Staff type";
            closeAndCancel(btnnote);
        }
        else if (staffData.dutypost == "") {
            btnnote = "Type in duty post";
            closeAndCancel(btnnote);
        }
        else if (staffData.wipernum == "") {
            btnnote = "Enter valid wiper number";
            closeAndCancel(btnnote);
        }
        else {
            //now we run the submit code through the gps code
            // console.log(staffData);
            const sendData = async () => {
                try {
                    const response = await axios.post(submitData, JSON.stringify(staffData));
                    // console.log(response.data);
                    if (response.status === 200 && response.data.code === "sw321") {
                        navigate("/Done");
                    }
                    else {
                        btnnote = response.data.msg;
                        closeAndCancel(btnnote);
                    }
                } catch (err) {
                    btnnote = "Error processing!";
                    closeAndCancel(btnnote);
                }

                setStartLogin(false);
            }

            sendData();
        }
    }

  return (
    <div className='relative flex flex-col min-h-screen'>
        <Nav />

        {toggleSubmitModal == true ?
            <div className='fixed w-full p-4 bg-white z-3 h-screen flex flex-col items-center justify-center'>
                <section className={animateModal}>
                    <p className='p-4'>
                        Kindly note that your location data will be picked alongside
                        your attendance status.
                    </p>

                    {startLogin == true ?
                        <button className="btn btn-secondary mt-6">
                            <span className="loading loading-spinner"></span>
                            Pocessing...
                        </button>
                    :
                        <section>
                            <button onClick={submitWiper} className={btnClass}>
                                {btnNote}
                            </button>

                            <button onClick={cancelWiper} className="btn btn-secondary mt-6 ml-5">
                                Cancel
                            </button>
                        </section>
                    }
                </section>
            </div>
        :
            ""
        }

            <div className="grow">
                <section className='flex'>
                    <img src="logo1.jpeg" alt="Image" className='w-20 h-auto ml-5 mt-5 mb-5 rounded-full shadow-sm'/> 
                    <aside className='mt-10'>
                        <Header/>
                    </aside>
                </section>

                <p className='text-left text-sm leading-6 px-5'>
                    <i>
                        Since you have a wiper number but not yet registered on 
                        the portal, carefully fill the form below and mark 
                        attendance.
                    </i>
                </p>

                <form action="#" onSubmit={markAttendance} className='shadow-sm flex flex-col text-sm mx-4 rounded-sm p-6 my-5 border-gray-100'>
                    <label className='text-green-600' htmlFor="surname">Surname</label>
                    <input type="text" onChange={handleInput} id='surname' placeholder='Surname' className="input input-primary mb-4" />

                    <label className='text-green-600' htmlFor="middlename">Middlename</label>
                    <input type="text" onChange={handleInput} id='middlename' placeholder='Middlename' className='input input-primary mb-4' />

                    <label className='text-green-600' htmlFor="othername">Othername</label>
                    <input type="text" onChange={handleInput} id='othername' placeholder='Othername' className='input input-primary mb-4' />

                    <label className='text-green-600' htmlFor="lga">Select LGA where you are currently working</label>
                    <select defaultValue="Select LGA" onChange={handleInput} id='lga' className="select select-primary mb-4">
                         <option disabled={true}>Select LGA</option>
                         <option value="Aguata">Aguata</option>
                         <option value="Anaocha">Anaocha</option>
                         <option value="Anambra East">Anambra East</option>
                         <option value="Anambra West">Anambra West</option>
                         <option value="Ayamelum">Ayamelum</option>
                         <option value="Awka North">Awka North</option>
                         <option value="Awka South">Awka South</option>
                         <option value="Dunukofia">Dunukofia</option>
                         <option value="Ekwusigo">Ekwusigo</option>
                         <option value="Idemili North">Idemili North</option>
                         <option value="Idemili South">Idemili South</option>
                         <option value="Ihiala">Ihiala</option>
                         <option value="Njikoka">Njikoka</option>
                         <option value="Nnewi North">Nnewi North</option>
                         <option value="Nnewi South">Nnewi South</option>
                         <option value="Ogbaru">Ogbaru</option>
                         <option value="Onitsha North">Onitsha North</option>
                         <option value="Onitsha South">Onitsha South</option>
                         <option value="Orumba North">Orumba North</option>
                         <option value="Orumba South">Orumba South</option>
                         <option value="Oyi">Oyi</option>
                    </select>

                    <label className='text-green-600' htmlFor="stafftype">Staff Type</label>
                    <select defaultValue="Select Staff Type" onChange={handleInput} id='stafftype' className="select select-primary mb-4">
                        <option disabled={true}>Select Staff Type</option>
                        <option value="Tutorial">Tutorial</option>
                        <option value="Non Tutorial">Non Tutorial</option>
                    </select>

                    <label className='text-green-600' htmlFor="dutypost">School or LGA for Non Tutorial Staff</label>
                    <input type="text" onChange={handleInput} id='dutypost' placeholder='Duty post' className='input input-primary mb-4' />

                    <label className='text-green-600' htmlFor="wipernum">Wiper Number</label>
                    <input type="number" onChange={handleInput} id='wipernum' placeholder='Wiper Number' className='input input-primary mb-4' />

                    <section className='text-center'>
                        <p className='mb-2 text-blue-600'>Mark Attendance</p>
                        <span>
                            <span className='mr-2 text-green-600'>Present</span>
                            <input type="checkbox" id='present' onChange={handleAtt} className="checkbox checkbox-success checkbox-xl mr-4" />
                        </span>

                        <span>
                            <span className='mr-2 ml-4 text-pink-600'>On leave</span>
                            <input type="checkbox" id='leave' onChange={handleAtt} className="checkbox checkbox-secondary checkbox-xl" />
                        </span>
                    </section>

                   <div className='flex items-center justify-center'>
                        <button className={btnClass}>
                            Mark
                        </button>
                   </div>
                </form>
            </div>

        <Footer />
    </div>
  )
}

export default Register
