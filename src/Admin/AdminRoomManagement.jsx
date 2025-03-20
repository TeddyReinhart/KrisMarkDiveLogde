import { useState, useEffect } from "react";
import { uploadImageToCloudinary } from "../Utils/uploadImageToCloudinary";
import { getFirestore, collection, addDoc, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore";
import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Input, Label, Checkbox, Select, Textarea } from "../Layout/Components";
import { PlusCircle, Trash2, CheckCircle, Edit, Image, Wifi, ShowerHead, Users, DollarSign, X, Star, Filter, RefreshCw } from "lucide-react";
import { app } from "../Firebase/Firebase";

const db = getFirestore(app);

export default function AdminRoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
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
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const roomsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRooms(roomsData);
        setFilteredRooms(roomsData);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Handle search and filter
  useEffect(() => {
    let result = [...rooms];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== "All") {
      result = result.filter(room => room.status === statusFilter);
    }
    
    setFilteredRooms(result);
  }, [searchQuery, statusFilter, rooms]);

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
    if (!formData.name) {
      alert("Please enter a room name.");
      return;
    }
    
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
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "rooms"), newRoom);

      setRooms([...rooms, { id: docRef.id, ...newRoom }]);
      resetForm();
      setIsAddModalOpen(false);
      setConfirmMessage("Room has been successfully added!");
      setIsConfirmModalOpen(true);
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room. Please try again.");
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
      setConfirmMessage("Room has been successfully deleted!");
      setIsConfirmModalOpen(true);
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
      ratePerDay: room.ratePerDay,
      description: room.description || "",
    });
    setPreview(room.image || "");
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteModal = (roomId) => {
    setRoomToDelete(roomId);
    setIsDeleteModalOpen(true);
  };

  // Edit an existing room
  const editRoom = async () => {
    if (!formData.name) {
      alert("Please enter a room name.");
      return;
    }

    try {
      setLoading(true);
      
      let updateData = {
        name: formData.name,
        guests: parseInt(formData.guests),
        wifi: formData.wifi,
        bathroom: formData.bathroom,
        status: formData.status,
        ratePerDay: parseFloat(formData.ratePerDay),
        description: formData.description || "",
        updatedAt: new Date().toISOString(),
      };
      
      // If a new image was selected, upload it
      if (selectedFile) {
        const imageUrl = await uploadImageToCloudinary(selectedFile);
        updateData.image = imageUrl;
      }

      const roomRef = doc(db, "rooms", formData.id);
      await updateDoc(roomRef, updateData);

      // Find the current room data to merge with updates
      const currentRoom = rooms.find(room => room.id === formData.id);
      const updatedRoom = {
        ...currentRoom,
        ...updateData,
        id: formData.id,
      };

      const updatedRooms = rooms.map((room) =>
        room.id === formData.id ? updatedRoom : room
      );
      
      setRooms(updatedRooms);
      setIsEditModalOpen(false);
      setConfirmMessage("Room has been successfully updated!");
      setIsConfirmModalOpen(true);
      resetForm();
    } catch (error) {
      console.error("Error updating room:", error);
      alert("Failed to update room. Please try again.");
    } finally {
      setLoading(false);
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

  // Clear filters
  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header and Action Buttons */}
<div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 bg-gradient-to-r from-orange-100 to-orange-50 p-6 rounded-xl shadow-md">
  <div className="md:max-w-2xl">
    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Room Management</h1>
    <p className="text-gray-600 mt-1 font-medium">Effortlessly manage your hotel rooms and availability</p>
  </div>
  <Button
    onClick={() => setIsAddModalOpen(true)}
    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg shadow-md transition-all duration-300 font-medium"
  >
    <PlusCircle size={18} className="text-orange-100" /> Add New Room
  </Button>
</div>

{/* Search and Filter */}
<div className="bg-white border border-orange-100 p-5 rounded-xl shadow-sm mb-8">
  <div className="flex flex-col lg:flex-row gap-4 items-stretch">
    {/* Search Bar */}
    <div className="relative flex-1 w-full">
  <Input
    type="text"
    placeholder="Search rooms by name, number or description..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="pl-10 w-full rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 h-10 bg-gray-50 transition-all duration-200"
  />
  {searchQuery && (
    <button
      onClick={() => setSearchQuery("")}
      className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
      aria-label="Clear search"
    >
      <X size={16} />
    </button>
  )}
</div>
    
    {/* Filter Section */}
    <div className="flex items-center gap-3 lg:min-w-[220px]">
      <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 w-full">
        <Filter size={16} className="text-orange-400 flex-shrink-0" />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full border-0 focus:ring-0 bg-transparent text-gray-700 font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Under Maintenance">Under Maintenance</option>
        </Select>
      </div>
    </div>

    {/* Clear Filters Button */}
    {(searchQuery || statusFilter !== "All") && (
      <Button
        variant="outline"
        onClick={clearFilters}
        className="flex items-center gap-1 whitespace-nowrap bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-lg px-4 transition-all duration-200"
      >
        <RefreshCw size={14} className="text-gray-500" />
        Clear Filters
      </Button>
    )}
  </div>
</div>

      {/* Content Section */}
      {loading && rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card 
              key={room.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
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
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{room.name}</h2>
                    <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full">
                      <Star size={14} className="text-orange-500 fill-orange-500" />
                      <span className="text-xs font-medium text-orange-600">Featured</span>
                    </div>
                  </div>
                  
                  {room.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{room.description}</p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} className="text-orange-500" />
                      <span>Max {room.guests} {room.guests === 1 ? 'Guest' : 'Guests'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign size={16} className="text-orange-500" />
                      <span className="font-medium">₱{room.ratePerDay?.toLocaleString() || "0"}/day</span>
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
      ) : (
        <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-md p-12">
          <Image size={64} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">No rooms found</h3>
          <p className="text-gray-500 text-center mb-4">
            {searchQuery || statusFilter !== "All" 
              ? "No rooms match your current filters. Try adjusting your search criteria."
              : "You haven't added any rooms yet. Click 'Add New Room' to get started."}
          </p>
          {(searchQuery || statusFilter !== "All") && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              Clear Filters
            </Button>
          )}
        </div>
      )}

      {/* Add Room Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={(open) => {
        setIsAddModalOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Add New Room</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new room to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto py-2"> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Room Name *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter room name"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Rate Per Day (₱) *</Label>
                <Input
                  type="number"
                  name="ratePerDay"
                  value={formData.ratePerDay}
                  onChange={handleInputChange}
                  placeholder="Enter rate per day"
                  className="w-full"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the room"
                className="w-full resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Max Guests</Label>
                <Input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  placeholder="Enter max guests"
                  className="w-full"
                  min={1}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Status</Label>
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
            </div>
            
            <div className="flex flex-wrap gap-6">
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
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Room Image *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="room-image"
                />
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview("");
                      }}
                      className="text-gray-600"
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <Label 
                    htmlFor="room-image" 
                    className="flex flex-col items-center justify-center h-40 cursor-pointer"
                  >
                    <Image size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload room image</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</span>
                  </Label>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsAddModalOpen(false);
              }}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={addRoom}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2"></div>
                  Uploading...
                </>
              ) : (
                "Add Room"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={(open) => {
        setIsEditModalOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">Edit Room</DialogTitle>
            <DialogDescription>
              Update the details of your room.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto py-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Room Name *</Label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter room name"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Rate Per Day (₱) *</Label>
                <Input
                  type="number"
                  name="ratePerDay"
                  value={formData.ratePerDay}
                  onChange={handleInputChange}
                  placeholder="Enter rate per day"
                  className="w-full"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm font-medium text-gray-700">Description</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of the room"
                className="w-full resize-none"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Max Guests</Label>
                <Input
                  type="number"
                  name="guests"
                  value={formData.guests}
                  onChange={handleInputChange}
                  placeholder="Enter max guests"
                  className="w-full"
                  min={1}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-sm font-medium text-gray-700">Status</Label>
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
            </div>
            
            <div className="flex flex-wrap gap-6">
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
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Room Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="room-image-edit"
                />
                {preview ? (
                  <div className="space-y-4">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg mx-auto"
                    />
                    <Label
                      htmlFor="room-image-edit"
                      className="text-sm text-orange-600 cursor-pointer"
                    >
                      Change Image
                    </Label>
                  </div>
                ) : (
                  <Label 
                    htmlFor="room-image-edit" 
                    className="flex flex-col items-center justify-center h-40 cursor-pointer"
                  >
                    <Image size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500">Click to upload room image</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 5MB</span>
                  </Label>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setIsEditModalOpen(false);
              }}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={editRoom}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-50 border-t-transparent rounded-full mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <DialogTitle className="text-xl font-semibold text-gray-800 text-center">
                Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Are you sure you want to delete this room? This action cannot be undone and may affect existing bookings.
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
        <DialogContent className="fixed inset-0 bg-gray-900/70 flex items-center justify-center p-4 z-50 animate-fadeIn sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4">
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