"use client";
import Input from "@/components/Input";
import { signIn } from "@/lib/api/firebase";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import logo from "../../../public/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (result.success) {
      window.location.replace("/");
    }
    if (!result.success) {
      alert(
        "등록되지 않은 아이디이거나 아이디 또는 비밀번호를 잘못 입력했습니다.",
      );
    }
  };
  return (
    <section className="h-lvh sm:bg-gray-50 flex items-center">
      <div className="w-96 mx-auto sm:border border-primary-200 rounded-2xl px-8 pb-12 bg-white">
        <Image
          src={logo}
          alt="logo"
          width={200}
          priority
          className="mx-auto my-12"
        />
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            onChange={setEmail}
            placeholder="이메일 주소를 입력해주세요"
          />
          <Input
            type="password"
            onChange={setPassword}
            placeholder="비밀번호를 입력해주세요"
          />
          <button
            type="submit"
            className="p-3 bg-primary-300 rounded cursor-pointer"
          >
            로그인
          </button>
        </form>
        <Link href={"/sign-up"}>
          <button
            type="submit"
            className="w-full p-3 bg-primary-100 rounded mt-2 cursor-pointer"
          >
            회원가입
          </button>
        </Link>
      </div>
    </section>
  );
}
