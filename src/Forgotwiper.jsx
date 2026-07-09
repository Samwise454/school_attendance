import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Header from './components/Header';
import axios from 'axios';

const Forgotwiper = () => {
    const navigate = useNavigate();
    const [startLogin, setStartLogin] = useState(false);//old data is "false"
    const [forgotData, setForgotData] = useState({
        staffname: "",
        lga: "",
        stafftype: ""
    });
    const [btnClass, setBtnClass] = useState("btn btn-success mt-6");//new update
    const [btnNote, setBtnNote] = useState('Submit');
    const [wiperNum, setWiperNum] = useState("");
    const fetchWiper = "https://asubeb.esbatech.org/attendance/fetchwiper.php";

    const handleInput = (e) => {
        let id = e.target.id;
        let val = e.target.value;
        setForgotData({...forgotData, [id]:val});
    }

    const getWiperNum = (e) => {
        e.preventDefault();

        let btnclasserror = 'btn btn-secondary mt-6 ml-4';
        let btnclasssuccess = 'btn btn-success mt-6 ml-4';
        let btnnote = "";

        setStartLogin(true);

        const handleBtn = (btnnote, btnclass) => {
            setBtnNote(btnnote);
            setBtnClass(btnclass);

            setTimeout(() => {
                setBtnNote("Submit");
                setBtnClass('btn btn-success mt-6 ml-4');
            }, 3000);
        }

        const login = async () => { 
        try {
          const response = await axios.post(fetchWiper, JSON.stringify(forgotData));
        //   console.log(response.data);
          if (response.status === 200 && response.data.code === "sw321") {
            btnnote = "Success";
            handleBtn(btnnote, btnclasssuccess);
            setWiperNum(response.data.msg);
          }
          else {
            btnnote = response.data.msg;
            handleBtn(btnnote, btnclasserror);
            setWiperNum("");
          }
        } catch (err) {
            // console.log(err)
          btnnote = "Error Processing, try again!";
          handleBtn(btnnote, btnclasserror);
          setWiperNum("");
        } 

        setStartLogin(false);
      }

      login();

    }

  return (
    <div className='flex flex-col min-h-screen'>
      <Nav/>

        <div className='grow'>
            <section className='flex'>
                <img src="logo1.jpeg" alt="Image" className='w-20 h-auto ml-5 mt-5 mb-5 rounded-full shadow-sm'/> 
                <aside className='mt-10'>
                    <Header/>
                </aside>
            </section>

            <p className='text-left text-sm leading-6 px-5'>
                <i>
                    <b>Forgotten your wiper number?</b> <br />
                    Fill the form below carefully in thesame 
                    order you did during registration, starting 
                    first with surname eg: Onu Ada Lucy.
                    <b> Remember to add a space after each name.</b>
                </i>
            </p>

            <form action="#" onSubmit={getWiperNum} className='shadow-sm flex flex-col text-sm mx-4 rounded-sm p-6 my-5 border-gray-100'>
                <label htmlFor="staffname">Full name you registered with</label>
                <input type="text" placeholder='Surname first eg: Onu Ada Lucy' id='staffname' onChange={handleInput} className='input input-primary mb-6' />

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

                <select defaultValue="Select Staff Mode" onChange={handleInput} id='stafftype' className="select select-primary mb-5">
                    <option disabled={true}>Select Staff Mode</option>
                    <option value="Tutorial">Tutorial</option>
                    <option value="Non Tutorial">Non Tutorial</option>
                </select>

                <div className='flex items-center justify-center'>
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
                </div>

                {wiperNum == "" ?
                    ""
                :
                    <div className='mt-7 leading-7'>
                        Below is your wiper number: <br />
                        <b className='text-[18px] tracking-widest'>{wiperNum}</b><br />

                        <button className='btn btn-primary'>
                            <Link to={'/'}>
                                Go Back & Login
                            </Link>
                        </button>
                    </div>
                }
            </form>

            <div className='flex flex-col items-center justify-center mt-8 pb-20'>
                <p className='italic text-sm text-red-600'>
                    Not yet registered on the portal? 
                </p>

                <section className='mt-5'>
                    <Link to={"/Register"}>
                        <button className="btn btn-warning text-black">
                            Register and Mark Attendance
                        </button>
                    </Link>
                </section>
            </div>
        </div>

      <Footer/>
    </div>
  )
}

export default Forgotwiper
