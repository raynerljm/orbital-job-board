import { Modal, Button, Form } from "react-bootstrap";
import { useRef } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./JobDetailsModal.module.css";
var uniqid = require("uniqid");

const JobDetailsModal = ({
  show,
  onHide,
  id,
  orgType,
  orgName,
  orgEmail,
  status,
  title,
  beneficiaries,
  skills,
  purpose,
  platform,
  multiLocation,
  location,
  postalCode,
  type,
  flexiDate,
  longStartDate,
  longEndDate,
  flexiHours,
  longHours,
  adShift,
  addInfo,
  imageUrl,
  pocName,
  pocNo,
  pocEmail,
  applicants,
}) => {
  const { currentUser } = useAuth();

  var hour = new Date().getHours(); //for greeting

  const stuNameRef = useRef();
  const stuDobRef = useRef();
  const stuEmailRef = useRef();
  const stuNoRef = useRef();
  const stuCourseRef = useRef();
  const stuYearRef = useRef();
  const stuAddInfoRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();

    const appID = uniqid();

    const newApp = {
      id: appID,
      stuID: "get student ID from currentUser",
      jobID: id,
      status: "Pending",
      stuName: stuNameRef.current.value,
      stuDob: stuDobRef.current.value,
      stuEmail: stuEmailRef.current.value,
      stuNo: stuNoRef.current.value,
      stuCourse: stuCourseRef.current.value,
      stuYearRef: stuYearRef.current.value,
      stuAddInfo: stuAddInfoRef.current.value,
      dateApplied: new Date(),
    };

    console.log(newApp);
  };

  if (currentUser !== null) {
    // NEED TO CHANGE TO VOLUNTEER ACCOUNT ONLY
    return (
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {"Good " +
                ((hour < 12 && "morning") ||
                  (hour < 18 && "afternoon") ||
                  "evening") +
                ", " +
                currentUser.email}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>You are applying for</h4>
            <h3>{`${title} by ${orgName}`}</h3>
            <hr className={styles.divider} />
            <h4>Personal details</h4>
            <h6 className="text-muted">
              Please help us to fill in your personal details to volunteer!
            </h6>
            <Form.Group>
              <Form.Label>Full name as in NRIC</Form.Label>
              <Form.Control
                required
                placeholder="Loh Jia Ming, Rayner"
                ref={stuNameRef}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date of birth</Form.Label>
              <Form.Control required type="date" ref={stuDobRef} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                ref={stuEmailRef}
                placeholder="raynerljm@gmail.com"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile number</Form.Label>
              <Form.Control required placeholder="98365567" ref={stuNoRef} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Course of study</Form.Label>
              <Form.Control
                require
                ref={stuCourseRef}
                placeholder="Computer Science"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Year of study</Form.Label>
              <Form.Control
                // required
                as="select"
                ref={stuYearRef}
              >
                <option>Year 1</option>
                <option>Year 2</option>
                <option>Year 3</option>
                <option>Year 4</option>
                <option>Year 5</option>
                <option>Alumni</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Additional information</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                ref={stuAddInfoRef}
                placeholder="I am good at teaching"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button type="submit" style={{ margin: "0 auto 0 " }}>
              Apply now
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  } else {
    return <SignedOutModal show={show} onHide={onHide} />;
  }
};

export default JobDetailsModal;

const SignedOutModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>Sign in lol</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Sign in lol</h4>
        <p>sign in pls first lmao</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};