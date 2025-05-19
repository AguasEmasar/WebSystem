import axios from "../src/api/axios";

export const roleService = {
  async getRole() {
    const response = await axios.get("/account/get-roles");
    return response.data.data;
  },

  async getAllUsers() {
    const response = await axios.get("/account/get-all-users");
    return response.data.data;
  },

  async assignRole(userId, roleName) {
    const response = await axios.post(`/account/assign-role/${userId}`, {
      roleName,
    });
    return response.data;
  },

  async removeRole(userId, roleName) {
    const response = await axios.delete(
      `/account/remove-role/${userId}/${roleName}`
    );
    return response.data;
  },
};
