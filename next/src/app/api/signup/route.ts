import dbConnect from '@/lib/connectDB';
import  Employee  from '@/model/Employee';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {

    const { name, EmployeeId, signature, password, email, phoneNumber } = await request.json();

    if (!name || !EmployeeId || !signature || !password || !email || !phoneNumber) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'All fields are required',
        }),
        { status: 400 }
      );
    }

    const existingEmployee = await Employee.findOne({ EmployeeId });

    if (existingEmployee) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Employee is already registered',
        }),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      signature,
      EmployeeId,
    });

    await newEmployee.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Employee registered successfully',
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Error registering user',
      }),
      { status: 500 }
    );
  }
}
