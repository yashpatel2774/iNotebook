import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // ✅ import SweetAlert

const Signup = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: ""
  });

  const navigate = useNavigate();

  const handlSubmit = async (e) => {
    e.preventDefault();

    if (credentials.password !== credentials.cpassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Password and Confirm Password do not match!'
      });
      return;
    }

    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password
      })
    });

    const json = await response.json();
    console.log(json); // for debugging

    if (json.success) {
      localStorage.setItem('token', json.authToken);

      Swal.fire({
        icon: 'success',
        title: 'Signup Successful',
        text: 'You have successfully signed up!'
      }).then(() => {
        navigate("/login"); // Redirect after user closes alert
      });

    } else {
      // ✅ Error alert
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: json.error || 'Please try again'
      });
    }
  }

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  }

  return (
      <div className='mt-2'>
      <h2 className='my-3'>Create an account to use iNotebook</h2>
      <form onSubmit={handlSubmit} autoComplete='off'>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name='name' value={credentials.name} autoComplete='off' required onChange={onChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name='email' value={credentials.email} onChange={onChange} autoComplete='off' required aria-describedby="emailHelp" />
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name='password' value={credentials.password} minLength={3} autoComplete='new-password' required onChange={onChange} />
        </div>

        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name='cpassword' value={credentials.cpassword} minLength={3} autoComplete='new-password' required onChange={onChange} />
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}

export default Signup;
