"use client";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from '@/app/firebase';
import { useRouter } from "next/navigation";
import { Allerta } from 'next/font/google';
import Link from 'next/link';

type Inputs = {
    email: string;
    password: string;
}

const Login = () => {
    const router = useRouter();

    const {
        register, 
        handleSubmit, 
        formState: { errors },
    } = useForm<Inputs>();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        await signInWithEmailAndPassword(auth, data.email, data.password).then(
            (userCredential) => {
                router.push("/");
            }
        ).catch((error) => {
            if(error.code === "auth/user-not-found"){
                alert("そのようなユーザは存在していません。");
            }else{
                alert(error.message);
            }
        });
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="mb-4 text-2xl text-gray-700 font-bold">ログイン</h1>
                <div className="mb-4">
                    <label className='block text-sm font-medium text-gray-600'>Email</label>
                    <input
                        {...register("email", {
                                required:"メールアドレスは必須です。",
                                pattern: {
                                    value: /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                                    message: "不適切なメールアドレスです。",
                                }
                            })
                        }
                        className='block border-2 rounded-md w-full p-2'
                        type="text"
                    />
                    {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
                </div>
                <div className="mb-4">
                    <label className='block text-sm font-medium text-gray-600'>password</label>
                    <input
                        {...register("password", {
                            required:"パスワードは必須です。",
                            minLength: {
                                value: 6,
                                message: "6文字以上入力してください。"
                            }
                            })
                        }
                        className='block border-2 rounded-md w-full p-2'
                        type="password"
                    />
                    {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}

                </div>

                <div className='flex justify-end mb-4'>
                    <button type="submit" className='bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700'>
                        login
                    </button>
                </div>

                <div className="mt-4">
                    <div className='flex text-xs'>
                        <span>アカウントをお持ちではないですか？</span>
                        <Link href={"/auth/register"} className='text-gray-600 text-sm font-bold ml-1 hover:text-blue-700'>新規登録ページへ</Link>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Login;