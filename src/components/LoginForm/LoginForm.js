import React, { useRef } from "react";
import { Form, Button } from "react-bootstrap";
import styles from "./LoginForm.module.css";
import { Link } from 'react-router-dom';

function loginOrg(event) {
  event.preventDefault();
  console.log("Email: " + event.target[1].value);
  console.log("Password: " + event.target[1].value);
}

const LoginForm = () => {
  const emailRef = useRef();
  const passwordRef = useRef();

  return (
    <div className={styles.formPage}>
      <Form onSubmit={loginOrg}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Organization email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" ref={emailRef} required/>
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" ref={passwordRef} required/>
        </Form.Group>
        {/* <Form.Group controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group> */}
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      <div className="w-100 text-centre mt-2">
        Need an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

export default LoginForm;
