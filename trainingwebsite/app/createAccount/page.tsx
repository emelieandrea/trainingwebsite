"use client";

import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import app, { db } from "../../firebase";
import { Button, Link } from "@radix-ui/themes";
import "@radix-ui/themes/tokens/colors/teal.css";
import * as Form from "@radix-ui/react-form";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

type Props = {};

export default function CreateAccount({}: Props) {
  const auth = getAuth(app);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        await addDoc(collection(db, "users"), {
          id: user.uid,
          name: name,
        });
        router.push("/home");
      })
      .catch((err) => {
        console.log("Error code:", err.code);
        console.log("Error message:", err.message);
      });
  };

  return (
    <div>
      <div className="flex items-center">
        <div className="mr-2 pl-10">
          <Link href={"/"}>
            <ArrowLeftIcon className="size-10 text-iconColor hover:text-textHover"></ArrowLeftIcon>
          </Link>
        </div>
        <div className="flex-grow flex justify-center my-10 text-5xl text-iconColor mr-20">
          Create an account
        </div>
      </div>
      <div className="flex justify-center">
        <Form.Root className="w-11/12 max-w-[450px]" onSubmit={handleSignUp}>
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
          <Form.Field className="grid mb-[10px]" name="name">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] text-black">
                Name
              </Form.Label>
              <Form.Message
                className="text-[13px] text-black opacity-[0.8]"
                match="valueMissing"
              >
                Please enter your name
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                className="box-border w-full bg-blackA2 shadow-blackA6 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA6"
                required
                onChange={(e) => setName(e.target.value)} // Update email state
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
          <Form.Field className="grid mb-[10px]" name="testpassword">
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] text-black">
                Confirm password
              </Form.Label>
              <Form.Message
                className="text-[13px] text-black opacity-[0.8]"
                match="valueMissing"
              >
                Please enter the password again
              </Form.Message>
              <Form.Message match={(value, formData) => value !== password}>
                The passwords are not matching.
              </Form.Message>
            </div>
            <Form.Control asChild>
              <input
                className="box-border w-full bg-blackA2 shadow-blackA6 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-black shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA6"
                type="password"
                required
              />
            </Form.Control>
          </Form.Field>
          <div className="flex justify-center mt-8">
            <Form.Submit asChild>
              <Button
                className="box-border w-full text-violet11 shadow-blackA4 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </Form.Submit>
          </div>
        </Form.Root>
      </div>
    </div>
  );
}
