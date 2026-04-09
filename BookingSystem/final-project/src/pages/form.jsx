import { useState } from "react";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        fieldErrors[fieldName] = issue.message;
      });

      setErrors(fieldErrors);
      setSuccessMessage("");
      return;
    }

    setErrors({});
    setSuccessMessage("Form submitted successfully!");

    console.log("Validated form data:", result.data);
  }

  return (
    <div>
      <h1>Register Page</h1>
      <p>Please fill in the form below.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <br />
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <br />
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <br />
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p>{errors.password}</p>}
        </div>

        <button type="submit">Submit</button>
      </form>

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default RegisterPage;