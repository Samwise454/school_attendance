import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Nav from './components/Nav';
import Header from './components/Header';
import axios from 'axios';

const Home = () => {
  const navigate = useNavigate();
  const api = "https://asubeb.esbatech.org/attendance/login.php";
  const fetchSchool = "https://asubeb.esbatech.org/attendance/fetchSchool.php";
  const [schoolData, setSchoolData] = useState([]);
  const [startLogin, setStartLogin] = useState("false");
  const [toggleForm, setToggleForm] = useState(true);//form not showing which means, it's not Monday
  const [uid, setUid] = useState({
    schlname: "",
    lga: "",
    sctype: "",
    sttype: "",
    numteacher: ""
  });
  const [staffType, setStaffType] = useState("");

  const [user, setUser] = useState(localStorage.getItem("asubebTid"));
  const checkUserApi = "https://asubeb.esbatech.org/attendance/checkUser.php";
  const [schoolName, setSchoolName] = useState(localStorage.getItem("asubebAttSchool"));
  const [lga, setLga] = useState(localStorage.getItem("asubebAttLga"));
  const [staffTypeLocal, setStaffTypeLocal] = useState(localStorage.getItem("asubebAttStaffType"));

  useEffect(() => {
      if (user !== null && schoolName !== null && lga !== null && staffTypeLocal !== null) {
          navigate("/Form");
      }
      // const checkUser = async () => {
      //     try {
      //         const response = await axios.post(checkUserApi, JSON.stringify(user));
      //         // console.log(response)
      //         if (response.status === 200 && response.data.code === "sw321") {//active
      //             navigate("/Form");
      //         }
      //         else if (response.status === 200 && response.data.code === "sw320") {//done
      //             navigate("/Done");
      //         }
      //         else if (response.status === 200 && response.data.code === "sw322") {//pending
      //             navigate("/Form");
      //         }
      //     } catch (err) {
      //         console.log(err)
      //     }
      // }
      // checkUser();
  }, [user, schoolName, lga, staffTypeLocal]);

  const whichDay = new Date().getDay();//to check if it's Monday (1)

  // useEffect(() => {
  //   if (whichDay === 1) {
  //     setToggleForm(true);
  //   }
  //   else {
  //     setToggleForm(false);
  //   }
  // }, [whichDay]);

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

  const handleLogin = (e) => {
    e.preventDefault();

    if (uid.lga === "" || uid.numteacher === "") {
      setStartLogin("lga_staff"); 
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

  return (
    <div>
      <Nav/>

      <div className='relative'>
        
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
          <form action="#" onSubmit={handleLogin} className='text-sm mt-15 mx-10 flex flex-col items-center justify-center'>
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
                {/* <label htmlFor="sctype">For Tutorial Staff:</label> */}
                <select defaultValue="Select School Type" onChange={handleInput} id='sctype' className="select select-primary mb-5">
                  <option disabled={true}>Select School Type</option>
                  <option value="PP">Public Public</option>
                  <option value="PM">Public Mission</option>
                </select>

                <select defaultValue="Select School" onChange={handleInput} id='schlname' className="select select-primary mb-5">
                  <option disabled={true}>Select School</option>
                  {schoolData ?
                    schoolData.map((data, dataIndex) => {
                      return (
                        <option key={dataIndex} value={data.schoolName}>{data.schoolName}</option>
                      )
                    })
                  :
                    ""
                  }
                </select>
              </div>
            :
              staffType === "nontutorial" ?
                  <select defaultValue="Select LGEA" onChange={handleInput} id='schlname' className="select select-primary mb-5">
                    <option disabled={true}>Select LGEA</option>
                    {schoolData ?
                      schoolData.map((data, dataIndex) => {
                        return (
                          <option key={dataIndex} value={data.schoolName}>{data.schoolName}</option>
                        )
                      })
                    :
                      ""
                    }
                  </select>
              :
                  ""
            }

            <input type="number" id='numteacher' placeholder="Number of staff" onChange={handleInput} className="input input-primary mb-2" />

            <div className="flex pb-30">
              {startLogin == "false" ?
                <button className="btn btn-success mt-6">
                  Login
                </button> 
              :
                startLogin == "true" ?
                  <button className="btn btn-success mt-6">
                    <span className="loading loading-spinner"></span>
                    Logging In...
                  </button>
                :
                  startLogin == "lga_staff" ?
                    <button className="btn btn-secondary mt-6">
                      Select Lga and N0 of Staff
                    </button>
                  :
                    startLogin == "tut" ?
                      <button className="btn btn-secondary mt-6">
                        Select school type
                      </button>
                    :
                      startLogin == "error" ?
                        <button className="btn btn-secondary mt-6">
                          Error Processing
                        </button>
                      :
                      <button className="btn btn-success mt-6">
                        Login
                      </button>
              }
            </div>
          </form>
        :
          <div className='shadow-sm p-10 py-20 rounded-sm font-semibold bg-gray-100 m-2 mt-10 flex items-center justify-center'>
            <p className='animate__animated animate__bounceIn'>
              Check Back on Monday!
            </p>
          </div>
        }
      </div>
    </div>
  )
}

export default Home
