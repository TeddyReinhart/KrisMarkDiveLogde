import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "../Utils/uploadImageToCloudinary";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Input, Label, Checkbox, Select } from "../Layout/Components";
import { PlusCircle, Trash2, CheckCircle, Edit, Image, Wifi, ShowerHead, Users, DollarSign } from "lucide-react";
import { app } from "../Firebase/Firebase";

const db = getFirestore(app);

export default function AdminRoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    guests: 2,
    wifi: true,
    bathroom: true,
    status: "Available",
    ratePerDay: 0,
    description: "",
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
      description: "",
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
        description: formData.description || "",
      };

      const docRef = await addDoc(collection(db, "rooms"), newRoom);

      setRooms([...rooms, { id: docRef.id, ...newRoom }]);
      resetForm();
      setIsAddModalOpen(false);
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error("Error adding room:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a room
  const deleteRoom = async () => {
    if (!roomToDelete) return;
    
    try {
      await deleteDoc(doc(db, "rooms", roomToDelete));
      setRooms(rooms.filter((room) => room.id !== roomToDelete));
      setIsDeleteModalOpen(false);
      setRoomToDelete(null);
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error("Error deleting room:", error);
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
      description: room.description || "",
    });
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (roomId) => {
    setRoomToDelete(roomId);
    setIsDeleteModalOpen(true);
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
        description: formData.description || "",
      });

      const updatedRooms = rooms.map((room) =>
        room.id === formData.id ? { ...room, ...formData } : room
      );
      setRooms(updatedRooms);

      setIsEditModalOpen(false);
      setIsConfirmModalOpen(true);
      resetForm();
    } catch (error) {
      console.error("Error updating room:", error);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Occupied":
        return "bg-red-100 text-red-800";
      case "Under Maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <Card key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            <CardContent className="p-0">
              <div className="relative">
                {room.image ? (
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="w-full h-56 bg-gray-200 flex items-center justify-center">
                    <Image size={32} className="text-gray-400" />
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                    {room.status}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800 mb-3">{room.name}</h2>
                
                {room.description && (
                  <p className="text-gray-600 text-sm mb-4">{room.description}</p>
                )}
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} className="text-orange-500" />
                    <span>Max {room.guests} {room.guests === 1 ? 'Guest' : 'Guests'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <DollarSign size={16} className="text-orange-500" />
                    <span>₱{room.ratePerDay?.toLocaleString() || "0"}/day</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Wifi size={16} className={room.wifi ? "text-orange-500" : "text-gray-400"} />
                    <span>WiFi {room.wifi ? "Available" : "Not Available"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShowerHead size={16} className={room.bathroom ? "text-orange-500" : "text-gray-400"} />
                    <span>Bathroom {room.bathroom ? "Available" : "Not Available"}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(room)}
                    className="text-orange-600 border-orange-600 hover:bg-orange-50"
                  >
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteModal(room.id)}
                    className="text-white bg-red-500 hover:bg-red-600"
                  >
                    <Trash2 size={16} className="mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Room Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Add New Room</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new room to your inventory.
            </DialogDescription>
          </DialogHeader>
          {/* Scrollable Content */}
          <div className="space-y-4 max-h-[70vh] overflow-y-auto"> 
            <div>
              <Label className="block text-sm font-medium text-gray-700">Room Name</Label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter room name"
                className="w-full"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Description</Label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the room"
                className="w-full"
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
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="wifi"
                name="wifi"
                checked={formData.wifi}
                onChange={handleInputChange}
              />
              <Label htmlFor="wifi" className="text-sm font-medium text-gray-700">WiFi Available</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="bathroom"
                name="bathroom"
                checked={formData.bathroom}
                onChange={handleInputChange}
              />
              <Label htmlFor="bathroom" className="text-sm font-medium text-gray-700">Bathroom Available</Label>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Rate Per Day (₱)</Label>
              <Input
                type="number"
                name="ratePerDay"
                value={formData.ratePerDay}
                onChange={handleInputChange}
                placeholder="Enter rate per day"
                className="w-full"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full"
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
                className="w-full"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-2 w-full h-40 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
          {/* Dialog Footer (Non-scrollable) */}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={addRoom}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? "Uploading..." : "Add Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Edit Room</DialogTitle>
            <DialogDescription>
              Update the details of your room.
            </DialogDescription>
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
                className="w-full"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Description</Label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the room"
                className="w-full"
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
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="wifi-edit"
                name="wifi"
                checked={formData.wifi}
                onChange={handleInputChange}
              />
              <Label htmlFor="wifi-edit" className="text-sm font-medium text-gray-700">WiFi Available</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="bathroom-edit"
                name="bathroom"
                checked={formData.bathroom}
                onChange={handleInputChange}
              />
              <Label htmlFor="bathroom-edit" className="text-sm font-medium text-gray-700">Bathroom Available</Label>
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Rate Per Day (₱)</Label>
              <Input
                type="number"
                name="ratePerDay"
                value={formData.ratePerDay}
                onChange={handleInputChange}
                placeholder="Enter rate per day"
                className="w-full"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-gray-700">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Under Maintenance">Under Maintenance</option>
              </Select>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsEditModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={editRoom}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              {/* Icon for Delete Confirmation */}
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Are you sure you want to delete this room? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setRoomToDelete(null);
              }}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={deleteRoom}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>

     {/* Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              {/* Icon for Success Confirmation */}
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
                Success
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Your action was successful.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={() => setIsConfirmModalOpen(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}