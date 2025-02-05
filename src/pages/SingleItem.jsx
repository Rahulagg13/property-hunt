import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "../firebase";
import { Loader } from "../components/Loader";
import ImageCarousel from "../components/ImageCarousel";
import { FaBed, FaBath, FaMapMarkerAlt } from "react-icons/fa";
import { MapComponent } from "../components/MapComponent";
import { Label } from "../components/Label";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
// TODO: Use exact location for latitude and longitude
export const SingleItem = () => {
  const auth = getAuth();
  // console.log("Current user" + auth.currentUser.uid);
  const params = useParams();
  const [list, setList] = useState(null);
  const [loader, setLoader] = useState(true);
  const position = {
    lat: 60,
    lng: 60,
  };
  const fullbtn =
    "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500";
  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setList(docSnap.data());
        setLoader(false);
      } else {
        console.log("error");
        setLoader(false);
      }
    }
    fetchListing();
  }, [params.listingID]);
  const [owneremail, setOwnerEmail] = useState("ds9210048@gmail.com");
  // useEffect(()=> {
  //   const getOwner = async () => {
  //     const docRef = doc(db,"users",list.userRef);
  //     const docSnap = await getDoc(docRef);
  //     if(docSnap.exists()){
  //       console.log(docSnap.data());
  //       setOwnerEmail(docSnap.data().email)
  //     }
  //     else{
  //       toast.error("Not able to get owener's email")
  //     }
  //   }
  //   getOwner()
  // },[list.userRef])
  // console.log(owneremail)
  if (loader) {
    return <Loader />;
  }

  return (
    <section>
      <ImageCarousel images={list.imgUrls} />
      <div class="shadow-xl max-w-6xl rounded-lg mx-auto mt-4 lg:mx-auto border-[2px] border-red-500 mb-12">
        <div class="flex flex-col-reverse md:flex-row ">
          <div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 rounded-lg p-4 pb-0 mb-0">
            <div>
              <div className="">
                <span className="font-semibold text-2xl mb-2 flex items-baseline">
                  {list.name} - ₹
                  {list.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                  {list.type === "rent" && (
                    <p className="text-sm text-gray-500">/month</p>
                  )}
                </span>
              </div>
              <div className="mt-2 text-md text-red-500 font-semibold flex items-baseline">
                <FaMapMarkerAlt className="text-[12px] p-0 mr-1" />
                {list.address}
              </div>
              <div className="flex space-x-2 mt-2">
                <Label text={list.type === "sell" ? "Sale" : "Rent"} />
                {list.furnished && <Label text="Furnished" />}
                {list.parking && <Label text="Parking" />}
              </div>

              <div className="py-1 text-sm text-gray-800 w-full break-words">
                <div className="">{list.description}</div>
              </div>
              <div>
                {/* Details */}
                <ul className="flex mt-2">
                  <div className=" flex justify-center">
                    <FaBed className="text-2xl " /> <p className="px-2">4</p>
                  </div>
                  <div className=" flex justify-center">
                    <FaBath className="text-xl" /> <p className="px-2">4</p>
                  </div>
                </ul>
              </div>
              {list && list.userRef !== auth.currentUser?.uid && (
                <div className="py-2">
                  <form className="flex flex-col">
                    <textarea
                      className="mb-4 no-number-arrows mr-2 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                      type="text"
                      placeholder="Write a message to owner"
                    />
                    <button type="submit" className={fullbtn}>
                      Send Email
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div class="w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-0 h-72 sm:h-[400px]">
            <MapComponent position={position} />
          </div>
        </div>
      </div>
    </section>
  );
};
