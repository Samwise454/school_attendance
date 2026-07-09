import React, { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Formheader from './components/Formheader';
import axios from 'axios';
import 'animate.css';
import { useNavigate } from 'react-router';
import Footer from './components/Footer';

const Form = () => {
    const navigate = useNavigate();
    // const [startLogin, setStartLogin] = useState("false");//!For old form
    const [toggleForm, setToggleForm] = useState("wiper");//form should be active, closed or inactive for old form and wiper for new form 
    const [toggleLoader, setToggleLoader] = useState(true);
    const [staffData, setStaffData] = useState([]);
    const getStaff = "https://asubeb.esbatech.org/attendance/getStaff.php";
    const fetchSchool = "https://asubeb.esbatech.org/attendance/fetchSchool.php";
    const submitData = "https://asubeb.esbatech.org/attendance/submitAttendance.php";//old form
    const submitWiperData = "https://asubeb.esbatech.org/attendance/submitWiperAttendance.php";//!wiper form
    const checkUserApi = "https://asubeb.esbatech.org/attendance/checkUser.php";
    const [schoolData, setSchoolData] = useState({
        schoolName: localStorage.getItem("asubebAttSchool"),
        staffType: localStorage.getItem("asubebAttStaffType"),
        lga: localStorage.getItem("asubebAttLga"),
        tid: localStorage.getItem("asubebTid")
    });
    const [staffNum, setStaffNum] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);
    const [schoolDetail, setSchoolDetail] = useState([]);
    const [modalData, setModalData] = useState({
        staffType: "",
        lga: "",
        schoolName: ""
    });
    const [staffLga, setStaffLga] = useState(localStorage.getItem("asubebAttLga"));
    const [staffType, setStaffType] = useState(localStorage.getItem("asubebAttStaffType"));
    const [staffSchool, setStaffSchool] = useState(localStorage.getItem("asubebAttSchool"));
    const [tid, setTid] = useState(localStorage.getItem("asubebTid"));
    const [timer, setTimer] = useState("");
    const [toggleNote, setToggleNote] = useState("");
    const [tempStaffName, setTempStaffName] = useState("");
    const [allInput, setAllInput] = useState([]);
    const [allData, setAllData] = useState([]);

    const [attendance, setAttendance] = useState({
        surname: "",
        middlename: "",
        othername: ""
    });

    const [extraStaffName, setExtraStaffName] = useState("");


    /*  WIPER DATA FROM HERE */
    
    const [dutyPost, setDutyPost] = useState(localStorage.getItem("wiperPost"));
    const [staffName, setStaffName] = useState(localStorage.getItem("wiperStaff"));
    const [wiperNum, setWiperNum] = useState(localStorage.getItem("wiperNum"));
    const [wiperAtt, setWiperAtt] = useState(localStorage.getItem("wiperAtt"));//eg present, leave, absent or null

    const [wiperData, setWiperData] = useState({
        wiperNum: "",
        attStatus: ""
    })
    const [startLogin, setStartLogin] = useState(false);//old data is "false"//!for new form
    const [btnClass, setBtnClass] = useState("btn btn-success mt-6");//new update
    const [btnNote, setBtnNote] = useState('Submit');
    const [toggleSubmitModal, setToggleSubmitModal] = useState(false);
    const [animateModal, setAnimateModal] = useState('flex flex-col items-center justify-center');
    const [attId, setAttId] = useState(localStorage.getItem('attId'));//userId stored for the sake of counting number of times attendance was submitted

    /* WIPER DATA ENDS HERE */
    
    //let's fetch matching teacher's names
    useEffect(() => {
        //check whether assignment has been submitted before
        //if submitted redirect to done
        const checkUser = async () => {
            try {
                const response = await axios.post(checkUserApi, JSON.stringify(tid));
                // console.log(response)
                // if (response.status === 200 && response.data.code === "sw321") {//active
                //     navigate("/Form");
                // }
                if (response.status === 200 && response.data.code === "sw320") {//done
                    navigate("/Done");
                }
                // else if (response.status === 200 && response.data.code === "sw322") {//pending
                //     navigate("/Form");
                // }
            } catch (err) {
                // console.log(err)
            }
        }
        //! checkUser(); OLD CODE [uncomment when needed]

        const getStaffData = async () => {
            try {
                const response = await axios.post(getStaff, JSON.stringify(schoolData));
                // console.log(response.data)
                if (response.status === 200) {
                    setStaffData(response.data.staffData);
                    setStaffNum(response.data.numStaff);
                }
            } catch (err) {

            }
        }

        if (wiperAtt !== "no") {
            navigate("/Done");
        }
        else if (wiperNum === null || wiperNum.length == 0) {
            navigate("/");
        }

        //! getStaffData(); OLD CODE [uncomment when needed]

        //!WIPER DATA

        //!CODE TOUCHED
        const updateMondayCountdown = () => {
            const now = new Date();
            const day = now.getDay(); // 1 = Monday
            const hour = now.getHours();

            // target 10:00 AM today
            const target = new Date();
            target.setHours(10, 0, 0, 0);//when done, set thus: target.setHours(10, 0, 0, 0)

            const distance = target - now;
            const distance2 = target.setHours(12, 0, 0, 0)//for afternoon school

            // Logic: Only run if it's Monday AND time is between 07:00:00 and 09:59:59
            if (day == 1 && hour >= 7 && hour < 10) {//when done set thus: (day == 1 && hour >= 7 && hour < 10)
                const h = Math.floor(distance / (1000 * 60 * 60));
                const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance % (1000 * 60)) / 1000);

                let timeCount = `${h}h ${m}m ${s}s`;
                setTimer(timeCount);

                setToggleLoader(false);
                // setToggleForm("active");//!old form
                setToggleForm("wiper"); //!new form with wiper number
            }
            else if (day == 1 && hour >= 10 && hour <= 12) {//this allows afternoon school user submit between 10am and 12
                const h = Math.floor(distance2 / (1000 * 60 * 60));
                const m = Math.floor((distance2 % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((distance2 % (1000 * 60)) / 1000);

                let timeCount = `${h}h ${m}m ${s}s`;
                setTimer(timeCount);

                setToggleLoader(false);
                // setToggleForm("active");//!old form
                setToggleForm("wiper"); //!new form with wiper number
            } 
            else if (day !== 1) {
                setToggleLoader(false);
                setToggleForm("inactive");
            }
            else {
                setToggleLoader(false);
                setToggleForm("closed");
            }
        }

        setInterval(updateMondayCountdown, 1000);
    }, []);

    const hideStaffBox = (box) => {
        box.classList.add("animate__animated", "animate__fadeOut");
        setTimeout(() => {
            box.classList.add("hidden");
        }, 800);
    }

    const markAttendance = (e) => {
        let boxChecked = e.target.checked;
        let id = e.target.id;
        let idSplit = id.split("_");
        let staffStatus = idSplit[0];
        let boxId = idSplit[1];
        let staffName = idSplit[2];

        // if (staffName.includes("  ")) {
        //     staffName = staffName.replaceAll("  ", " ");
        // }

        let box = document.querySelector("#staff_"+boxId);
        if (boxChecked === true && staffStatus === "present") {
            let allModalData = {
                staffType: staffType,
                lga: staffLga,
                schoolName: staffSchool,
                staffStatus: "present",
                staffName: staffName,
                tid: tid,
                action: "update"
            }
            setAttendanceData(prevSelected => [...prevSelected, allModalData]);
        }
        else if (boxChecked === true && staffStatus === "leave") {
            let allModalData = {
                staffType: staffType,
                lga: staffLga,
                schoolName: staffSchool,
                staffStatus: "leave",
                staffName: staffName,
                tid: tid,
                action: "update"
            }
            setAttendanceData(prevSelected => [...prevSelected, allModalData]);
        }
        else if (boxChecked === true && staffStatus === "transfer") {
            //open transfer modal
            let modalBox = document.querySelector("#transfer_modal");
            setTempStaffName(staffName);
            modalBox.showModal();
        }

        hideStaffBox(box);

        setStaffNum(prevNum => prevNum - 1);
        let currentStaffNum = staffNum - 1;
        if (currentStaffNum === 0) {
            setToggleNote("all");
        }
        else {
            setToggleNote("some");

            //once hm starts marking attendance, loop through the remaining teachers and create same number of 
            //inputs for extra entry
            // let staffInputDiv = document.querySelector("#staffInputDiv");
            let dataArray = [];
            for (let i = 0; i < currentStaffNum; i++) {
                let inputData = "<section className='flex flex-row items-center justify-center w-full px-8'> <span className='mr-3'>${i}. </span><input type='text' placeholder='Surname Middlename Othername' className='input input-primary my-2' /></section>";
                dataArray.push(inputData);
            }
            setAllInput(dataArray);
        }
    }

    const markAttendanceExtra = (e) => {
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
                    lga: staffLga,
                    schoolName: staffSchool,
                    staffStatus: "present",
                    staffName: extraStaffName,
                    tid: tid,
                    action: "insert"
                }
                setAttendanceData(prevSelected => [...prevSelected, allModalData]);
                hideStaffBox(box);
            }
            else if (boxChecked === true && staffStatus === "leave") {
                let allModalData = {
                    staffType: staffType,
                    lga: staffLga,
                    schoolName: staffSchool,
                    staffStatus: "leave",
                    staffName: extraStaffName,
                    tid: tid,
                    action: "insert"
                }
                setAttendanceData(prevSelected => [...prevSelected, allModalData]);
                hideStaffBox(box);
            }

            else if (boxChecked === true && staffStatus === "absent") {
                let allModalData = {
                    staffType: staffType,
                    lga: staffLga,
                    schoolName: staffSchool,
                    staffStatus: "absent",
                    staffName: extraStaffName,
                    tid: tid,
                    action: "insert"
                }
                setAttendanceData(prevSelected => [...prevSelected, allModalData]);
                hideStaffBox(box);
            }
        }
    }

    const handleTransfer = (e) => {
        let id = e.target.id;
        
        if (id === "staffType") {
            setModalData({...modalData, staffType: e.target.value});
        }

        if (id === "lga") {
            const fetchData = async (data) => {
                try {
                    const response = await axios.post(fetchSchool, JSON.stringify(data));
                    if (response.status === 200) {
                    setSchoolDetail(response.data);
                    }
                } catch (err) {
                    setSchoolDetail([]);
                }
            }

            setModalData({...modalData, lga: e.target.value});

            let data = {
                lga: e.target.value,
                table: modalData.staffType
            }
            fetchData(data);
        }

        if (id === "school") {
            setModalData({...modalData, schoolName: e.target.value});
            let allModalData = {
                staffType: modalData.staffType,
                lga: modalData.lga,
                schoolName: e.target.value,
                staffStatus: "transfer",
                staffName: tempStaffName,
                tid: tid,
                action: "update"
            }
            setAttendanceData(prevSelected => [...prevSelected, allModalData]);
        }
    }

    // const handleImage = (e) => {
    //     const imgData = new FormData();
    //     let allImages = document.querySelector("#imgData");
    //     let imgFile = allImages.files;

    //     //looping through to append key to each
    //     for (let i = 0; i < imgFile.length; i++) {
    //         imgData.append("image[]", imgFile[i]);
    //     }
    //     imgData.append("attendance", JSON.stringify(attendanceData));
    //     setAllData(imgData);
    // }

    const submitAttendance = (e) => {
        e.preventDefault();

        const setButton = (action) => {
            setStartLogin(action);
            setTimeout(() => {
                setStartLogin("false");
            }, 3000);
        }

        setStartLogin("true");

        if (attendanceData.length == 0) {
            setButton("empty");
        }
        else {
            const sendData = async (allData) => {
                try {
                    const response = await axios.post(submitData, JSON.stringify(allData));
                    // console.log(response.data);
                    if (response.status === 200 && response.data.code === "sw321") {
                        setButton("done");
                        navigate("/Done");
                    }
                } catch (err) {
                    setButton("error");
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
                            // console.log(allData);
                        sendData(allData);
                    },
                    (error) => {
                        // User denied permission or other error
                        // console.error("Error Code:", error.code, "Message:", error.message);

                        // setButton("noloc");//! COMMENT THIS OUT WHEN COMPLAINT IS HIGH

                        locationData = {
                            lat: "-",
                            long: "-"
                        }

                        allData = {
                            attendance: attendanceData,
                            location: locationData
                        }

                        sendData(allData);//!IF USERS COMPLAIN SWITCH ON GPS TOO MUCH, UNCOMMENT THIS
                    }
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
            
            // sendData();
        }
    }

    /* Wiper functions below */
    const markAttendanceWiper = (e) => {
        let attStat = e.target.id;
        let present = document.querySelector("#present");
        let leave = document.querySelector("#leave");

        switch(attStat) {
            case 'present':
                if (leave.checked) {
                    leave.checked = false;
                }
                else if (present.checked) {
                    setWiperData({
                        wiperNum: wiperNum,
                        attStatus: attStat
                    });
                }
                else {
                    setWiperData({
                        wiperNum: wiperNum,
                        attStatus: ""
                    });
                }
                break;
            case 'leave':
                if (present.checked) {
                    present.checked = false;
                }
                else if (leave.checked) {
                    setWiperData({
                        wiperNum: wiperNum,
                        attStatus: attStat
                    });
                }
                else {
                    setWiperData({
                        wiperNum: wiperNum,
                        attStatus: ""
                    });
                }
                break;
        }
    }

    const markWiper = (e) => {
        e.preventDefault();

        setToggleSubmitModal(true);
        setAnimateModal('animate__animated animate__backInRight flex flex-col items-center justify-center overflow-hidden');
    }

    const submitWiper = (e) => {
        e.preventDefault();

        let btnclasserror = 'btn btn-secondary mt-6';
        let btnclasssuccess = 'btn btn-success mt-6';
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
        // console.log(wiperData)
        if (wiperData.attStatus === "") {
            btnnote = "Mark Present or On leave";
            handleBtn(btnnote, btnclasserror);
            setStartLogin(false);
            setTimeout(() => {
                cancelWiper();
            }, 3200);
        }
        else {
            //now we run the submit code through the gps code
            // console.log(wiperData);
            const sendData = async (allData) => {
                try {
                    // const response = await axios.post(submitWiperData, JSON.stringify(wiperData));
                    const response = await axios.post(submitWiperData, JSON.stringify(allData));
                    // console.log(response.data);
                    if (response.status === 200 && response.data.code === "sw321") {
                        navigate("/Done");

                        localStorage.removeItem("wiperPost");
                        localStorage.removeItem("wiperStaff");
                        localStorage.removeItem("wiperNum");
                        localStorage.removeItem("wiperAtt");
                    }
                    else if (response.data.code === "sw311") {
                        //this means user have submitted twice and trying to submit more
                        navigate("/Multiple");
                    }
                    else {
                        btnnote = response.data.msg;
                        handleBtn(btnnote, btnclasserror);
                    }
                } catch (err) {
                    btnnote = "Error processing!";
                    handleBtn(btnnote, btnclasserror);
                }

                setStartLogin(false);
            }

            // sendData();

            let locationData = {
                lat: "",
                long: ""
            };

            let allData = {
                attendance: "",
                location: ""
            }

            let locationPermit = "";

            //!before you allow to send data, trigger location
            if (navigator.geolocation) {
                navigator.permissions.query({ name: "geolocation" })
                .then((permission) => {
                    // console.log(permission.state)
                    if (permission.state === "granted") {
                        // locationPermit = "granted";
                        getLocation();
                    } 
                    else if (permission.state === "prompt") {
                        // locationPermit = "prompt";
                        getLocation();
                    } 
                    else {
                        // Blocked
                        // locationPermit = "blocked";
                        //! COMMENT THE 3 LINES DIRECTLY BELOW OUT WHEN COMPLAINT IS HIGH
                        btnnote = "Switch on your GPS & grant access";
                        handleBtn(btnnote, btnclasserror);
                        setStartLogin(false);
                    }

                });

                const getLocation = () => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            // Success!
                            locationData = {
                                lat: position.coords.latitude,
                                long: position.coords.longitude
                            }

                            allData = {
                                attendance: wiperData,
                                location: locationData,
                                attId: attId
                            }
                            // console.log(allData);
                            sendData(allData);
                        },
                        (error) => {
                            // User denied permission or other error
                            // console.error("Error Code:", error.code, "Message:", error.message);

                            //! COMMENT THE 3 LINES DIRECTLY BELOW OUT WHEN COMPLAINT IS HIGH
                            btnnote = "Switch on your GPS";
                            handleBtn(btnnote, btnclasserror);
                            setStartLogin(false);

                            locationData = {
                                lat: "-",
                                long: "-"
                            }

                            allData = {
                                attendance: wiperData,
                                location: locationData,
                                attId: attId
                            }

                            // sendData(allData);//!IF USERS COMPLAIN SWITCH ON GPS TOO MUCH, UNCOMMENT THIS
                        }
                    );
                }
            } 
            else {
                //no browser support or other errors, therefore allow submission
                locationData = {
                    lat: "-",
                    long: "-"
                }

                allData = {
                    attendance: wiperData,
                    location: locationData,
                    attId: attId
                }

                sendData(allData);
            }
        }
    }

    const cancelWiper = () => {
        setAnimateModal('animate__animated animate__backOutRight flex flex-col items-center justify-center overflow-hidden');
        setTimeout(() => {
            setToggleSubmitModal(false);
        }, 600);
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
        <div className='grow'>
            <section className='flex'>
                <img src="logo1.jpeg" alt="Image" className='w-20 h-auto ml-5 mt-5 mb-5 rounded-full shadow-sm'/> 
                <aside className='mt-10'>
                    <Formheader/>
                </aside>
            </section>

            <section className='text-center text-pink-700 font-semibold mb-8'>
                {toggleForm === "closed" || toggleForm === "inactive" ?
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

            {/* <section className='text-right mr-4 text-sm fixed top-0 left-0 mt-4 ml-28 z-2 bg-black p-2 rounded-md'>
                <p>
                    <span className='text-white'>Number of Staff: </span>
                    <span className='bg-yellow-200 rounded-full px-2 py-1 text-black'>{staffNum}</span>
                </p>
            </section> */}

            {/* Transfer modal */}
            <dialog id="transfer_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Select LGA and School Transferred to</h3>
                    <div className='py-4'>
                        <select defaultValue="Select Staff Type" onChange={handleTransfer} id='staffType' className="select select-primary mb-5">
                            <option disabled={true}>Select Staff Type</option>
                            <option value="tutorial">Tutorial</option>
                            <option value="nontutorial">Non Tutorial</option>
                        </select>

                        <select defaultValue="Select LGA" onChange={handleTransfer} id='lga' className="select select-primary mb-5">
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

                        <select defaultValue="Select School" onChange={handleTransfer} id='school' className="select select-primary mb-0">
                            <option disabled={true}>Select School</option>
                            {schoolDetail ?
                                schoolDetail.map((data, dataIndex) => {
                                    return (
                                        <option key={dataIndex} value={data.schoolName}>{data.schoolName}</option>
                                    )
                                })
                            :
                                ""
                            }
                        </select>
                    </div>
                    <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn">Submit</button>
                    </form>
                    </div>
                </div>
            </dialog>

            {toggleForm === "active" ?
                <form onSubmit={submitAttendance} className='overflow-hidden'>
                    <div className='grid grid-cols-2 gap-3 w-full my-4 px-2'>
                        {staffData.map((data, dataIndex) => {
                            return (
                                <div key={dataIndex} id={"staff_"+data.id} className="card bg-base-100 w-full shadow-sm border border-blue-100">
                                    <figure className="px-2 pt-3 w-20">
                                        <img
                                        src="/profile.jfif"
                                        alt="Profile"
                                        className="rounded-xl" />
                                    </figure>
                                    <div className="card-body items-center text-center">
                                        <h2 className="card-title">{data.staffName.replaceAll("  ", " ")}</h2>
                                        <p>Tick the green box below to mark your attendance.</p>

                                        <div className="card-actions flex items-center justify-left text-sm">
                                            <span className='text-green-600'>1. Present</span>
                                            <input htmlFor="my_modal_6" type="checkbox" onChange={markAttendance} id={"present_"+data.id+"_"+data.staffName} className="checkbox checkbox-success checkbox-lg" />

                                            <span className='text-purple-600'>2. On Leave </span>
                                            <input type="checkbox" onChange={markAttendance} id={"leave_"+data.id+"_"+data.staffName} className="checkbox checkbox-primary checkbox-lg" />

                                            <span className='text-pink-600'>3. Transfer </span>
                                            <input type="checkbox" onChange={markAttendance} id={"transfer_"+data.id+"_"+data.staffName} className="checkbox checkbox-secondary checkbox-lg" />
                                        </div>
                                        <p className='text-[11px] font-semibold shadow-sm p-1 text-blue-600'><i>Leave & Transfer HM ONLY!</i></p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    <div>
                        <p className='text-sm px-4 mt-5 mb-2'>
                            Carefully type in staff name that is not 
                            displayed and indicate whether 
                            <i className='font-semibold'> present, absent</i> or on <i className='font-semibold'>leave</i>.
                        </p>

                        <div id='staffInputDiv' className='flex flex-col items-center justify-center relative'>
                            {allInput ?
                                allInput.map((data, dataIndex) => {
                                    return (
                                        <section key={dataIndex} id={"extraStaff_"+dataIndex} className='w-full px-8'> 
                                            <section className='flex flex-row items-center justify-center'>
                                                <span className='mr-3'>{dataIndex + 1}. </span>
                                                <input type='text' onChange={markAttendanceExtra} id={"extraName_"+dataIndex} placeholder='Surname Middlename Othername' className='input input-primary my-2' />
                                            </section>

                                            <section id={"extraBox_"+dataIndex} className='text-center mb-3 hidden'>
                                                <span className='text-green-600 text-[13px] mr-1'>Present</span>
                                                <input type="checkbox" onChange={markAttendanceExtra} id={"present_"+dataIndex} className="checkbox checkbox-success checkbox-lg" />

                                                <span className='text-purple-600 text-[13px] mr-1 ml-2'>On Leave </span>
                                                <input type="checkbox" onChange={markAttendanceExtra} id={"leave_"+dataIndex} className="checkbox checkbox-primary checkbox-lg mr-2" />

                                                <span className='text-pink-600 text-[13px] mr-1'>Absent </span>
                                                <input type="checkbox" onChange={markAttendanceExtra} id={"absent_"+dataIndex} className="checkbox checkbox-secondary checkbox-lg" />
                                            </section>
                                        </section>
                                    )
                                })
                            :
                                ""
                            }
                        </div>
                    </div>

                    {/* <section className='animate__animated animate__bounceInRight text-center mt-20 mb-10'>
                        <p>
                            Upload your attendance sheet
                        </p>
                        <p className='mb-2 text-sm text-red-600'>Maximum of 6 selections</p>
                        <input type="file" id='imgData' onChange={handleImage} className="file-input file-input-primary" multiple />
                    </section> */}

                    {toggleNote === "some" ?
                        <div>
                            <p className='text-center text-green-700 text-sm mt-5'><i>If you are done marking, submit.</i></p>
                        </div>
                    :
                        toggleNote === "all" ?
                            <div>
                                <p className='text-center text-green-700 text-sm mt-5'><i>All teachers present, submit.</i></p>
                            </div>      
                        :
                            ""
                    }

                    <div className="text-center pb-20">
                        {startLogin == "false" ?
                        <button className="btn btn-success mt-6">
                            Submit Attendance
                        </button> 
                        :
                        startLogin == "true" ?
                            <button className="btn btn-primary mt-6">
                            <span className="loading loading-spinner"></span>
                                Submitting...
                            </button>
                        :
                            startLogin == "empty" ?
                                <button className="btn btn-error mt-6">
                                    {/* <span className="loading loading-spinner"></span> */}
                                    Fill All Data
                                </button>
                            :
                                startLogin == "error" ?
                                <button className="btn btn-error mt-6">
                                    {/* <span className="loading loading-spinner"></span> */}
                                    Error Submitting
                                </button>
                                :
                                    startLogin === "done" ?
                                        <button className="btn btn-success mt-6">
                                            Submitted
                                        </button>
                                    :
                                        startLogin === "noloc" ?
                                            <button className="btn btn-error mt-6">
                                                Switch on GPS and allow access
                                            </button>
                                        :
                                            <button className="btn btn-success mt-6">
                                                Submit Attendance
                                            </button>
                        }
                    </div>
                </form>
            :
                toggleForm === "wiper" ?
                    <form action="#" className='px-5' onSubmit={markWiper}>
                        <div className="card bg-base-100 w-full shadow-sm border border-blue-100">
                            <figure className="px-2 pt-3 w-30">
                                <img
                                src="/profile.jfif"
                                alt="Profile"
                                className="rounded-xl" />
                            </figure>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title">{staffName.replaceAll("  ", " ")}</h2>
                                <p>Tick the appriopriate box below and select <b>Submit</b> to mark your attendance.</p>

                                <div className="card-actions flex items-center justify-left text-sm mt-6">
                                    <span className='text-green-600'>Present</span>
                                    <input htmlFor="my_modal_6" type="checkbox" onChange={markAttendanceWiper} id="present" className="checkbox checkbox-success checkbox-lg mr-4" />

                                    <span className='text-purple-600 ml-4'>On Leave </span>
                                    <input type="checkbox" onChange={markAttendanceWiper} id="leave" className="checkbox checkbox-primary checkbox-lg" />
                                </div>
                            </div>
                        </div>

                        <div className='pb-20 text-center mt-4 flex flex-col'>
                            {/* <i className='text-red-600 text-left text-sm'>
                                Note: You will be prompted to switch on your GPS before 
                                submission.
                            </i> */}
                            <section>
                                <button className="btn btn-success">
                                    Mark Attendance
                                </button>
                            </section>
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

export default Form
