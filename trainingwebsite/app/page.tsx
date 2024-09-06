"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@radix-ui/themes";
import "@radix-ui/themes/tokens/colors/teal.css";
import * as Form from "@radix-ui/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Auth() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        router.push("/home");
      })
      .catch((error) => {
        console.log("Error code:", error.code);
        console.log("Error message:", error.message);
      });
  };

  return (
    <div>
      <div className="flex justify-center my-10 text-5xl text-iconColor">
        My training website
      </div>
      <div className="flex justify-center">
        <Form.Root className="w-11/12 max-w-[450px]" onSubmit={handleSignIn}>
          <Form.Field className="grid mb-[10px]" name="email">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] text-black">
                Email
              </Form.Label>
              <Form.Message
                className="text-[13px] text-black opacity-[0.8]"
                match="valueMissing"
              >
                Please enter your email
              </Form.Message>
              <Form.Message
                className="text-[13px] text-black opacity-[0.8]"
                match="typeMismatch"
              >
                Please provide a valid email
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                className="box-border w-full bg-blackA2 shadow-blackA6 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA6"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Update email state
              />
            </Form.Control>
          </Form.Field>
          <Form.Field className="grid mb-[10px]" name="password">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] text-black">
                Password
              </Form.Label>
              <Form.Message
                className="text-[13px] text-black opacity-[0.8]"
                match="valueMissing"
              >
                Please enter a password
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                className="box-border w-full bg-blackA2 shadow-blackA6 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA6"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Update password state
              />
            </Form.Control>
          </Form.Field>
          <div className="mb-2.5 hover:text-textHover">
            <Link href={"/createAccount"}>
              Do not have an account? Create one here!
            </Link>
          </div>
          <Form.Submit asChild>
            <Button
              className="box-border w-full text-violet11 shadow-blackA4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
          </Form.Submit>
        </Form.Root>
      </div>
    </div>
  );
}
