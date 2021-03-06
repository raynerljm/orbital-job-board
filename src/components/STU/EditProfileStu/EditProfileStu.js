//IMPORTS
//React Hooks
import { useEffect, useState } from "react";
//Bootstrap
import { Card, Button, Form, Alert, Spinner } from "react-bootstrap";
import { ArrowLeft } from "react-bootstrap-icons";
//Auth Context
import { useAuth } from "../../../contexts/AuthContext";
import { useStu } from "../../../contexts/StuContext";
import { useImage } from "../../../contexts/ImageContext";

//Components
import { Loading } from "../../EmptyStates/EmptyStates";
//Inline Form Validatio
import { Formik } from "formik";
import * as Yup from "yup";
//CSS Modules
import styles from "./EditProfileStu.module.css";

const EditProfileStu = ({
  setEdit,
  mobileActiveView,
  setMobileActiveView,
  width,
}) => {
  //CUSTOM HOOKS
  const { currentUser } = useAuth();
  const { updateStudentAccount, getStudent } = useStu();
  const { uploadImage } = useImage();

  //USESTATES
  //Before submitting, left button says cancel; After submitting, says back
  const [leftButton, setLeftButton] = useState("Cancel");
  const [leftButtonVar, setLeftButtonVar] = useState("light");
  //User details and loading
  const [userData, setUserData] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  //Success messages, Error messages and if successful
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [successful, setSuccessful] = useState(false);

  //Upload Iamge
  const [image, setImage] = useState();
  const [imageLoading, setImageLoading] = useState(false);

  async function getData() {
    const stu = await getStudent(currentUser.email);
    setUserData(stu);
    setUserLoading(false);
  }

  //USEEFFECTS
  useEffect(() => {
    getData();
  }, []);

  //FUNCTIONS
  //Submit edit profile
  const mySubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    handleSubmit(values);

    async function handleSubmit(values) {
      //resetting submit states
      setSuccessful(false);
      setMessage("");
      setError("");

      const newAccountInfo = {
        name: values.name,
        dob: values.dob,
        contactNo: values.contactNo,
        course: values.course,
        year: values.year,
        avatar: image || userData.avatar,
      };

      try {
        //Signify start of update process
        await updateStudentAccount(currentUser.email, newAccountInfo);
        setSuccessful(true);
        setMessage("User profile updated successfully!");
        setLeftButton("Back");
        setLeftButtonVar("primary");
        resetForm();
        setSubmitting(false);
      } catch (err) {
        setError("Failed to update user info");
        console.log(err);
      }
    }
  };
  //To upload image to cloudinary
  const uploadNewImage = async (event) => {
    setImageLoading(true);
    try {
      const newImageUrl = await uploadImage(event.target.files);
      setImage(newImageUrl);
    } catch (err) {
      console.log(err);
    }
    setImageLoading(false);
  };

  //LOADING
  if (userLoading) {
    return <Loading>Loading edit profile...</Loading>;
  }

  return (
    <>
      <Card bg="light" text="dark">
        <Card.Header as="h5" className="d-flex align-items-center">
          {mobileActiveView && width < 576 && (
            <ArrowLeft
              style={{ marginRight: "1rem" }}
              onClick={() => setMobileActiveView(false)}
            />
          )}
          Edit profile
        </Card.Header>
        <Card.Body>
          <Formik
            enableReinitialize={true}
            initialValues={{
              name: userData !== null ? userData.name : "",
              dob: userData !== null ? userData.dob : "",
              contactNo: userData !== null ? userData.contactNo : "",
              course: userData !== null ? userData.course : "",
              year: userData !== null ? userData.year : "",
            }}
            validationSchema={validationSchema}
            onSubmit={mySubmit}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formAvatar">
                  <Form.Label>Avatar</Form.Label>
                  <div className={styles.imageContainer}>
                    {userData && userData.avatar && !image && !imageLoading ? (
                      <img
                        src={userData.avatar}
                        className={styles.image}
                        alt="student avatar"
                      />
                    ) : imageLoading ? (
                      <Spinner
                        animation="border"
                        role="status"
                        variant="primary"
                      >
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    ) : image ? (
                      <img
                        src={image}
                        className={styles.image}
                        alt="student avatar"
                      />
                    ) : null}
                  </div>
                  <Form.Control
                    name="file"
                    type="file"
                    onChange={uploadNewImage}
                    accept="image/*"
                  />
                </Form.Group>
                <Form.Group controlId="formName">
                  <Form.Label>Name as in NRIC</Form.Label>{" "}
                  <Form.Control
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values.name}
                    isValid={touched.name && !errors.name}
                    isInvalid={touched.name && errors.name}
                    placeholder={values.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formDob">
                  <Form.Label>Date of birth</Form.Label>
                  <Form.Control
                    name="dob"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values.dob}
                    isValid={touched.dob && !errors.dob}
                    isInvalid={touched.dob && errors.dob}
                    type="date"
                    placeholder={values.dob}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dob}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    placeholder={userData !== null ? userData.id : ""}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formContactNo">
                  <Form.Label>Mobile number</Form.Label>
                  <Form.Control
                    name="contactNo"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values.contactNo}
                    isValid={touched.contactNo && !errors.contactNo}
                    isInvalid={touched.contactNo && errors.contactNo}
                    placeholder={values.contactNo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.contactNo}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formCourse">
                  <Form.Label>Course of study</Form.Label>
                  <Form.Control
                    name="course"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values.course}
                    isValid={touched.course && !errors.course}
                    isInvalid={touched.course && errors.course}
                    placeholder={values.course}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.course}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formYear">
                  <Form.Label>Year of study</Form.Label>
                  <Form.Control
                    name="year"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    values={values.year}
                    isValid={touched.year && !errors.year}
                    isInvalid={touched.year && errors.year}
                    as="select"
                    placeholder={values.year}
                  >
                    <option disabled selected value=""></option>
                    <option>Year 1</option>
                    <option>Year 2</option>
                    <option>Year 3</option>
                    <option>Year 4</option>
                    <option>Year 5</option>
                    <option>Alumni</option>
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    {errors.year}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className={styles.buttonContainer}>
                  <div>
                    <Button
                      variant={leftButtonVar}
                      onClick={(event) => setEdit(false)}
                    >
                      {leftButton}
                    </Button>
                  </div>
                  <div className={styles.rightButton}>
                    <Button
                      disabled={isSubmitting || successful}
                      variant="primary"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </div>
                </div>
                <Card.Text />
                {error ? (
                  <Alert variant="danger">{error}</Alert>
                ) : isSubmitting ? (
                  <Alert variant="primary">Updating your profile...</Alert>
                ) : successful ? (
                  <Alert variant="success">{message}</Alert>
                ) : userData !== null &&
                  userData.name &&
                  userData.dob &&
                  userData.contactNo &&
                  userData.course &&
                  userData.year ? (
                  <Alert variant="warning">
                    You can leave the fields you do not want to edit as blank
                  </Alert>
                ) : null}
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </>
  );
};

export default EditProfileStu;

//INLINE FORM VALIDATION
const validationSchema = Yup.object().shape({
  name: Yup.string("Please enter your full name as indicated on your NRIC")
    .required("Please enter your full name as indicated on your NRIC")
    .nullable(),
  dob: Yup.date("Please enter your date of birth")
    .required("Please enter your date of birth")
    .nullable(),
  contactNo: Yup.string("Please enter only + symbols, spaces, or numbers")
    .matches(/^[0-9+ ]+$/, "Please enter only + symbols, spaces, or numbers")
    .required("Please enter your mobile number")
    .nullable(),
  course: Yup.string("Please enter your course of study in NUS")
    .required("Please enter your course of study in NUS")
    .nullable(),
  year: Yup.string("Please indicate your year of study or if you are an alumni")
    .required("Please indicate your year of study or if you are an alumni")
    .nullable(),
});
