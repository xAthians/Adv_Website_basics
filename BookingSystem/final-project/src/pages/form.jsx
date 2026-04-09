import { useState } from "react";
import { z } from "zod";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FormComponent from "../components/FormComponent";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    date: z.string().min(1, "Please select a date"),
});

export default function FormPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date: "",
    });

    const [errors, setErrors] = useState({});
    const [responseData, setResponseData] = useState(null);

    function handleChange(e) {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const result = formSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = {};
            result.error.issues.forEach((issue) => {
                fieldErrors[issue.path[0]] = issue.message;
            });
            setErrors(fieldErrors);
            setResponseData(null);
            return;
        }

        setErrors({});

        // Send to httpbin
        try {
            const res = await fetch("https://httpbin.org/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            setResponseData(data);
        } catch (err) {
            setResponseData({ error: "Failed to send data." });
        }
    }

    return (
        <>
            <Header />

            <div className="page-wrapper">

                <main className="page-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
                    <h1 className="page-title">Submit Your Information</h1>
                    <p className="page-subtitle">Fill out the form below and we’ll be in contact with you.</p>

                    <FormComponent
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                    />

                    {/* RESPONSE */}
                    {responseData && (
                        <div className="response-box">
                            <h2>Server Response</h2>
                            <pre>{JSON.stringify(responseData, null, 2)}</pre>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </>
    );
}