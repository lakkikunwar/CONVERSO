import React from "react";
function SignUpForm() {
  const [state, setState] = React.useState({
    name: "",
    email: "",
    password: ""
  });

  const [loading, setLoading] = React.useState(false); // Loading state for submit button

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState((prevState) => ({...prevState, [name]: value,}));
  };
      
  
  
  // Handle form submission
   const handleOnSubmit = async (evt) => {
    evt.preventDefault();

    const { name, email, password } = state;


    // Simple validation
    if (!name || !email || !password) {
      alert("All fields are required.");
      return;
    }

    setLoading(true); // Set loading state


    try {
        const response = await fetch("http://localhost:5000/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });
    
        const data = await response.json();


        if (response.ok) {
          alert("User registered successfully");
          setState({ name: "", email: "", password: "" });
        } else {
          alert(data.message||"Signup failed");
        }

      }
      
      catch (error) {
        console.error("Error signing up:", error);
        alert("An error occurred during sign-up.");
      }
    finally {  // Always reset loading state after a request is made
      setLoading(false);
    }
      setLoading(false); // Reset loading state
    }
  
  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleOnSubmit}>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fab fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-google-plus-g" />
          </a>
          <a href="#" className="social">
            <i className="fab fa-linkedin-in" />
          </a>
        </div>
        <span>or use your email for registration</span>
        <input
          type="text"
          name="name"
          value={state.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          type="email"
          name="email"
          value={state.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={state.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <button>Sign Up</button>
      </form>
    </div>
  )
}

export default SignUpForm;
