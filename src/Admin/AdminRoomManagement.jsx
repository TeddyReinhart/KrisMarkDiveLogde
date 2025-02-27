import { useState } from "react";
import { uploadImageToCloudinary } from "../Utils/cloudinaryUpload";
import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label, Checkbox, Select } from "../Layout/Components";
import { PlusCircle, Trash2, Edit, Image } from "lucide-react";

const initialRooms = [
  { id: 1, name: "Triple Room", image: "", guests: 3, wifi: true, bathroom: true, status: "Available" },
  { id: 2, name: "Standard Double Room", image: "", guests: 2, wifi: true, bathroom: true, status: "Occupied" },
  { id: 3, name: "Twin Room", image: "", guests: 2, wifi: true, bathroom: true, status: "Limited Available" },
  { id: 4, name: "Family Room", image: "", guests: 4, wifi: true, bathroom: true, status: "Available" },
];

export default function AdminRoomManagement() {
  const [rooms, setRooms] = useState(initialRooms);
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
  });

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const addRoom = async () => {
    if (!selectedFile) {
      alert("Please select an image before adding a room.");
      return;
    }

    setLoading(true);

    try {
      const imageUrl = await uploadImageToCloudinary(selectedFile);
      const newRoom = {
        id: rooms.length + 1,
        name: formData.name,
        image: imageUrl,
        guests: parseInt(formData.guests),
        wifi: formData.wifi,
        bathroom: formData.bathroom,
        status: formData.status,
      };

      setRooms([...rooms, newRoom]);
      setSelectedFile(null);
      setPreview("");
      setIsAddModalOpen(false); // Close modal after adding
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteRoom = (id) => {
    setRooms(rooms.filter((room) => room.id !== id));
  };

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

  const editRoom = async () => {
    const updatedRooms = rooms.map((room) =>
      room.id === formData.id ? { ...room, ...formData } : room
    );
    setRooms(updatedRooms);
    setIsEditModalOpen(false); // Close modal after editing
  };

  return (
    <div className={`p-6 ${(isAddModalOpen || isEditModalOpen) ? 'blur-sm' : ''}`}>
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