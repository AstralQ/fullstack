import axios from "axios";

//const baseurl = "http://localhost:3002/api/persons"; // ✅ JSON Server URL
   
const baseurl = "/persons"; // ✅ JSON Server URL


const getAll = async () => {
  try {
    const response = await axios.get(baseurl);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const create = async (newObject) => {
  try {
    const response = await axios.post(baseurl, newObject);
    return response.data;
  } catch (error) {
    console.error("Error creating data:", error);
    throw error;
  }
};

const remove = async (id) => {
  try {
    await axios.delete(`${baseurl}/${id}`);
  } catch (error) {
    console.error(`Error deleting person with ID ${id}:`, error);
    throw error;
  }
};

export default { getAll, create, remove };

