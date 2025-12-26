"use client";

import { CountrySelectField } from "@/components/CountrySelectField";
import FooterLinks from "@/components/FooterLinks";
import InputField from "@/components/InputField";
import SelectField from "@/components/SelectField";
import { Button } from "@/components/ui/button";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { useForm } from "react-hook-form";

const SignUp = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            country: "",
            investmentGoals: "",
            riskTolerance: "",
            preferredIndustry: "",
        },
        mode: "onBlur"
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            console.log(data);
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <>
            <h1 className="form-title">Sign Up & Personalize</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 ">
                {/* ---- Inputs ---- */}
                <InputField
                    name="fullName"
                    label="Full Name"
                    placeholder="John Doe"
                    register={register}
                    error={errors.fullName}
                    validation={{required: "Full name is required", minLength: {value: 4, message: "Full name must be at least 4 characters long"}}}
                />
                <InputField
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="email@example.com"
                    register={register}
                    error={errors.email}
                    validation={{required: "Email is required", pattern: {value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email address"}}}
                />
                <InputField
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="· · · · · · · · · ·"
                    register={register}
                    error={errors.password}
                    validation={{required: "Password is required", minLength: {value: 8, message: "Password must be at least 8 characters long"}}}
                    className="placeholder:text-lg"
                />

                <CountrySelectField
                    name="country"
                    label="Country"
                    control={control}
                    error={errors.country}
                    required
                />

                <SelectField
                    name="riskTolerance"
                    label="Risk Tolerance"
                    placeholder="Select your risk level"
                    options={RISK_TOLERANCE_OPTIONS}
                    control={control}
                    error={errors.riskTolerance}
                    required
                />

                <SelectField
                    name="preferredIndustry"
                    label="Preferred Industry"
                    placeholder="Select your preferred industry"
                    options={PREFERRED_INDUSTRIES}
                    control={control}
                    error={errors.preferredIndustry}
                    required
                />

                <SelectField
                    name="investmentGoals"
                    label="Investment Goals"
                    placeholder="Select your investment goal"
                    options={INVESTMENT_GOALS}
                    control={control}
                    error={errors.investmentGoals}
                    required
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? "Creating Account..." : "Start Your Investing Journey"}
                </Button>

                <FooterLinks text="Already have an account?" linkText="Sign In" href="/sign-in" />
            </form>
        </>
    )
}

export default SignUp