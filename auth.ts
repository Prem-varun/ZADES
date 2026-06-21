import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { PrismaClient,CustomerType } from "@/generated/prisma"
import { signInSchema } from "./zod"
import bcrypt from "bcryptjs"


const client = new PrismaClient();
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google,
    Credentials({
      credentials: {  
        email: {
              type: "email",
            },
            password: {
              type: "password",
            },
      },
      authorize: async (credentials) => {
        try{

          let user = null
          const { email, password } = await signInSchema.parseAsync(credentials);
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          user = await client.user.findUnique({
            where: { 
              email: email
            }
          });

          if (!user) {
            throw new Error("Invalid credentials.")
          }
          else{
            if (!user.password) {
              throw new Error("Invalid credentials.");
            }
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            console.log(hashedPassword,"hashhh");
            console.log(isPasswordCorrect,"pass");
            if(isPasswordCorrect){
              
              return {...user,id: user.id.toString(),};
            }
          }
  
          return null
        }
        catch(err){
          console.log("woww",err);
          return null;
        }
      },
    }),

  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account && account.provider === "google") {
        if (profile) {
            if (typeof profile.email === "string" && typeof profile.name === "string") {
              const existingUser = await client.user.findUnique({where: { email: profile.email },});
              if(!existingUser)
              {
                await client.user.create({
                  data:{
                    name:profile.name,
                    email: profile.email,
                    customer:{
                      create:{
                        type:CustomerType.REGISTERED,
                      }
                    },
                    cart:{
                      create:{

                      },
                    }

                  },
                  include:{
                    customer:true
                  }
                });
              }
            }
        }
        return true
      }
      return true;
    },
  },

})