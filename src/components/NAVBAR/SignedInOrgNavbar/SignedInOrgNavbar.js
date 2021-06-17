import React, { useState } from "react";
import { NavDropdown, Nav } from "react-bootstrap";
import PostAJobButton from "../PostAJobButton";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

import styles from "./SignedInOrgNavbar.module.css";

const SignedInOrgNavbar = () => {
  const [error, setError] = useState("");
  const { currentUser, logout, userType } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/");
      alert("Signed out successfully");
    } catch {
      setError("Failed to log out");
      console.log(error);
    }
  }

  function isVerified() {
    if (currentUser.emailVerified) {
      return "Verified";
    } else {
      return "Please verify your email";
    }
  }

  return (
    <>
      <Nav>
        <NavDropdown title="Profile" id="collasible-nav-dropdown" alignRight>
          <NavDropdown.Header className={styles.email}>
            {currentUser.email}
            <br />({isVerified()})
            <br />
            <br />
            Account Type: {userType}
          </NavDropdown.Header>
          <NavDropdown.Divider />
          <NavDropdown.Item as={Link} to="/profile-organization">
            Your profile
          </NavDropdown.Item>
          <NavDropdown.Item onClick={handleLogout}>Sign out</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Nav>
        <Nav.Link as={Link} to="/your-jobs">
          Your Jobs
        </Nav.Link>
      </Nav>
      <PostAJobButton />
    </>
  );
};

export default SignedInOrgNavbar;
