export default function FormComponent({
  formData,
  errors,
  handleChange,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit} className="form-card">

      {/* NAME */}
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="form-input"
        />
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      {/* EMAIL */}
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="form-input"
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
      </div>

      {/* DATE */}
      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className="form-input"
        />
        {errors.date && <p className="form-error">{errors.date}</p>}
      </div>

      <button type="submit" className="primary-button">
        Submit
      </button>
    </form>
  );
}