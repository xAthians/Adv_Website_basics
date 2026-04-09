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
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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
            setSuccessMessage("");
            return;
        }

        setErrors({});
        setSuccessMessage("");
        setLoading(true);

        try {
            const res = await fetch("https://httpbin.org/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result.data),
            });

            const data = await res.json();

            setResponseData(data);
            setSuccessMessage("Form submitted successfully! 🎉");
        } catch (err) {
            console.error(err);
            setSuccessMessage("Something went wrong while sending data ❌");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Header />

            <div className="page-wrapper">
                <main className="page-container" style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
                    <h1 className="page-title">Submit Your Information</h1>
                    <p className="page-subtitle">Fill out the form below and we’ll be in contact.</p>

                    <FormComponent
                        formData={formData}
                        errors={errors}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                    />

                    {/* LOADING */}
                    {loading && <p>Sending data... ⏳</p>}

                    {/* SUCCESS MESSAGE */}
                    {successMessage && (
                        <p style={{ marginTop: "10px", fontWeight: "bold" }}>{successMessage}</p>
                    )}

                    {/* CLEAN JSON RESPONSE */}
                    {responseData && (
                        <div className="response-box">
                            <h2>Server Response</h2>

                            <div
                                style={{
                                    background: "#e2e2e2",
                                    color: "#0c0c0c",
                                    padding: "15px",
                                    borderRadius: "10px",
                                    overflowX: "auto",
                                }}
                            >
                                <pre>{JSON.stringify(responseData.json, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            <Footer />
        </>
    );
}