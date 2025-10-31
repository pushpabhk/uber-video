import React, { useEffect, useState } from "react";

const WaitingForDriver = ({ ride, waitingForDriver }) => {
  const [captain, setCaptain] = useState(null);
  const [otp, setOtp] = useState(null);

  useEffect(() => {
    if (ride && ride.captain) {
      setCaptain(ride.captain);
    }
    if (ride && ride.otp) {
      setOtp(ride.otp);
    }
  }, [ride]);

  return (
    <div className="bg-white p-6 rounded-t-3xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">
        🚗 Driver Found!
      </h2>

      {captain ? (
        <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn-icons-png.flaticon.com/512/147/147144.png"
              alt="Driver"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="font-medium text-lg">
                {captain.name || "Captain"}
              </h3>
              <p className="text-sm text-gray-500">
                {captain.vehicle?.vehicleType || "Vehicle"} •{" "}
                {captain.vehicle?.plate || "XXXX-XXXX"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center mb-4">
          Waiting for driver confirmation...
        </p>
      )}

      {otp && (
        <div className="text-center mb-4">
          <h4 className="text-lg font-semibold">Your OTP</h4>
          <div className="text-3xl font-bold tracking-widest text-green-600">
            {otp}
          </div>
          <p className="text-sm text-gray-500">Share this OTP only with your driver</p>
        </div>
      )}

      <div className="border-t pt-4">
        <h4 className="text-lg font-medium mb-1">Pickup:</h4>
        <p className="text-gray-700 mb-3">{ride?.pickup}</p>

        <h4 className="text-lg font-medium mb-1">Destination:</h4>
        <p className="text-gray-700 mb-3">{ride?.destination}</p>

        <div className="flex justify-between text-gray-700 font-semibold mt-3">
          <span>Fare:</span>
          <span>₹{ride?.fare}</span>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
