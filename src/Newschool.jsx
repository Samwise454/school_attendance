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
    const [attendanceData, setAttendanceData] = useState([]);
    const [staffType, setStaffType] = useState("");
    const [allInput, setAllInput] = useState([]);
    const [uid, setUid] = useState({
        schlname: "",
        lga: "",
        sctype: "",
        sttype: "",
        numteacher: ""
    });

    const [btnClass, setBtnClass] = useState("btn btn-success mt-6");
    const [btnNote, setBtnNote] = useState('Submit');
    const [extraStaffName, setExtraStaffName] = useState("");
    const [toggleTimer, setToggleTimer] = useState("");
    const [timer, setTimer] = useState("");

    const checkSchool = "https://asubeb.esbatech.org/attendance/checkSchool.php";
    const submitData = "https://asubeb.esbatech.org/attendance/submitAttendance.php";

    useEffect(() => {
        const updateMondayCountdown = () => {
            const now = new Date();
            const day = now.getDay(); // 1 = Monday
            const hour = now.getHours();

            // target 10:00 AM today
            const target = new Date();
            target.setHours(12, 0, 0, 0);//when done, set thus: target.setHours(10, 0, 0, 0)

            const distance = target - now;

            // Logic: Only run if it's Monday AND time is between 07:00:00 and 09:59:59
            if (day == 1 && hour >= 7 && hour < 12) {// when done set thus: (day == 1 && hour >= 7 && hour < 10)
                const h = Math.floor(distance / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);

                let timeCount = `${h}h ${m}m ${s}s`;
                setTimer(timeCount);

                // setToggleLoader(false);
                setToggleTimer("active");
            } 
            else if (day !== 1) {
                // setToggleLoader(false);
                setToggleForm("inactive");
            }
            else {
                setToggleForm("closed");//! for testing, comment this out
                setToggleTimer("closed");
            }
        }
        
        setInterval(updateMondayCountdown, 1000);
    })

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

        setStartLogin(false);
        let btnnote = "";
        let btnclasserror = "btn btn-secondary mt-6";

        const handleBtn = (btnnote, btnclass) => {
            setBtnNote(btnnote);
            setBtnClass(btnclass);
            setStartLogin(true);

            setTimeout(() => {
                setBtnClass("btn btn-success mt-6");
                setBtnNote("Submit");
            }, 3000);
        }

        if (uid.lga === "") {
            btnnote = "Select LGA";
            handleBtn(btnnote, btnclasserror);
        }
        else if (uid.sttype === "") {
            btnnote = "Select staff type";
            handleBtn(btnnote, btnclasserror);
        }
        else if (uid.sttype === "tutorial" && uid.sctype === "") {
            btnnote = "Select school type";
            handleBtn(btnnote, btnclasserror);
        }
        else if (uid.sttype === "tutorial" && uid.schlname === "") {
            btnnote = "Type in school name";
            handleBtn(btnnote, btnclasserror);
        }
        else if (uid.sttype === "nontutorial" && uid.schlname === "") {
            btnnote = "Type in LGEA";
            handleBtn(btnnote, btnclasserror);
        }
        else if (allInput === "") {
            btnnote = "Type num staff";
            handleBtn(btnnote, btnclasserror);
        }
        else if (allInput > 200) {
            btnnote = "Invalid staff num";
            handleBtn(btnnote, btnclasserror);
        }
        else {
            //now we process
            const checkUser = async () => {
                try {
                    const response = await axios.post(checkSchool, JSON.stringify(uid));
                    // console.log(response.data)
                    if (response.status === 200) {
                        if (response.data.code === "sw321") {
                            //if response.data.code =  sw321 this means school exists, redirect to form
                            //after storing data in localstorage
                            localStorage.setItem("asubebAttSchool", response.data.msg.schoolName);
                            localStorage.setItem("asubebAttLga", response.data.msg.lga);
                            localStorage.setItem("asubebAttStaffType", response.data.msg.staffType);
                            localStorage.setItem("asubebTid", response.data.msg.tid);
                            navigate("/Form");                            
                        }
                        else {
                            //if response.data.code =  sw12 this means school doesn't exist
                            //setToggleForm to "oldform"
                            localStorage.setItem("asubebAttSchool", response.data.msg.schoolName);
                            localStorage.setItem("asubebAttLga", response.data.msg.lga);
                            localStorage.setItem("asubebAttStaffType", response.data.msg.staffType);
                            localStorage.setItem("asubebTid", response.data.msg.tid);

                            let dataArray = [];
                            for (let i = 0; i < uid.numteacher; i++) {
                                let inputData = "<section className='flex flex-row items-center justify-center w-full px-8'> <span className='mr-3'>${i}. </span><input type='text' placeholder='Surname Middlename Othername' className='input input-primary my-2' /></section>";
                                dataArray.push(inputData);
                            }
                            setAllInput(dataArray);

                            setToggleForm("oldform");
                        }
                        setStartLogin(true);
                    }
                } catch (err) {
                    btnnote = "Error processing!";
                    handleBtn(btnnote, btnclasserror);
                }
            }
            checkUser();
        }
    }

    const hideStaffBox = (box) => {
        box.classList.add("animate__animated", "animate__fadeOut");
        setTimeout(() => {
            box.classList.add("hidden");
        }, 800);
    }

    const markAttendance = (e) => {
        let id = e.target.id;
        let boxChecked = e.target.checked;
        let val = e.target.value;

        let idSplit = id.split("_");
        let staffStatus = idSplit[0];
        let idNum = idSplit[1];

        let box = document.querySelector("#extraStaff_"+idNum);
        let extraBox = document.querySelector("#extraBox_"+idNum);

        if (staffStatus === "extraName" && val.length > 3) {
            setExtraStaffName(val);
            extraBox.classList.remove("hidden");
        }
        else if (staffStatus === "extraName" && val.length < 3) {
            setExtraStaffName("");
            extraBox.classList.add("hidden");
        }
        else {
            if (boxChecked === true && staffStatus === "present") {
                let allModalData = {
                    staffType: staffType,
                    lga: uid.lga,
                    schoolName: uid.schlname,
                    staffStatus: "present",
                    staffName: extraStaffName,
                    tid: localStorage.getItem("asubebTid"),
                    action: "newschool"
                }
                setAttendanceData(prevSelected => [...prevSelected, allModalData]);
                hideStaffBox(box);
            }
            else if (boxChecked === true && staffStatus === "leave") {
                let allModalData = {
                    staffType: staffType,
                    lga: uid.lga,
                    schoolName: uid.schlname,
                    staffStatus: "leave",
                    staffName: extraStaffName,
                    tid: localStorage.getItem("asubebTid"),
                    action: "newschool"
                }
                setAttendanceData(prevSelected => [...prevSelected, allModalData]);
                hideStaffBox(box);
            }

            else if (boxChecked === true && staffStatus === "absent") {
                let allModalData = {
                    staffType: staffType,
                    lga: uid.lga,
                    schoolName: uid.schlname,
                    staffStatus: "absent",
                    staffName: extraStaffName,
                    tid: localStorage.getItem("asubebTid"),
                    action: "newschool"
                }
                setAttendanceData(prevSelected => [...prevSelected, allModalData]);
                hideStaffBox(box);
            }
        }
    }

    const submitAttendance = (e) => {
        e.preventDefault();
        setStartLogin(false);
        // console.log(attendanceData)

        let btnnote = "";
        let btnclasserror = "btn btn-secondary mt-6";

        const handleBtn = (btnnote, btnclass) => {
            setBtnNote(btnnote);
            setBtnClass(btnclass);
            setStartLogin(true);

            setTimeout(() => {
                setBtnClass("btn btn-success mt-6");
                setBtnNote("Submit");
            }, 3000);
        }

        if (attendanceData.length == 0) {
            btnnote = "Enter at least one staff data!";
            handleBtn(btnnote, btnclasserror);
        }
        else {
            const sendData = async (allData) => {
                try {
                    const response = await axios.post(submitData, JSON.stringify(allData));
                    // console.log(response.data);
                    if (response.status === 200 && response.data.code === "sw321") {
                        btnnote = "Submitted";
                        handleBtn(btnnote, btnclasserror);
                        navigate("/Done");
                    }
                } catch (err) {
                    btnnote = "Error processing!";
                    handleBtn(btnnote, btnclasserror);
                }
            }

            let locationData = {
                lat: "",
                long: ""
            };

            let allData = {
                attendance: "",
                location: ""
            }

            //!before you allow to send data, trigger location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Success!
                        locationData = {
                            lat: position.coords.latitude,
                            long: position.coords.longitude
                        }

                        allData = {
                            attendance: attendanceData,
                            location: locationData
                        }

                        sendData(allData);
                    },
                    (error) => {
                        // User denied permission or other error
                        // console.error("Error Code:", error.code, "Message:", error.message);

                        // btnnote = "Switch on GPS and allow access";//! COMMENT THIS OUT WHEN COMPLAINT IS HIGH
                        // handleBtn(btnnote, btnclasserror);

                        locationData = {
                            lat: "-",
                            long: "-"
                        }

                        allData = {
                            attendance: attendanceData,
                            location: locationData
                        }

                        sendData(allData);//!IF USERS COMPLAIN SWITCH ON GPS TOO MUCH, UNCOMMENT THIS
                    },
                    // {
                    //     enableHighAccuracy: true,  // This forces the device to use GPS
                    //     timeout: 10000,            // Wait up to 10 seconds for a precise lock
                    //     maximumAge: 0   
                    // }
                );
            } 
            else {
                //no browser support or other errors, therefore allow submission
                locationData = {
                    lat: "-",
                    long: "-"
                }

                allData = {
                    attendance: attendanceData,
                    location: locationData
                }

                sendData(allData);
            }

            //sendData();
        }
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

                                <input type="text" placeholder='School name' onChange={handleInput} id='schlname' className="input input-primary mb-5" />
                            </div>
                        :
                            staffType === "nontutorial" ?
                                <input type="text" placeholder='LGEA name' onChange={handleInput} id='schlname' className="input input-primary mb-5" />
                            :
                                ""
                        }

                        <input type="number" id='numteacher' placeholder="Number of staff" onChange={handleInput} className="input input-primary mb-2" />

                        <div className='flex pb-8'>
                            {startLogin == true ?
                                <button className={btnClass}>
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
                    toggleForm === "oldform" ?
                        <form action="#" className='text-sm mt-8 mx-5 flex flex-col items-center justify-center' onSubmit={submitAttendance}>
                            <section className='text-center text-pink-700 font-semibold mb-8'>
                                {toggleTimer === "closed" || toggleTimer === "inactive" ?
                                    <div>
                                        <p className='text-sm animate__animated animate__bounceIn'>Attendance Closed</p>
                                    </div>
                                :
                                    <div>
                                        <p className='text-sm text-green-700'>Attendance stops in</p>
                                        {timer}
                                    </div>
                                }
                            </section>

                            <p className='text-sm px-4 mt-1 mb-2'>
                                Carefully type in staff name and indicate whether 
                                <i className='font-semibold'> present, absent</i> or on <i className='font-semibold'>leave</i>.
                            </p>
                            {allInput ?
                                allInput.map((data, dataIndex) => {
                                    return (
                                        <section key={dataIndex} id={"extraStaff_"+dataIndex} className='w-full px-8'> 
                                            <section className='flex flex-row items-center justify-center'>
                                                <span className='mr-3'>{dataIndex + 1}. </span>
                                                <input type='text' onChange={markAttendance} id={"extraName_"+dataIndex} placeholder='Surname Middlename Othername' className='input input-primary my-2' />
                                            </section>

                                            <section id={"extraBox_"+dataIndex} className='text-center mb-3 hidden'>
                                                <span className='text-green-600 text-[13px] mr-1'>Present</span>
                                                <input type="checkbox" onChange={markAttendance} id={"present_"+dataIndex} className="checkbox checkbox-success checkbox-lg" />

                                                <span className='text-purple-600 text-[13px] mr-1 ml-2'>On Leave </span>
                                                <input type="checkbox" onChange={markAttendance} id={"leave_"+dataIndex} className="checkbox checkbox-primary checkbox-lg mr-2" />

                                                <span className='text-pink-600 text-[13px] mr-1'>Absent </span>
                                                <input type="checkbox" onChange={markAttendance} id={"absent_"+dataIndex} className="checkbox checkbox-secondary checkbox-lg" />
                                            </section>
                                        </section>
                                    )
                                })
                            :
                                ""
                            }

                            <div className='flex pb-15'>
                                {startLogin == true ?
                                    <button className={btnClass}>
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
                        toggleForm === "closed" ?
                            <div className='shadow-sm p-10 py-20 rounded-sm font-semibold bg-gray-100 m-2 mt-10 flex items-center justify-center'>
                                <p className='animate__animated animate__bounceIn'>
                                    Form closed for today!
                                </p>
                            </div>
                        :
                            toggleForm === "inactive" ?
                                <div className='shadow-sm p-10 py-20 rounded-sm font-semibold bg-gray-100 m-2 mt-10 flex items-center justify-center'>
                                    <p className='animate__animated animate__bounceIn'>
                                        Check Back on Monday!
                                    </p>
                                </div>
                            :
                                ""
                }
            </div>
        <Footer />
    </div>
  )
}

export default Newschool
