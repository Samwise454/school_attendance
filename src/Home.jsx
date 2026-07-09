import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import Nav from './components/Nav';
import Header from './components/Header';
import axios from 'axios';
import Footer from './components/Footer';

const Home = () => {
  const navigate = useNavigate();
  const api = "https://asubeb.esbatech.org/attendance/login.php";
  const loginWiper = "https://asubeb.esbatech.org/attendance/loginWiper.php";
  const fetchSchool = "https://asubeb.esbatech.org/attendance/fetchSchool.php";
  const [schoolData, setSchoolData] = useState([]);
  const [startLogin, setStartLogin] = useState(false);//old data is "false"
  const [toggleForm, setToggleForm] = useState(false);//form not showing which means, it's not Monday
  const [uid, setUid] = useState({
    schlname: "",
    lga: "",
    sctype: "",
    sttype: "",
    numteacher: ""
  });

  const [wiperData, setWiperData] = useState({//new update
    wiper: ""
  });

  const [staffType, setStaffType] = useState("");

  // const checkUserApi = "https://asubeb.esbatech.org/attendance/checkUser.php";
  const [user, setUser] = useState(localStorage.getItem("asubebTid"));
  const [schoolName, setSchoolName] = useState(localStorage.getItem("asubebAttSchool"));
  const [lga, setLga] = useState(localStorage.getItem("asubebAttLga"));
  const [staffTypeLocal, setStaffTypeLocal] = useState(localStorage.getItem("asubebAttStaffType"));
  const [attId, setAttId] = useState(localStorage.getItem('attId'));

  //!is afternoon button "Activate" clicked
  const [activate, setActivate] = useState(false);

  const [btnClass, setBtnClass] = useState("btn btn-success mt-6");//new update
  const [btnNote, setBtnNote] = useState('Login');

  //!UN-COMMENT THIS CODE WHEN NECESSARY
  // useEffect(() => {
  //     if (user !== null && schoolName !== null && lga !== null && staffTypeLocal !== null) {
  //         navigate("/Form");
  //     }
  // }, [user, schoolName, lga, staffTypeLocal]);

  useEffect(() => {
    //! TEMPORARILY CLEANING LOCALSTORAGE [ REMOVE BY 12 NOON TOMORROW ]
    // localStorage.removeItem("asubebTid");
    // localStorage.removeItem("asubebAttSchool");
    // localStorage.removeItem("asubebAttLga");
    // localStorage.removeItem("asubebAttStaffType");

    //LET'S MAKE SURE FORM OPENS ONLY FROM 7AM
    const now = new Date();
    const day = now.getDay(); // 1 = Monday
    const hour = now.getHours();

    if (day == 1 && hour >= 7 && hour < 10) {//! when done set thus: (day == 1 && hour >= 7 && hour < 11)
        setToggleForm(true);
    } else {
        // setToggleLoader(false);
        setToggleForm(false);
    }

  }, [navigate]);

  //! this code below should redirect user to the main site - ALREADY DONE, DON'T UNCOMMENT
  // useEffect(() => {
  //   const mainSite = "https://asubeb.esbatech.org";
  //   window.location.href = mainSite;
  // }), [];

  useEffect(() => {
    //this fetches schools matching selected lga 
    const fetchData = async (data) => {
      try {
        const response = await axios.post(fetchSchool, JSON.stringify(data));
        // console.log(response.data);
        if (response.status === 200) {
          setSchoolData(response.data);
        }
      } catch (err) {
        setSchoolData([]);
      }
    }

    if (uid.sctype !== "") {
      let data = {
        lga: uid.lga,
        table: "tutorial"
      }
      fetchData(data);
    }
    else {
      let data = {
        lga: uid.lga,
        table: "nontutorial"
      }
      fetchData(data);
    }
  }, [uid.lga, uid.sctype])

  const handleInput = (e) => {
    let id = e.target.id;
    let val = e.target.value;

    setUid({...uid, [id]: val});

    if (id === "sttype") {
      setStaffType(val);
    }
  }

  const handleWiper = (e) => {
    let id = e.target.id;
    let wiperVal = e.target.value;
    
    setWiperData({...wiperData, [id]:wiperVal});
  }

  const handleLogin = (e) => {
    e.preventDefault();

    if (uid.lga === "") {
      setStartLogin("lga"); 
      setTimeout(() => {
        setStartLogin("false");
      }, 3000);
    }
    else if (uid.sttype === "") {
      setStartLogin("sttype"); 
      setTimeout(() => {
        setStartLogin("false");
      }, 3000);
    }
    else if (uid.sttype === "tutorial" && uid.sctype === "") {
      setStartLogin("tut"); //for tutorial staff
      setTimeout(() => {
        setStartLogin("false");
      }, 3000);
    }
    else if (uid.sttype === "tutorial" && uid.schlname === "") {
      setStartLogin("schl"); //for tutorial staff
      setTimeout(() => {
        setStartLogin("false");
      }, 3000);
    }
    else if (uid.sttype === "nontutorial" && uid.schlname === "") {
      setStartLogin("schl2"); //for nontutorial staff
      setTimeout(() => {
        setStartLogin("false");
      }, 3000);
    }
    else if (uid.numteacher === "") {
      setStartLogin("staff"); 
      setTimeout(() => {
        setStartLogin("false");
      }, 3000);
    }
    else if (uid.numteacher > 200) {
      setStartLogin("numstaff"); //for nontutorial staff
      setTimeout(() => {
        setStartLogin("false");
      }, 3000);
    }
    else {
      const login = async () => {
        try {
          const response = await axios.post(api, JSON.stringify(uid));
          // console.log(response.data);
          if (response.status === 200 && response.data.code === "sw321") {
            setStartLogin("true");
            localStorage.setItem("asubebAttSchool", response.data.msg.schoolName);
            localStorage.setItem("asubebAttLga", response.data.msg.lga);
            localStorage.setItem("asubebAttStaffType", response.data.msg.staffType);
            localStorage.setItem("asubebTid", response.data.msg.tid);
            

            localStorage.setItem("attId", response.data.msg.tid);//this is the user id stored permanently in localStorage used to check for number of times user submitted
            navigate("/Form");
          }
          else {
            setStartLogin("error");
            setTimeout(() => {
              setStartLogin("false");
            }, 3000);
          }
        } catch (err) {
          setStartLogin("error");
          setTimeout(() => {
            setStartLogin("false");
          }, 3000);
        }
      }

      login();
    }
  }

  const handleLoginWiper = (e) => {
    e.preventDefault();

    let btnclasserror = 'btn btn-secondary mt-6 ml-4';
    let btnclasssuccess = 'btn btn-success mt-6 ml-4';
    let btnnote = "";

    setStartLogin(true);

    const handleBtn = (btnnote, btnclass) => {
      setBtnNote(btnnote);
      setBtnClass(btnclass);

      setTimeout(() => {
        setBtnNote("Login");
        setBtnClass('btn btn-success mt-6 ml-4');
      }, 3000);
    }

    if (wiperData.wiper === "") {
      btnnote = "No or invalid wiper n0!";
      handleBtn(btnnote, btnclasserror);
      setStartLogin(false);
    }
    else {
      const login = async () => { 
        try {
          let data = {
            wiperNum: wiperData.wiper,
            afternoon: activate//true or false
          }
          const response = await axios.post(loginWiper, JSON.stringify(data));
          console.log(response.data);
          if (response.status === 200 && response.data.code === "sw321") {
            btnnote = "Success";
            handleBtn(btnnote, btnclasssuccess);

            localStorage.setItem("wiperPost", response.data.msg[0].dutypost);//school name or lgea
            localStorage.setItem("wiperStaff", response.data.msg[0].staffname);//staff name
            localStorage.setItem("wiperNum", response.data.msg[0].wipernum);//wiper number
            localStorage.setItem("wiperAtt", response.data.msg[0].attstatus);//attendance status eg, yes or no - no means not submitted

            if (attId == null || attId.length == 0) {
              localStorage.setItem('attId', response.data.msg[0].wipernum);
            }

            if (response.data.msg[0].attstatus === "yes") {//this means user already submitted attendance, navigate to done
              navigate("/Done");
            }
            else if (response.data.msg[0].attstatus === "no") {
              navigate("/Form");
            }
          }
          else if (response.data.code === "sw311") {
            //this means the user clicked activate but not an afternoon school teacher
            navigate("/Afternoon");
          }
          else {
            btnnote = response.data.msg;
            handleBtn(btnnote, btnclasserror);
          }
        } catch (err) {
          btnnote = "Error Processing, try again";
          handleBtn(btnnote, btnclasserror);
        } 

        setStartLogin(false);
      }

      login();
    }
  }

  const handleAfternoon = () => {
    setToggleForm(true);
    setActivate(true);
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav/>

      <div className='relative grow'>
        <section className='flex'>
          <img src="logo1.jpeg" alt="Image" className='w-20 h-auto ml-5 mt-5 mb-5 rounded-full shadow-sm'/> 
          <aside className='mt-10'>
            <Header/>
          </aside>
        </section>
         
        <section className="">
          <h1 className='ml-6 pt-6 bg-green-900 text-white text-center p-3 py-5 rounded-l-xl font-bold'>Head Teacher Login</h1>
        </section>

        {toggleForm === true ?
          // <form action="#" onSubmit={handleLogin} className='text-sm mt-15 mx-10 flex flex-col items-center justify-center'>
          //   <select defaultValue="Select LGA" onChange={handleInput} id='lga' className="select select-primary mb-5">
          //     <option disabled={true}>Select LGA</option>
          //     <option value="Aguata">Aguata</option>
          //     <option value="Anaocha">Anaocha</option>
          //     <option value="Anambra East">Anambra East</option>
          //     <option value="Anambra West">Anambra West</option>
          //     <option value="Ayamelum">Ayamelum</option>
          //     <option value="Awka North">Awka North</option>
          //     <option value="Awka South">Awka South</option>
          //     <option value="Dunukofia">Dunukofia</option>
          //     <option value="Ekwusigo">Ekwusigo</option>
          //     <option value="Idemili North">Idemili North</option>
          //     <option value="Idemili South">Idemili South</option>
          //     <option value="Ihiala">Ihiala</option>
          //     <option value="Njikoka">Njikoka</option>
          //     <option value="Nnewi North">Nnewi North</option>
          //     <option value="Nnewi South">Nnewi South</option>
          //     <option value="Ogbaru">Ogbaru</option>
          //     <option value="Onitsha North">Onitsha North</option>
          //     <option value="Onitsha South">Onitsha South</option>
          //     <option value="Orumba North">Orumba North</option>
          //     <option value="Orumba South">Orumba South</option>
          //     <option value="Oyi">Oyi</option>
          //   </select>

          //   <select defaultValue="Select Staff Type" onChange={handleInput} id='sttype' className="select select-primary mb-5">
          //     <option disabled={true}>Select Staff Type</option>
          //     <option value="tutorial">Tutorial</option>
          //     <option value="nontutorial">Non Tutorial</option>
          //   </select>

          //   {staffType === "tutorial" ?
          //     <div>
          //       {/* <label htmlFor="sctype">For Tutorial Staff:</label> */}
          //       <select defaultValue="Select School Type" onChange={handleInput} id='sctype' className="select select-primary mb-5">
          //         <option disabled={true}>Select School Type</option>
          //         <option value="PP">Public Public</option>
          //         <option value="PM">Public Mission</option>
          //       </select>

          //       <select defaultValue="Select School" onChange={handleInput} id='schlname' className="select select-primary mb-5">
          //         <option disabled={true}>Select School</option>
          //         {schoolData ?
          //           schoolData.map((data, dataIndex) => {
          //             return (
          //               <option key={dataIndex} value={data.schoolName}>{data.schoolName}</option>
          //             )
          //           })
          //         :
          //           ""
          //         }
          //       </select>
          //     </div>
          //   :
          //     staffType === "nontutorial" ?
          //         <select defaultValue="Select LGEA" onChange={handleInput} id='schlname' className="select select-primary mb-5">
          //           <option disabled={true}>Select LGEA</option>
          //           {schoolData ?
          //             schoolData.map((data, dataIndex) => {
          //               return (
          //                 <option key={dataIndex} value={data.schoolName}>{data.schoolName}</option>
          //               )
          //             })
          //           :
          //             ""
          //           }
          //         </select>
          //     :
          //         ""
          //   }

          //   <input type="number" id='numteacher' placeholder="Number of staff" onChange={handleInput} className="input input-primary mb-2" />

          //   <div className="flex pb-8">
          //     {startLogin == "false" ?
          //       <button className="btn btn-success mt-6">
          //         Login
          //       </button> 
          //     :
          //       startLogin == "true" ?
          //         <button className="btn btn-success mt-6">
          //           <span className="loading loading-spinner"></span>
          //           Pocessing...
          //         </button>
          //       :
          //         startLogin == "lga" ?
          //           <button className="btn btn-secondary mt-6">
          //             Select Lga
          //           </button>
          //         :
          //         startLogin == "staff" ?
          //           <button className="btn btn-secondary mt-6">
          //             Enter staff number!
          //           </button>
          //         :
          //         startLogin == "sttype" ?
          //           <button className="btn btn-secondary mt-6">
          //             Select staff type!
          //           </button>
          //         :
          //           startLogin == "schl" ?
          //             <button className="btn btn-secondary mt-6">
          //               Select School
          //             </button>
          //           :
          //           startLogin == "schl2" ?
          //             <button className="btn btn-secondary mt-6">
          //               Select LGEA
          //             </button>
          //           :
          //             startLogin == "tut" ?
          //               <button className="btn btn-secondary mt-6">
          //                 Select school type
          //               </button>
          //             :
          //             startLogin == "numstaff" ?
          //               <button className="btn btn-secondary mt-6">
          //                 Invalid Staff Number!
          //               </button>
          //             :
          //               startLogin == "error" ?
          //                 <button className="btn btn-secondary mt-6">
          //                   No Access!!
          //                 </button>
          //               :
          //               <button className="btn btn-success mt-6">
          //                 Login
          //               </button>
          //     }
          //   </div>

          //   <div className='pb-10 flex flex-row items-center justify-center'>
          //     <p>
          //       For
          //       <Link to={"/Newschool"}>
          //         <button className="btn btn-primary mx-2">
          //           New Schools?
          //         </button>
          //       </Link>
          //       not on the list
          //     </p>
          //   </div>
          // </form>
          <div>
            <form action="#" onSubmit={handleLoginWiper} className='text-sm mt-15 mx-10 flex flex-col items-center justify-center'>
              <label htmlFor="wiper">Enter Wiper Number</label>
              <input type="number" id='wiper' placeholder="Wiper Number eg 6444555" onChange={handleWiper} className="input input-primary mb-2" />

              <div className='flex items-center justify-center whitespace-nowrap'>
                {startLogin == true ?
                    <button className="btn btn-secondary mt-6 ml-4">
                      <span className="loading loading-spinner"></span>
                      Pocessing...
                    </button>
                :
                    <button className={btnClass}>
                      {btnNote}
                    </button>
                }

                <button className='btn btn-warning mt-6 ml-4 text-black'>
                  <Link to={"/Forgotwiper"}>
                    Forgotten Wiper N0?
                  </Link>
                </button>
              </div>
            </form>

            <div className='text-center mt-5 text-red-600'>
              <p>
                Are you in afternoon school?
              </p>

              <button onClick={handleAfternoon} className='btn btn-primary mt-3 px-10'>
                  Activate
              </button>
            </div>
          </div>
        :
          <div>
            <div className='shadow-sm p-10 py-20 rounded-sm font-semibold bg-gray-100 m-2 mt-10 flex items-center justify-center'>
              <p className='animate__animated animate__bounceIn text-center'>
                Check Back on Monday Morning!
              </p>
            </div>

            <div className='text-center mt-5 text-red-600'>
              <p>
                Are you in afternoon school?
              </p>

              <button onClick={handleAfternoon} className='btn btn-primary mt-3 px-10'>
                  Activate
              </button>
            </div>
          </div>
        }
      </div>

      <Footer />
    </div>
  )
}

export default Home
