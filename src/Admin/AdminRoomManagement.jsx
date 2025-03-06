import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "../Utils/uploadImageToCloudinary";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Checkbox, Select } from "../Layout/Components";
import { PlusCircle, Trash2, Edit, Image } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        alert("Failed to fetch rooms. Please try again.");
      }
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

  // Reset form data
  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      guests: 2,
      wifi: true,
      bathroom: true,
      status: "Available",
      ratePerDay: 0,
    });
    setSelectedFile(null);
    setPreview("");
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
        ratePerDay: parseFloat(formData.ratePerDay),
      };

      const docRef = await addDoc(collection(db, "rooms"), newRoom);

      setRooms([...rooms, { id: docRef.id, ...newRoom }]);

      resetForm();
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
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await deleteDoc(doc(db, "rooms", id));
        setRooms(rooms.filter((room) => room.id !== id));
      } catch (error) {
        console.error("Error deleting room:", error);
        alert("Failed to delete room. Please try again.");
      }
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
      ratePerDay: room.ratePerDay,
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
        ratePerDay: parseFloat(formData.ratePerDay),
      });

      const updatedRooms = rooms.map((room) =>
        room.id === formData.id ? { ...room, ...formData } : room
      );
      setRooms(updatedRooms);

      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Room Management</h1>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white"
        >
          <PlusCircle size={18} /> Add Room
        </Button>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Card key={room.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-0">
              {room.image ? (
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
                  <Image size={24} className="text-gray-400" />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{room.name}</h2>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Max Guests: {room.guests}</p>
                  <p>WiFi: {room.wifi ? "Yes" : "No"}</p>
                  <p>Bathroom: {room.bathroom ? "Yes" : "No"}</p>
                  <p className={`font-semibold ${room.status === "Available" ? "text-green-500" : room.status === "Occupied" ? "text-red-500" : "text-yellow-500"}`}>
                    Status: {room.status}
                  </p>
                  <p>Rate Per Day: ₱{room.ratePerDay?.toLocaleString() || "N/A"}</p>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(room)}
                    className="text-orange-600 border-orange-600 hover:bg-purple-50"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteRoom(room.id)}
                    className="text-white bg-red-400 hover:bg-red-500"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Room Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <AnimatePresence>
          {isAddModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto p-6 z-10 relative">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">Add New Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Room Name</Label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter room name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Max Guests</Label>
                    <Input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      placeholder="Enter max guests"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">WiFi</Label>
                    <Checkbox
                      name="wifi"
                      checked={formData.wifi}
                      onChange={handleInputChange}
                      className="text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Bathroom</Label>
                    <Checkbox
                      name="bathroom"
                      checked={formData.bathroom}
                      onChange={handleInputChange}
                      className="text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Rate Per Day</Label>
                    <Input
                      type="number"
                      name="ratePerDay"
                      value={formData.ratePerDay}
                      onChange={handleInputChange}
                      placeholder="Enter rate per day"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Status</Label>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Room Image</Label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="mt-2 w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <Button
                    onClick={addRoom}
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    {loading ? "Uploading..." : "Add Room"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <AnimatePresence>
          {isEditModalOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-auto p-6 z-10 relative">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">Edit Room</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Room Name</Label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter room name"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Max Guests</Label>
                    <Input
                      type="number"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      placeholder="Enter max guests"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">WiFi</Label>
                    <Checkbox
                      name="wifi"
                      checked={formData.wifi}
                      onChange={handleInputChange}
                      className="text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Bathroom</Label>
                    <Checkbox
                      name="bathroom"
                      checked={formData.bathroom}
                      onChange={handleInputChange}
                      className="text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Rate Per Day</Label>
                    <Input
                      type="number"
                      name="ratePerDay"
                      value={formData.ratePerDay}
                      onChange={handleInputChange}
                      placeholder="Enter rate per day"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium text-gray-700">Status</Label>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Available">Available</option>
                      <option value="Occupied">Occupied</option>
                      <option value="Under Maintenance"> Under Maintenance</option>
                    </Select>
                  </div>
                  <Button
                    onClick={editRoom}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
}