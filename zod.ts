import { object, string } from "zod"
 
export const signInSchema = object({
  email: string({ required_error: "Email is required" }).min(1, "Email is required").email("Invalid email"),
  password: string({ required_error: "Password is required" }).min(1, "Password is required").min(2, "Password must be more than 2 characters").max(32, "Password must be less than 32 characters"),
})


export const FormSchema = object({
  name: string().min(2, { message: "Name must be at least 2 characters." }),
  city: string().min(1, { message: "City is required." }),
  postalCode: string().regex(/^[1-9][0-9]{5}$/, { message: "Invalid postal code." }),
  streetName: string().min(3, { message: "Street name is required." }),
  address: string().min(5, { message: "Address must be at least 5 characters." }),
});