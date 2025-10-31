import React, { useRef, useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CapatainContext";
import axios from "axios";

const CaptainHome = () => {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext);
  const { captain, setCaptain } = useContext(CaptainDataContext);

  // ✅ Ensure captain is loaded
  useEffect(() => {
    async function ensureCaptain() {
      if (!captain && localStorage.getItem("token")) {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/captain/profile`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCaptain(res.data);
        } catch (e) {
          console.error("Failed to load captain profile", e);
        }
      }
    }
    ensureCaptain();
  }, [captain, setCaptain]);

  // ✅ Socket + Location + Ride listener
  useEffect(() => {
    if (!socket || !captain?._id) return;

    const timer = setTimeout(() => {
      socket.emit("join", { userId: captain._id, userType: "captain" });

      const updateLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            socket.emit("update-location-captain", {
              userId: captain._id,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
          });
        }
      };

      updateLocation();
      const locationInterval = setInterval(updateLocation, 10000);

      const handleNewRide = (data) => {
        setRide(data);
        setRidePopupPanel(true);
      };

      socket.on("new-ride", handleNewRide);

      return () => {
        clearInterval(locationInterval);
        if (socket && socket.off) socket.off("new-ride", handleNewRide);
      };
    }, 500);

    return () => clearTimeout(timer);
  }, [socket, captain]);

  // ✅ Confirm ride
  async function confirmRide() {
    if (!ride) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
        {
          rideId: ride._id,
          action: "accept",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
      }
    } catch (error) {
      console.error("Error confirming ride:", error);
    }
  }

  // ✅ GSAP animations
  useGSAP(
    function () {
      gsap.to(ridePopupPanelRef.current, {
        transform: ridePopupPanel ? "translateY(0)" : "translateY(100%)",
      });
    },
    [ridePopupPanel]
  );

  useGSAP(
    function () {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: confirmRidePopupPanel ? "translateY(0)" : "translateY(100%)",
      });
    },
    [confirmRidePopupPanel]
  );

  // ✅ UI
  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>

      <div className="h-3/5">
        <img
          className="h-full w-full object-cover"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjgBWkh-2RpEXtRmA1vxakcVsTzG3XVMnd3Q&s"
          alt=""
        />
      </div>

      <div className="h-2/5 p-6">
        <CaptainDetails />
      </div>

      <div
        ref={ridePopupPanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <RidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          confirmRide={confirmRide}
        />
      </div>

      <div
        ref={confirmRidePopupPanelRef}
        className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmRidePopUp
          ride={ride}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          setRidePopupPanel={setRidePopupPanel}
        />
      </div>
    </div>
  );
};

export default CaptainHome;
