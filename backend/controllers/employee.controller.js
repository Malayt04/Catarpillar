import { Employee } from "../models/employee.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";


const generateAccessAndRefereshTokens = async(employeeId) =>{
    try {
        const employee = await Employee.findById(employeeId)
        const accessToken = employee.generateAccessToken()
        const refreshToken = employee.generateRefreshToken()

        employee.refreshToken = refreshToken
        await employee.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        console.log(error)
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

export const signUp = async (req, res) => {
    try {
        const { name, EmployeeId, signature, password, email, phoneNumber } = req.body;


        if ([name, EmployeeId, signature, password, email, phoneNumber].some(field => field?.trim() === "")) {
            throw new ApiError(400, "All fields are required");
        }

        const existedEmployee = await Employee.findOne({
            $or: [{ email }, { EmployeeId }] 
        });

        if (existedEmployee) {
            throw new ApiError(400, "Employee already exists");
        }


        let avatar = null;

        if (req.files?.avatar) {
            const avatarLocalPath = req.files.avatar[0]?.path;
            if (avatarLocalPath) {
                avatar = await uploadOnCloudinary(avatarLocalPath);
            }
        }




        const employee = await Employee.create({
            name,
            avatar,
            email,
            password,
            phoneNumber,
            signature,
            EmployeeId
        });

    
        const createdEmployee = await Employee.findById(employee._id).select("-password -refreshToken");

        if (!createdEmployee) {
            throw new ApiError(500, "Something went wrong while registering the employee");
        }

        return res.status(200).json(
            new ApiResponse(200, createdEmployee, "User registered successfully")
        );
    } catch (error) {
        console.error(error);
        }
    }






    export const login = async (req, res) => {
        try {
            const { EmployeeId, password } = req.body;
    
            // Validate input
            if (!EmployeeId) {
                throw new ApiError(400, "Employee ID is required");
            }
            
            // Find the employee by EmployeeId
            const employee = await Employee.findOne({ EmployeeId });
            if (!employee) {
                throw new ApiError(404, "Employee does not exist");
            }
    
            // Check if the password is valid
            const isPasswordValid = await employee.isPasswordCorrect(password);
            if (!isPasswordValid) {
                throw new ApiError(401, "Invalid employee credentials");
            }
    
            // Generate access and refresh tokens
            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(employee._id);
    
            // Exclude sensitive information from the returned user object
            const loggedInEmployee = await Employee.findById(employee._id).select("-password -refreshToken");
    
            // Set cookie options
            const options = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Ensure secure cookies in production
                sameSite: 'Strict', // Prevent CSRF attacks
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            };
    
            // Send response with cookies and user data
            return res
                .status(200)
                .cookie("accessToken", accessToken, options)
                .cookie("refreshToken", refreshToken, options)
                .json(
                    new ApiResponse(
                        200,
                        {
                            user: loggedInEmployee,
                            accessToken,
                            refreshToken
                        },
                        "Employee logged in successfully"
                    )
                );
        } catch (error) {
            console.error(error);
            // Send appropriate error response
            if (error instanceof ApiError) {
                return res.status(error.statusCode).json({ message: error.message });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    };
