"use client";

import { CountrySelectField } from "@/components/CountrySelectField";
import FooterLinks from "@/components/FooterLinks";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { useForm } from "react-hook-form";

const SignIn = () => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<SignInFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur"
    });

    const onSubmit = async (data: any) => {
        console.log(data);
    }

    return (
        <>
            <h1 className="form-title">Log In Your Account</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
                {/* ---- Inputs ---- */}
                <InputField
                    name="email"
                    label="Email"
                    placeholder="email@example.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Email is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address" } }}
                />
                <InputField
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="· · · · · · · · · ·"
                    register={register}
                    error={errors.password}
                    validation={{ required: "Password is required", pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address" } }}
                    className="placeholder:text-lg"
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? "Logging In..." : "Log In"}
                </Button>

                <FooterLinks text="Don't have an account?" linkText="Sign Up" href="/sign-up" />
            </form>
        </>
    )
}

export default SignIn