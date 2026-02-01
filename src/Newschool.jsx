import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Formheader from './components/Formheader';
import axios from 'axios';
import 'animate.css';
import { useNavigate } from 'react-router';
import Footer from './components/Footer';

const Newschool = () => {
    const navigate = useNavigate();
    const [startLogin, setStartLogin] = useState(true);
    const [toggleLoader, setToggleLoader] = useState(false);
    const [toggleForm, setToggleForm] = useState("newform");//form not showing which means, it's not Monday
    const [staffData, setStaffData] = useState([]);
    const [staffType, setStaffType] = useState("");
    const [uid, setUid] = useState({
        schlname: "",
        lga: "",
        sctype: "",
        sttype: "",
        numteacher: ""
    });

    const [btnClass, setBtnClass] = useState('');
    const [btnNote, setBtnNote] = useState('Submit');

    const checkSchool = "https://asubeb.esbatech.org/attendance/checkSchool.php";

    // //let's check whether the schoolname provided is in the table, if yes, redirect to form
    // useEffect(() => {
    //     const checkUser = async () => {
    //         try {
    //             const response = await axios.post(checkSchool, JSON.stringify(tid));
    //             if (response.status === 200) {
                    
    //             }
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }
    //     checkUser();
    // }, []);

    const handleInput = (e) => {
        let id = e.target.id;
        let val = e.target.value;

        setUid({...uid, [id]: val});

        if (id === "sttype") {
        setStaffType(val);
        }
    }

    const handleGetNewSchool = (e) => {
        e.preventDefault();


    }

    const submitAttendance = (e) => {
        e.preventDefault();
        setStartLogin(false);
        const handleBtn = (btnnote, btnclass) => {

        }

        // if (uid.lga === "") {
        //     setStartLogin("lga"); 
        //     setTimeout(() => {
        //         setStartLogin("false");
        //     }, 3000);
        // }
        // else if (uid.sttype === "") {
        //     setStartLogin("sttype"); 
        //     setTimeout(() => {
        //         setStartLogin("false");
        //     }, 3000);
        // }
        // else if (uid.sttype === "tutorial" && uid.sctype === "") {
        //     setStartLogin("tut"); //for tutorial staff
        //     setTimeout(() => {
        //         setStartLogin("false");
        //     }, 3000);
        // }
        // else if (uid.sttype === "tutorial" && uid.schlname === "") {
        //     setStartLogin("schl"); //for tutorial staff
        //     setTimeout(() => {
        //         setStartLogin("false");
        //     }, 3000);
        // }
        // else if (uid.sttype === "nontutorial" && uid.schlname === "") {
        //     setStartLogin("schl2"); //for nontutorial staff
        //     setTimeout(() => {
        //         setStartLogin("false");
        //     }, 3000);
        // }
        // else if (uid.numteacher === "") {
        //     setStartLogin("staff"); 
        //     setTimeout(() => {
        //         setStartLogin("false");
        //     }, 3000);
        // }
        // else if (uid.numteacher > 200) {
        //     setStartLogin("numstaff"); //for nontutorial staff
        //     setTimeout(() => {
        //         setStartLogin("false");
        //     }, 3000);
        // }
    }

  return (
    <div className='relative flex flex-col min-h-screen'>
        <Nav />

            {toggleLoader === true ?
                <div className='fixed top-0 left-0 bg-white w-full h-screen z-1 flex items-center justify-center'>
                    <div className="loader"></div>
                </div>
            :
                ""
            }

            <div className='relative grow'>
                <section className='flex'>
                    <img src="logo1.jpeg" alt="Image" className='w-20 h-auto ml-5 mt-5 mb-5 rounded-full shadow-sm'/> 
                    <aside className='mt-10'>
                        <Formheader/>
                    </aside>
                </section>

                <h1 className='text-center text-sm'>For newly created schools, fill the form below</h1>

                {toggleForm === "newform" ?
                    <form action="#" className='text-sm mt-8 mx-10 flex flex-col items-center justify-center' onSubmit={handleGetNewSchool}>
                        <select defaultValue="Select LGA" onChange={handleInput} id='lga' className="select select-primary mb-5">
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

                        <select defaultValue="Select Staff Type" onChange={handleInput} id='sttype' className="select select-primary mb-5">
                            <option disabled={true}>Select Staff Type</option>
                            <option value="tutorial">Tutorial</option>
                            <option value="nontutorial">Non Tutorial</option>
                        </select>

                        {staffType === "tutorial" ?
                            <div>
                                <select defaultValue="Select School Type" onChange={handleInput} id='sctype' className="select select-primary mb-5">
                                    <option disabled={true}>Select School Type</option>
                                    <option value="PP">Public Public</option>
                                    <option value="PM">Public Mission</option>
                                </select>

                                <input type="text" placeholder='School name' id='schlname' className="input input-primary mb-5" />
                            </div>
                        :
                            staffType === "nontutorial" ?
                                <input type="text" placeholder='LGEA name' id='schlname' className="input input-primary mb-5" />
                            :
                                ""
                        }

                        <input type="number" id='numteacher' placeholder="Number of staff" onChange={handleInput} className="input input-primary mb-2" />

                        <div className='flex pb-8'>
                            {startLogin == true ?
                                <button className="btn btn-success mt-6">
                                    {btnNote}
                                </button>
                            :
                                <button className="btn btn-success mt-6">
                                    <span className="loading loading-spinner"></span>
                                    Processing...
                                </button>
                            }
                        </div>
                    </form>
                :
                    <form action="#" className='text-sm mt-8 mx-10 flex flex-col items-center justify-center' onSubmit={submitAttendance}>

                    </form>
                }
            </div>
        <Footer />
    </div>
  )
}

export default Newschool
