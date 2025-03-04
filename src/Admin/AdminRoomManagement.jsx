import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "../Utils/uploadImageToCloudinary";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Checkbox, Select } from "../Layout/Components";
import { PlusCircle, Trash2, Edit, Image } from "lucide-react";
import { app } from "../Firebase/Firebase";

const db = getFirestore(app);

export default function AdminRoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    guests: 2,
    wifi: true,
    bathroom: true,
    status: "Available",
    ratePerDay: 0,
  });

  // Fetch rooms from Firebase on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      const querySnapshot = await getDocs(collection(db, "rooms"));
      const roomsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRooms(roomsData);
    };

    fetchRooms();
  }, []);

  // Handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Add a new room
  const addRoom = async () => {
    if (!selectedFile) {
      alert("Please select an image before adding a room.");
      return;
    }
  
    setLoading(true);
  
    try {
      const imageUrl = await uploadImageToCloudinary(selectedFile);
  
      const newRoom = {
        name: formData.name,
        image: imageUrl,
        guests: parseInt(formData.guests),
        wifi: formData.wifi,
        bathroom: formData.bathroom,
        status: formData.status,
        ratePerDay: parseFloat(formData.ratePerDay), // Add this line
      };
  
      const docRef = await addDoc(collection(db, "rooms"), newRoom);
  
      setRooms([...rooms, { id: docRef.id, ...newRoom }]);
  
      setSelectedFile(null);
      setPreview("");
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Delete a room
  const deleteRoom = async (id) => {
    try {
      await deleteDoc(doc(db, "rooms", id));
      setRooms(rooms.filter((room) => room.id !== id));
    } catch (error) {
      console.error("Error deleting room:", error);
      alert("Failed to delete room. Please try again.");
    }
  };

  // Open edit modal and populate form data
  const openEditModal = (room) => {
    setFormData({
      id: room.id,
      name: room.name,
      guests: room.guests,
      wifi: room.wifi,
      bathroom: room.bathroom,
      status: room.status,
    });
    setIsEditModalOpen(true);
  };

  // Edit an existing room
  const editRoom = async () => {
    try {
      const roomRef = doc(db, "rooms", formData.id);
      await updateDoc(roomRef, {
        name: formData.name,
        guests: parseInt(formData.guests),
        wifi: formData.wifi,
        bathroom: formData.bathroom,
        status: formData.status,
        ratePerDay: parseFloat(formData.ratePerDay), // Add this line
      });
  
      const updatedRooms = rooms.map((room) =>
        room.id === formData.id ? { ...room, ...formData } : room
      );
      setRooms(updatedRooms);
  
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room. Please try again.");
    }
  };

  return (
    <div className={`p-6 ${(isAddModalOpen || isEditModalOpen) ? "" : ""}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
          <PlusCircle size={18} /> Add Room
        </Button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="p-4 shadow-lg">
            <CardContent>
              {room.image ? (
                <img src={room.image} alt={room.name} className="w-full h-40 object-cover mb-2 rounded-lg" />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded-lg">
                  <Image size={24} className="text-gray-400" />
                </div>
              )}
              <h2 className="text-lg font-semibold">{room.name}</h2>
              <p className="text-sm text-gray-600">Max Guests: {room.guests}</p>
              <p className="text-sm text-gray-600">WiFi: {room.wifi ? "Yes" : "No"}</p>
              <p className="text-sm text-gray-600">Bathroom: {room.bathroom ? "Yes" : "No"}</p>
              <p className={`text-sm font-semibold mt-2 ${room.status === "Available" ? "text-green-500" : room.status === "Occupied" ? "text-red-500" : "text-yellow-500"}`}>
                {room.status}
              </p>
              <p className="text-sm text-gray-600">Rate Per Day: ₱{room.ratePerDay?.toLocaleString() || "N/A"}</p>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => openEditModal(room)}>
                  <Edit size={16} />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteRoom(room.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Room Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Room Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter room name"
              />
            </div>
            <div>
              <Label>Max Guests</Label>
              <Input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                placeholder="Enter max guests"
              />
            </div>
            <div>
              <Label>WiFi</Label>
              <Checkbox
                name="wifi"
                checked={formData.wifi}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Bathroom</Label>
              <Checkbox
                name="bathroom"
                checked={formData.bathroom}
                onChange={handleInputChange}
              />
            </div>
            <div>
  <Label>Rate Per Day</Label>
  <Input
    type="number"
    name="ratePerDay"
    value={formData.ratePerDay}
    onChange={handleInputChange}
    placeholder="Enter rate per day"
  />
</div>

            <div>
              <Label>Status</Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
              
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Limited Available">Limited Available</option>
              </Select>
            </div>
            <div>
              <Label>Room Image</Label>
              <input type="file" onChange={handleFileChange} className="mb-2" />
              {preview && <img src={preview} alt="Preview" className="w-full h-40 object-cover mb-2 rounded-lg" />}
            </div>
            <Button onClick={addRoom} disabled={loading} className="w-full">
              {loading ? "Uploading..." : "Add Room"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Room Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter room name"
              />
            </div>
            <div>
              <Label>Max Guests</Label>
              <Input
                type="number"
                name="guests"
                value={formData.guests}
                onChange={handleInputChange}
                placeholder="Enter max guests"
              />
            </div>
            <div>
              <Label>WiFi</Label>
              <Checkbox
                name="wifi"
                checked={formData.wifi}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <Label>Bathroom</Label>
              <Checkbox
                name="bathroom"
                checked={formData.bathroom}
                onChange={handleInputChange}
              />
            </div>

            <div>
  <Label>Rate Per Day</Label>
  <Input
    type="number"
    name="ratePerDay"
    value={formData.ratePerDay}
    onChange={handleInputChange}
    placeholder="Enter rate per day"
  />
</div>
            <div>
              <Label>Status</Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Limited Available">Limited Available</option>
              </Select>
            </div>
            <Button onClick={editRoom} className="w-full">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}