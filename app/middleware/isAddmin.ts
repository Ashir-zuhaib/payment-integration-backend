import checkRole from "./roleMiddleware";

const isAdmin = checkRole("admin"); // Replace with your actual admin role ID
export default isAdmin;
