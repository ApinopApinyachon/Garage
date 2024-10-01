import "./App.css";
import axios from "axios";
import React, { useState } from "react";

const baseURL = "http://localhost:4000";

function App() {
  const [cars, setCar] = React.useState([]);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    engine: "",
    licensePlate: "",
    ownerName: "",
    ownerContact: "",
  });
  const [currentCarId, setCurrentCarId] = useState(null);

  React.useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = () => {
    axios
      .get(`${baseURL}/readall`)
      .then((res) => {
        const carData = Array.isArray(res.data) ? res.data : [];
        setCar(carData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function openAddPopup() {
    // Reset formData to empty values
    setFormData({
      brand: "",
      model: "",
      year: "",
      color: "",
      engine: "",
      licensePlate: "",
      ownerName: "",
      ownerContact: "",
    });
    setShowAddPopup(true);
  }

  function createCar() {
    const isFormValid = Object.values(formData).every(
      (value) => typeof value === "string" && value.trim() !== ""
    );

    if (!isFormValid) {
      alert("Please fill in all fields!");
      return;
    }

    axios
      .post(`${baseURL}/create`, {
        ...formData,
        owner: {
          name: formData.ownerName,
          contact: formData.ownerContact,
        },
      })
      .then((res) => {
        setCar((prevCars) => [...prevCars, res.data]);
        setShowAddPopup(false);
        fetchCarData();
      })
      .catch((error) => {
        console.error("Error creating car:", error);
      });
  }

  function updateCar() {
    axios
      .put(`${baseURL}/update/${currentCarId}`, {
        ...formData,
        owner: {
          name: formData.ownerName,
          contact: formData.ownerContact,
        },
      })
      .then((res) => {
        setCar((prevCars) =>
          prevCars.map((car) => (car._id === currentCarId ? res.data : car))
        );
        setShowEditPopup(false);
        fetchCarData();
      })
      .catch((error) => {
        console.error("Error updating car:", error);
      });
  }

  function deleteCar(id) {
    axios
      .delete(`${baseURL}/delete/${id}`)
      .then(() => {
        alert("Car deleted!");
        setCar((prevCars) => prevCars.filter((car) => car._id !== id));
      })
      .catch((error) => {
        console.error("Error deleting car:", error);
      });
  }

  function openUpdatePopup(car) {
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year,
      color: car.color,
      engine: car.engine,
      licensePlate: car.licensePlate,
      ownerName: car.owner.name,
      ownerContact: car.owner.contact,
    });
    setCurrentCarId(car._id);
    setShowEditPopup(true);
  }

  if (!cars.length) return "No Car!!!";

  return (
    <div className="App">
      <header className="header">
        <h1>MY GARAGE</h1>
        <div className="right-button">
          <button className="add-car-button" onClick={openAddPopup}>
            Add Car
          </button>
        </div>
      </header>

      <main className="main-content">
        {cars.map((car) => (
          <Card
            key={car._id}
            imageSrc="https://via.placeholder.com/200x100"
            content={car.model}
            details={car}
            onEdit={openUpdatePopup}
            onDelete={deleteCar}
          />
        ))}
      </main>

      {showAddPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add New Car</h2>
            <form className="car-form">
              <label className="car-label">
                Brand:
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter brand"
                />
              </label>
              <label className="car-label">
                Model:
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter model"
                />
              </label>

              <label className="car-label">
                Year:
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter year"
                />
              </label>
              <label className="car-label">
                Color:
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter color"
                />
              </label>

              <label className="car-label">
                Engine:
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter engine type"
                />
              </label>
              <label className="car-label">
                License Plate:
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter license plate"
                />
              </label>

              <label className="car-label">
                Owner Name:
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter owner's name"
                />
              </label>
              <label className="car-label">
                Owner Contact:
                <input
                  type="text"
                  name="ownerContact"
                  value={formData.ownerContact}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter owner's contact"
                />
              </label>

              <button type="button" onClick={createCar} className="car-button">
                OK
              </button>
              <button
                type="button"
                onClick={() => setShowAddPopup(false)}
                className="car-button cancel"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Edit Car Details</h2>
            <form className="car-form">
              <label className="car-label">
                Brand:
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter brand"
                />
              </label>
              <label className="car-label">
                Model:
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter model"
                />
              </label>

              <label className="car-label">
                Year:
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter year"
                />
              </label>
              <label className="car-label">
                Color:
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter color"
                />
              </label>

              <label className="car-label">
                Engine:
                <input
                  type="text"
                  name="engine"
                  value={formData.engine}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter engine type"
                />
              </label>
              <label className="car-label">
                License Plate:
                <input
                  type="text"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter license plate"
                />
              </label>

              <label className="car-label">
                Owner Name:
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter owner's name"
                />
              </label>
              <label className="car-label">
                Owner Contact:
                <input
                  type="text"
                  name="ownerContact"
                  value={formData.ownerContact}
                  onChange={handleInputChange}
                  className="car-input"
                  placeholder="Enter owner's contact"
                />
              </label>

              <button type="button" onClick={updateCar} className="car-button">
                Update
              </button>
              <button
                type="button"
                onClick={() => setShowEditPopup(false)}
                className="car-button cancel"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const Card = ({ imageSrc, content, details, onEdit, onDelete }) => {
  const [showDetailPopup, setShowDetailPopup] = useState(false);

  const handleDetailPopup = () => {
    setShowDetailPopup(!showDetailPopup);
  };

  return (
    <div className="card">
      <div className="card-image">
        <img src={imageSrc} alt="Card visual" />
      </div>
      <div className="card-content">
        <p>{content}</p>
      </div>
      <div className="card-buttons">
        <div className="left-buttons">
          <button onClick={handleDetailPopup}>Detail</button>
        </div>

        <div className="right-buttons">
          <button className="icon-button" onClick={() => onEdit(details)}>
            <span className="material-symbols-outlined">edit</span>
          </button>
          <button className="icon-button" onClick={() => onDelete(details._id)}>
            <span className="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      {showDetailPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Car Details</h2>
            <p>
              <strong>Brand:</strong> {details.brand}
            </p>
            <p>
              <strong>Model:</strong> {details.model}
            </p>
            <p>
              <strong>Year:</strong> {details.year}
            </p>
            <p>
              <strong>Color:</strong> {details.color}
            </p>
            <p>
              <strong>Engine:</strong> {details.engine}
            </p>
            <p>
              <strong>License Plate:</strong> {details.licensePlate}
            </p>
            <h3>Owner Information</h3>
            <p>
              <strong>Name:</strong> {details.owner.name}
            </p>
            <p>
              <strong>Contact:</strong> {details.owner.contact}
            </p>
            <button onClick={handleDetailPopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
