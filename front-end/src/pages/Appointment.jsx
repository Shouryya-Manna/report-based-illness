import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { AppContext } from '../Context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {

 const {docId}= useParams()
 const {doctors,currencySymbol}=useContext(AppContext)
 const daysofWeeks = ['SUN','MON','TUE','WED','THU','FRI','SAT']
 
 
 const[docInfo,setDocInfo]= useState(null)
 const[docSlots,setDocSlots]=useState([])
 const[slotIndex,setSlotIndex]=useState(0)
 const[slotTime,setSlotTime]=useState('')



 const fetchDocInfo = async ()=> {
  const docInfo = doctors.find( doc => doc._id === docId)
   setDocInfo(docInfo)
   console.log(docInfo)


}

useEffect(()=> {

  fetchDocInfo()




},[doctors,docId])

const getAvailableSlots = async ()=> {

    setDocSlots([])

    // Geeting current date

    let today= new Date();

    for(let i=0;i<7;i++)
    {
        //  Geeting date with index 
        let currentdate= new Date(today)
        currentdate.setDate(today.getDate()+i);

        // seeting end time of the date s
        let endtime = new Date();
        endtime.setDate(today.getDate()+i)
        endtime.setHours(21,0,0,0)

        //Seeting hours
        if (today.getDate() === currentdate.getDate()) {
          let now = new Date();
          let minutes = now.getMinutes();
          now.setMinutes(minutes > 30 ? 0 : 30);
          if (minutes > 30) now.setHours(now.getHours() + 1);
      
          now.setSeconds(0);
          now.setMilliseconds(0);
          currentdate.setHours(now.getHours(), now.getMinutes(), 0, 0);
      } else {
          currentdate.setHours(10, 0, 0, 0);
      }

        let timeSlots = []

        while(currentdate < endtime)
        {
            let formattedTime = currentdate.toLocaleTimeString([],{hour: "2-digit", minute:"2-digit"})
              //Add slot to aarray 
            timeSlots.push({
              datetime: new Date(currentdate),
              time:formattedTime

            })

            //Increment current time by 30 minutes
             
            currentdate.setMinutes(currentdate.getMinutes()+30)

       
        }

          setDocSlots(prev=> ([...prev, timeSlots]))
          
    }
} 

useEffect(()=> {

  getAvailableSlots()

},[docInfo])

useEffect(()=> {

  console.log(docSlots)

},[docSlots])


  return docInfo && (
    <div>

    {/*------- Doctors details------ */}

       <div className=' flex flex-col sm:flex-row gap-4'>
          <div>
              
              {/* ----- Dcotor Details ----  */}
                <img className=' bg-primary w-full sm:max-w-72 rounded-lg
                ' src={docInfo.image} alt="" />
         </div>
          
          <div className=' flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 '  >

            {/* ------ Doc Info : Name , degree, experience */}
            <p className=' flex items-center gap-2 text-2xl font-medium text-gray-900  '>{docInfo.name} 
            <img className='w-5' src={assets.verified_icon} alt="" />
            </p> 
            <div className=' flex items-center gap-2 text-sm text-gray-600'>

            <p>{docInfo.degree} - {docInfo.speciality} </p>
            <button className=' py-0.5 px-2 border text-xs rounded-full '>{docInfo.experience}</button>

            </div>

            {/*-------  Doctor About ----- */}

            <div>

            <p className=' flex items-center gap-1 test-sm font-medium text-gray-900 mt-3   '>About <img src={assets.docInfo} alt="" /></p>
            <p className=' text-sm text-gray-500 max-w-[700px] mt-1 '>{docInfo.about}</p>
            </div>
            <p className=' text-gray-500 font-medium mt-4  '>
              Appointment fee: <span className=' text-gray-600'>{currencySymbol} {docInfo.fees}</span>
            </p>



          


         
         
          </div>

       </div>

       {/* ------ Booking slots------ */}
        
        <div className=' sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700   '>
          

          <p>Booking Slots</p>
          <div className=' flex items-center gap-3 w-full overflow-x-scroll mt-4 '> 
            {
              docSlots.length && docSlots.map((item,index)=> (
               

              <div onClick={()=> {
                setSlotIndex(index)
              }} className={` text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ?'bg-primary text-white' : ' border border-gray-200  '}  `} key={index} > 
            
              <p>{item[0] && daysofWeeks[item[0].datetime.getDay()] }</p>

              <p>{item[0] && item[0].datetime.getDate()}</p>



              </div>
                
              ))
            }
          </div>

          <div className=' flex items-center gap-3 w-full overflow-x-scroll mt-4 '>

            {
              docSlots.length && docSlots[slotIndex].map((item,index)=>(
                <p onClick={()=>setSlotTime(item.time) } className={` text-sm font-light flex-shrink-0 px-5 py-2  rounded-full cursor-pointer ${item.time === slotTime ? ' bg-primary text-white ' : ' text-gray-400 border border-gray-300 '}`} key={index}  >
                
                 {
                   item.time.toLowerCase()

                 }


                </p>

              ))
            }
          </div>

          <button className=' bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6 '>Book an appointment</button>

         

         

        </div>

        {/* Listing  Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>

        


    </div>
    
  )
}

export default Appointment