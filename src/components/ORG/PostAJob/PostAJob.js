//IMPORTS
//React Hooks
import { useState, useEffect } from "react";
//Bootstrap
import {
  Row,
  Col,
  Accordion,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
//Components
import Shifts from "./Shifts";
import { TermsAndConditions } from "../../../Constants";
//Contexts
import { useAuth } from "../../../contexts/AuthContext";
import { useDist } from "../../../contexts/DistContext";
import { useOrg } from "../../../contexts/OrgContext";
import { useNotif } from "../../../contexts/NotifContext";
//Inline Form Validation
import { Formik } from "formik";
import * as Yup from "yup";
//Constants
import { SelectBeneficiaryTags, SelectSkillTags } from "../../../Constants";
//React Select
import Select from "react-select";
//Image
import noImage from "../../../assets/emptyStates/noImage.png";
//CSS Modules
import styles from "./PostAJob.module.css";
//Unique ID
var uniqid = require("uniqid");

const PostAJob = () => {
  //USESTATES
  // Database useStates
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  //Form useStates
  const [loadingOrgDetails, setLoadingOrgDetails] = useState(true);
  const [canRetrieveOrgDetails, setCanRetrieveOrgDetails] = useState(false);
  const [canRetrievePocDetails, setCanRetrievePocDetails] = useState(false);
  //Obtain currentUser data from database
  const [userData, setUserData] = useState(null);
  //Image uploading
  const [image, setImage] = useState();
  const [imageUrl, setImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  //CUSTOM HOOKS
  //Finding currentUser that is logged in
  const { currentUser } = useAuth();
  const { getGeocode } = useDist();
  const { PostAJob, getOrgInfo } = useOrg();
  const { sendNotif } = useNotif();

  async function getPageData() {
    const orgData = await getOrgInfo(currentUser.email);
    setUserData(orgData);
    const { type, name, uen, pocName, pocNo, pocEmail } = orgData;
    if (
      (type === "NUS Organization" ||
        (type === "Non-NUS Organization" && uen)) &&
      name
    ) {
      setCanRetrieveOrgDetails(true);
    }
    if (pocName && pocNo && pocEmail) {
      setCanRetrievePocDetails(true);
    }
    setLoadingOrgDetails(false);
  }
  //USEEFFECTS
  //Retrieve user from database
  useEffect(() => {
    getPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //FUNCTIONS
  //Upload image to cloudinary
  const uploadImage = async (event) => {
    setImageLoading(true);
    try {
      const files = event.target.files;
      const data = new FormData();
      data.append("file", files[0]);
      data.append("upload_preset", "volunteer-ccsgp-images");
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/volunteer-ccsgp-job-board/image/upload",
        {
          method: "POST",
          body: data,
        }
      );
      const file = await res.json();
      setImage(file.secure_url);
      setImageUrl(file.secure_url);
    } catch (err) {
      console.log(err);
    }
    setImageLoading(false);
  };
  //Submit post a job
  const mySubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    handleSubmit(values);

    async function handleSubmit(values) {
      //Resetting useStates
      setMessage("");
      setError("");
      var lat;
      var lng;
      if (values.postalCode) {
        const result = await getGeocode(`${values.postalCode}`);
        lat = result[0];
        lng = result[1];
      }

      const jobID = uniqid();
      //Creating new job
      const newJob = {
        id: jobID,
        orgID: currentUser.email,
        status: "Pending",
        title: values.title,
        beneficiaries: values.beneficiaries,
        skills: values.skills,
        purpose: values.purpose,
        platform: values.platform,
        multiLocation: values.multiLocation,
        location: values.location,
        postalCode: values.postalCode,
        type: values.type,
        flexiDate: values.flexiDate,
        longStartDate: values.longStartDate,
        longEndDate: values.longEndDate,
        flexiHours: values.flexiHours,
        longHours: values.longHours,
        flexiShifts: values.flexiShifts,
        adShift: adShiftProcessor(
          values.shiftNumber,
          values.shift1Date,
          values.shift1Start,
          values.shift1End,
          values.shift2Date,
          values.shift2Start,
          values.shift2End,
          values.shift3Date,
          values.shift3Start,
          values.shift3End,
          values.shift4Date,
          values.shift4Start,
          values.shift4End,
          values.shift5Date,
          values.shift5Start,
          values.shift5End,
          values.shift6Date,
          values.shift6Start,
          values.shift6End,
          values.shift7Date,
          values.shift7Start,
          values.shift7End,
          values.shift8Date,
          values.shift8Start,
          values.shift8End,
          values.shift9Date,
          values.shift9Start,
          values.shift9End,
          values.shift10Date,
          values.shift10Start,
          values.shift10End
        ),
        addInfo: values.addInfo,
        imageUrl: image ? imageUrl : noImage,
        closingDate: values.closingDate,
        noClosingDate: values.noClosingDate,
        pocName: values.retrievePoc ? userData.pocName : values.pocName,
        pocNo: values.retrievePoc ? userData.pocNo : values.pocNo,
        pocEmail: values.retrievePoc ? userData.pocEmail : values.pocEmail,
        lat: lat,
        lng: lng,
      };

      const newNotif = {
        newNotif: {
          id: uniqid(),
          receiverID: "admin",
          header: "New job has been posted",
          message: `A new job has been posted by ${newJob.orgID}, visit the All Jobs page for more details.`,
          dateTime: new Date().toUTCString(),
          dismissed: false,
        },
      };

      try {
        await PostAJob(newJob, currentUser);
        await sendNotif(newNotif);

        setMessage("Job posting successful");
        resetForm();
        setSubmitting(false);
      } catch (err) {
        setError("Failed to post due to internal error");
      }
    }
  };

  return (
    <div className={styles.formContainer}>
      <Formik
        enableReinitialize
        initialValues={{
          title: "",
          beneficiaries: "untouched",
          skills: "untouched",
          purpose: "",
          platform: "",
          multiLocation: false,
          location: "",
          postalCode: "",
          type: "",
          flexiDate: false,
          longStartDate: "",
          longEndDate: "",
          flexiHours: false,
          longHours: "",
          flexiShifts: false,
          shiftNumber: 0,
          shift1Date: "",
          shift1Start: "",
          shift1End: "",
          shift2Date: "",
          shift2Start: "",
          shift2End: "",
          shift3Date: "",
          shift3Start: "",
          shift3End: "",
          shift4Date: "",
          shift4Start: "",
          shift4End: "",
          shift5Date: "",
          shift5Start: "",
          shift5End: "",
          shift6Date: "",
          shift6Start: "",
          shift6End: "",
          shift7Date: "",
          shift7Start: "",
          shift7End: "",
          shift8Date: "",
          shift8Start: "",
          shift8End: "",
          shift9Date: "",
          shift9Start: "",
          shift9End: "",
          shift10Date: "",
          shift10Start: "",
          shift10End: "",
          addInfo: "",
          closingDate: "",
          noClosingDate: false,
          pocName: "",
          pocNo: "",
          pocEmail: "",
          retrievePoc: false,
          terms: false,
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
            <>
              <Card>
                <Accordion defaultActiveKey="0">
                  {/* Accordion 1: Organization Details (These details are not collected in this form) */}
                  <Accordion.Toggle as={Card.Header} eventKey="0">
                    <h5>Organization Details</h5>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="0">
                    <div className={styles.accordionBox}>
                      {!loadingOrgDetails && !canRetrieveOrgDetails ? (
                        <Alert variant="danger">
                          <Alert.Heading as="h6">
                            Missing organization details
                          </Alert.Heading>
                          <hr />
                          <p>
                            Please{" "}
                            <Link to="/profile-organization">
                              fill in your organization details
                            </Link>{" "}
                            on your profile before proceeding to post a job.
                            Thank you!
                          </p>
                        </Alert>
                      ) : (
                        <Alert variant="primary">
                          Do ensure that your organization details are correct.
                          If there are errors, please amend them on{" "}
                          <Link to="/profile-organization">Your Profile</Link>.
                        </Alert>
                      )}
                      <Form.Group controlId="formOrgType">
                        <Form.Label>Organization type</Form.Label>
                        <Form.Control
                          required
                          placeholder={userData !== null ? userData.type : ""}
                          disabled
                        />
                      </Form.Group>
                      <Form.Group controlId="formOrgName">
                        <Form.Label>Organization name</Form.Label>
                        <Form.Control
                          required
                          placeholder={userData !== null ? userData.name : ""}
                          disabled
                        />
                      </Form.Group>
                      {userData && userData.type === "Non-NUS Organization" && (
                        <Form.Group controlId="formOrgUen">
                          <Form.Label>
                            Organization UEN, Charity registration number or
                            Society registration number
                            <Form.Text className="text-muted">
                              Only applicable for Non-NUS Organizations. If you
                              are a Non-NUS Organization without a UEN, please
                              indicate NA.
                            </Form.Text>
                          </Form.Label>
                          <Form.Control
                            required
                            placeholder={userData !== null ? userData.uen : ""}
                            disabled
                          />
                        </Form.Group>
                      )}
                      <Form.Group controlId="formOrgEmail">
                        <Form.Label>Email address of Organization</Form.Label>
                        <Form.Control
                          required
                          placeholder={userData !== null ? userData.id : ""}
                          disabled
                        />
                      </Form.Group>
                    </div>
                  </Accordion.Collapse>
                </Accordion>
                {/* Accordion 2: Job Details */}
                <Accordion defaultActiveKey="1">
                  <Accordion.Toggle as={Card.Header} eventKey="1">
                    <h5>Job Details</h5>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="1">
                    <div className={styles.accordionBox}>
                      {/* About the job */}
                      <h4 className={styles.jobHeaderFirst}>About</h4>
                      <Form.Group controlId="formTitle">
                        <Form.Label>Title of volunteer work</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={values.title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.title && !errors.title}
                          isInvalid={touched.title && errors.title}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.title}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="formBeneficiary">
                        <Form.Label>Target profile of beneficiary</Form.Label>
                        <Select
                          isMulti
                          name="beneficiaries"
                          options={SelectBeneficiaryTags}
                          onBlur={handleBlur}
                          onChange={(inputValue) => {
                            values.beneficiaries = inputValue.map(
                              (e) => e.value
                            );
                          }}
                        />
                        {values.beneficiaries !== "untouched" ? (
                          values.beneficiaries.length === 0 ? (
                            <Form.Text className="text-danger">
                              Please select at least one beneficiary
                            </Form.Text>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        <Form.Text className="text-muted">
                          For 'Other', you can elaborate in the Additional
                          information section
                        </Form.Text>
                      </Form.Group>
                      <Form.Group controlId="formSkills">
                        <Form.Label>Skills required</Form.Label>
                        <Select
                          isMulti
                          name="skills"
                          options={SelectSkillTags}
                          onBlur={handleBlur}
                          onChange={(inputValue) => {
                            values.skills = inputValue.map((e) => e.value);
                          }}
                        />
                        {values.skills !== "untouched" ? (
                          values.skills.length === 0 ? (
                            <Form.Text className="text-danger">
                              Please select at least one skill
                            </Form.Text>
                          ) : (
                            ""
                          )
                        ) : (
                          ""
                        )}
                        <Form.Text className="text-muted">
                          For 'Others', you can elaborate in the Additional
                          information section
                        </Form.Text>
                      </Form.Group>
                      <Form.Group controlId="formPurpose">
                        <Form.Label>
                          Purpose of volunteer work
                          <Form.Text className="text-muted">
                            Do explain what volunteers would be doing and why
                            they are doing it. It would also be useful to
                            elaborate how volunteers can benefit from the
                            experience.
                          </Form.Text>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          as="textarea"
                          rows={2}
                          name="purpose"
                          value={values.purpose}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.purpose && !errors.purpose}
                          isInvalid={touched.purpose && errors.purpose}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.purpose}
                        </Form.Control.Feedback>
                      </Form.Group>
                      {/* Platform and Location */}
                      <h4 className={styles.jobHeader}>Location</h4>
                      <Form.Group controlId="formPlatform">
                        <Form.Label>Platform of volunteer work</Form.Label>
                        <Form.Control
                          name="platform"
                          as="select"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.platform && !errors.platform}
                          isInvalid={touched.platform && errors.platform}
                        >
                          <option value="" disabled selected />
                          <option>Physical</option>
                          <option>Virtual</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.platform}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <div
                        className={
                          values.platform !== "Physical"
                            ? styles.typeDisplayNone
                            : styles.typeDisplay
                        }
                      >
                        <Row>
                          <Col md={8}>
                            <Form.Group controlId="formLocation">
                              <Form.Label>
                                Location of volunteer work
                              </Form.Label>

                              <Form.Control
                                type="text"
                                readOnly={
                                  values.multiLocation ||
                                  values.platform === "Virtual"
                                }
                                name="location"
                                value={
                                  values.multiLocation
                                    ? "Multiple locations"
                                    : values.location
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isValid={touched.location && !errors.location}
                                isInvalid={touched.location && errors.location}
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.location}
                              </Form.Control.Feedback>
                              <Form.Text>
                                <Form.Group controlId="formMultiLocation">
                                  <Form.Check
                                    name="multiLocation"
                                    label={
                                      values.multiLocation
                                        ? `Multiple locations - Please indicate the details of the locations under additional information`
                                        : `Multiple locations`
                                    }
                                    disabled={values.platform === "Virtual"}
                                    checked={
                                      values.platform === "Virtual"
                                        ? false
                                        : values.multiLocation
                                    }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    feedback={errors.multiLocation}
                                  />
                                </Form.Group>
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col md={4}>
                            <Form.Group controlId="formPostalCode">
                              <Form.Label>Postal code of location</Form.Label>

                              <Form.Control
                                type="text"
                                name="postalCode"
                                value={
                                  values.multiLocation
                                    ? "NA"
                                    : values.postalCode
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                readOnly={
                                  values.multiLocation ||
                                  values.platform === "Virtual"
                                }
                                isValid={
                                  touched.postalCode && !errors.postalCode
                                }
                                isInvalid={
                                  touched.postalCode && errors.postalCode
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.postalCode}
                              </Form.Control.Feedback>
                              <Form.Text className="text-muted">
                                The postal code will be used to display the
                                distance of the job from volunteers
                              </Form.Text>
                            </Form.Group>
                          </Col>
                        </Row>
                      </div>
                      {/* Date and Time */}
                      <h4 className={styles.jobHeader}>Commitment period</h4>
                      <Form.Group controlId="formType">
                        <Form.Label>
                          Type of volunteer commitment level
                        </Form.Label>
                        <Form.Control
                          name="type"
                          as="select"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          values={values.type}
                          isValid={touched.type && !errors.type}
                          isInvalid={touched.type && errors.type}
                        >
                          <option value="" disabled selected />
                          <option>Long term</option>
                          <option>Ad hoc</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                          {errors.type}
                        </Form.Control.Feedback>
                      </Form.Group>
                      {/* Long term */}
                      <div
                        className={
                          values.type !== "Long term"
                            ? styles.typeDisplayNone
                            : styles.typeDisplay
                        }
                      >
                        <Row>
                          <Col>
                            <Form.Group controlId="formLongStartDate">
                              <Form.Label>
                                Long term - Start date of volunteer work
                              </Form.Label>
                              <Form.Control
                                name="longStartDate"
                                readOnly={
                                  values.type !== "Long term" ||
                                  values.flexiDate
                                }
                                type="date"
                                value={values.longStartDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isValid={
                                  touched.longStartDate && !errors.longStartDate
                                }
                                isInvalid={
                                  touched.longStartDate && errors.longStartDate
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.longStartDate}
                              </Form.Control.Feedback>
                              <Form.Text>
                                <Form>
                                  <Form.Group>
                                    <Form.Check
                                      name="flexiDate"
                                      label="Start and end dates are flexible"
                                      checked={
                                        values.type !== "Long term"
                                          ? false
                                          : values.flexiDate
                                      }
                                      onChange={handleChange}
                                      onBlur={handleBlur}
                                      feedback={errors.flexiDate}
                                    />
                                  </Form.Group>
                                </Form>
                              </Form.Text>
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group controlId="formLongEndDate">
                              <Form.Label>
                                Long term - End date of volunteer work
                              </Form.Label>
                              <Form.Control
                                name="longEndDate"
                                type="date"
                                readOnly={
                                  values.type !== "Long term" ||
                                  values.flexiDate
                                }
                                value={values.longEndDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isValid={
                                  touched.longEndDate && !errors.longEndDate
                                }
                                isInvalid={
                                  touched.longEndDate && errors.longEndDate
                                }
                                min={
                                  values.longStartDate &&
                                  new Date() < new Date(values.longStartDate)
                                    ? new Date(values.longStartDate)
                                        .toISOString()
                                        .substring(0, 10)
                                    : new Date().toISOString().substring(0, 10)
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {errors.longEndDate}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group controlId="formLongHours">
                          <Form.Label>
                            Long term - Number of hours to commit
                          </Form.Label>
                          <Form.Control
                            name="longHours"
                            readOnly={
                              values.type !== "Long term" || values.flexiHours
                            }
                            value={values.flexiHours ? "NA" : values.longHours}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.longHours && !errors.longHours}
                            isInvalid={touched.longHours && errors.longHours}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.longHours}
                          </Form.Control.Feedback>
                          <Form.Text>
                            <Form>
                              <Form.Group>
                                <Form.Check
                                  name="flexiHours"
                                  label="Number of hours to commit is flexible"
                                  checked={
                                    values.type !== "Long term"
                                      ? false
                                      : values.flexiHours
                                  }
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  feedback={errors.flexiHours}
                                />
                              </Form.Group>
                            </Form>
                          </Form.Text>
                        </Form.Group>
                      </div>
                      {/* Ad hoc */}
                      <div
                        className={
                          values.type === "Ad hoc"
                            ? styles.typeDisplay
                            : styles.typeDisplayNone
                        }
                      >
                        <Form.Group controlId="formShiftNumber">
                          <Form.Label>Ad hoc - Number of shifts</Form.Label>
                          <Form.Control
                            name="shiftNumber"
                            disabled={
                              values.type !== "Ad hoc" ||
                              values.flexiShifts === true
                            }
                            placeholder={
                              values.type !== "Ad hoc"
                                ? 0
                                : values.flexiShifts === false
                                ? values.shiftNumber
                                : 0
                            }
                            value={
                              values.type !== "Ad hoc"
                                ? 0
                                : values.flexiShifts === false
                                ? values.shiftNumber
                                : 0
                            }
                            type="number"
                            min="0"
                            max="10"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.shiftNumber && !errors.shiftNumber}
                            isInvalid={
                              touched.shiftNumber && errors.shiftNumber
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.shiftNumber}
                          </Form.Control.Feedback>
                          <Form.Text>
                            <Form.Group controlId="formFlexiShifts">
                              <Form.Check
                                name="flexiShifts"
                                label="Flexible shifts"
                                disabled={values.type === "Long term"}
                                checked={
                                  values.type === "Long term"
                                    ? false
                                    : values.flexiShifts
                                }
                                onChange={handleChange}
                                onBlur={handleBlur}
                                feedback={errors.flexiShifts}
                              />
                            </Form.Group>
                          </Form.Text>
                        </Form.Group>
                      </div>

                      <Shifts
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        values={values}
                        touched={touched}
                        errors={errors}
                      />
                      {/* Remaining details */}
                      <h4 className={styles.jobHeader}>Additional details</h4>
                      <Form.Group controlId="formAddInfo">
                        <Form.Label>
                          Additional information
                          <Form.Text className="text-muted">
                            Here you can indicate any other relevant information
                            that would be good for the volunteers to know
                          </Form.Text>
                        </Form.Label>
                        <Form.Control
                          name="addInfo"
                          type="text"
                          as="textarea"
                          rows={2}
                          value={values.addInfo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.addInfo && !errors.addInfo}
                          isInvalid={touched.addInfo && errors.addInfo}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.addInfo}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group>
                        <Form.Label>
                          Upload image
                          <Form.Text className="text-muted">
                            An image that best captures the essence of the
                            volunteer job would be helpful in attracting more
                            volunteers
                          </Form.Text>
                        </Form.Label>
                        <Form.Control
                          name="file"
                          type="file"
                          onChange={uploadImage}
                          accept="image/*"
                        />
                        <div className={styles.imageContainer}>
                          {imageLoading ? (
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
                              alt="Volunteer"
                            />
                          ) : null}
                        </div>
                      </Form.Group>
                      <Form.Group controlId="formClosingDate">
                        <Form.Label>
                          Closing date
                          <Form.Text className="text-muted">
                            Indicating a closing date would give volunteers a
                            better sense of the application timeframe
                          </Form.Text>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          name="closingDate"
                          value={values.closingDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.closingDate && !errors.closingDate}
                          isInvalid={touched.closingDate && errors.closingDate}
                          min={new Date().toISOString().substring(0, 10)}
                          disabled={values.noClosingDate}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.closingDate}
                        </Form.Control.Feedback>
                        <Form.Text>
                          <Form>
                            <Form.Group>
                              <Form.Check
                                name="noClosingDate"
                                label="There is no closing date"
                                checked={values.noClosingDate}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                feedback={errors.noClosingDate}
                              />
                            </Form.Group>
                          </Form>
                        </Form.Text>
                      </Form.Group>
                    </div>
                  </Accordion.Collapse>
                </Accordion>
                {/* Contact details */}
                <Accordion defaultActiveKey="2">
                  <Accordion.Toggle as={Card.Header} eventKey="2">
                    <h5>Contact Details</h5>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="2">
                    <div className={styles.accordionBox}>
                      <Form.Group controlId="formRetrievePoc">
                        <Form.Check
                          name="retrievePoc"
                          label="Retrieve contact details from your profile"
                          checked={values.retrievePoc}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          feedback={errors.retrievePoc}
                          disabled={!canRetrievePocDetails}
                        />
                        <Form.Text>
                          {!loadingOrgDetails && !canRetrievePocDetails && (
                            <Alert variant="warning">
                              You need to fill in your contact details on{" "}
                              <Link to="/profile-organization">
                                your profile
                              </Link>{" "}
                              before we can help you autofill the form
                            </Alert>
                          )}
                        </Form.Text>
                      </Form.Group>
                      <Form.Group controlId="formPocName">
                        <Form.Label>Name of contact person</Form.Label>
                        <Form.Control
                          name="pocName"
                          type="text"
                          readOnly={values.retrievePoc}
                          // placeholder={
                          //   userData !== null ? userData.pocName : ""
                          // }
                          value={
                            values.retrievePoc
                              ? userData.pocName
                              : values.pocName
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.pocName && !errors.pocName}
                          isInvalid={touched.pocName && errors.pocName}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pocName}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="formPocNo">
                        <Form.Label>Mobile number of contact person</Form.Label>
                        <Form.Control
                          name="pocNo"
                          type="text"
                          readOnly={values.retrievePoc}
                          // placeholder={userData !== null ? userData.pocNo : ""}
                          value={
                            values.retrievePoc ? userData.pocNo : values.pocNo
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.pocNo && !errors.pocNo}
                          isInvalid={touched.pocNo && errors.pocNo}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pocNo}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group controlId="formPocEmail">
                        <Form.Label>Email address of contact person</Form.Label>
                        <Form.Control
                          name="pocEmail"
                          type="email"
                          readOnly={values.retrievePoc}
                          // placeholder={
                          //   userData !== null ? userData.pocEmail : ""
                          // }
                          value={
                            values.retrievePoc
                              ? userData.pocEmail
                              : values.pocEmail
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.pocEmail && !errors.pocEmail}
                          isInvalid={touched.pocEmail && errors.pocEmail}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.pocEmail}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </div>
                  </Accordion.Collapse>
                </Accordion>
                {/* Terms */}
                <Accordion defaultActiveKey="3">
                  <Accordion.Toggle as={Card.Header} eventKey="3">
                    <h5>Terms and Conditions of Use</h5>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey="3">
                    <div className={styles.accordionBox}>
                      <ol className={styles.terms}>
                        <TermsAndConditions />
                      </ol>
                      <Form.Group controlId="formTerms">
                        <Form.Check
                          name="terms"
                          label="I agree with the Terms and Conditions of Use"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.terms && !errors.terms}
                          isInvalid={touched.terms && errors.terms}
                          feedback={errors.terms}
                        />
                      </Form.Group>
                    </div>
                  </Accordion.Collapse>
                </Accordion>
              </Card>
              <Card.Text />
              {!loadingOrgDetails && !canRetrieveOrgDetails && (
                <Alert variant="danger">
                  You need to{" "}
                  <Link to="/profile-organization">
                    fill in your organization details
                  </Link>{" "}
                  before you are able to post a job. Thank you!
                </Alert>
              )}
              <Card.Text />
              <Button
                disabled={!canRetrieveOrgDetails || isSubmitting || message}
                variant="primary"
                type="submit"
                onClick={() => {
                  console.log(errors);
                  console.log(Object.keys(errors));
                  var errorMessages =
                    "You are unable to submit the form as the following fields have errors: ";
                  if (errors) {
                    for (const field in errors) {
                      errorMessages = errorMessages.concat(
                        `${fieldDict[field]}, `
                      );
                    }
                    if (!image) {
                      errorMessages = errorMessages.concat("image, ");
                    }
                    setError(errorMessages.slice(0, -2));
                  }
                }}
              >
                Post job
              </Button>
              <Card.Text />
              {error && <Alert variant="danger">{error}</Alert>}
              {isSubmitting && (
                <Alert variant="primary">Posting your job...</Alert>
              )}
              {message && (
                <Alert variant="success">
                  <Alert.Heading as="h6">{message}</Alert.Heading>
                  <hr />
                  <p className="mb-0">
                    Your job will be publicly available once it has been
                    approved by an administrator
                  </p>
                </Alert>
              )}
            </>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default PostAJob;

//FUNCTION TO CONVERT ALL THE SHIFT FIELDS INTO A SINGLE ADSHIFT OBJECT
function adShiftProcessor(
  shiftNumber,
  shift1Date,
  shift1Start,
  shift1End,
  shift2Date,
  shift2Start,
  shift2End,
  shift3Date,
  shift3Start,
  shift3End,
  shift4Date,
  shift4Start,
  shift4End,
  shift5Date,
  shift5Start,
  shift5End,
  shift6Date,
  shift6Start,
  shift6End,
  shift7Date,
  shift7Start,
  shift7End,
  shift8Date,
  shift8Start,
  shift8End,
  shift9Date,
  shift9Start,
  shift9End,
  shift10Date,
  shift10Start,
  shift10End
) {
  const temp = [
    [shift1Date, shift1Start, shift1End],
    [shift2Date, shift2Start, shift2End],
    [shift3Date, shift3Start, shift3End],
    [shift4Date, shift4Start, shift4End],
    [shift5Date, shift5Start, shift5End],
    [shift6Date, shift6Start, shift6End],
    [shift7Date, shift7Start, shift7End],
    [shift8Date, shift8Start, shift8End],
    [shift9Date, shift9Start, shift9End],
    [shift10Date, shift10Start, shift10End],
  ];

  const returnList = [];
  for (var i = 0; i < shiftNumber; i++) {
    var holder = { date: "", startTime: "", endTime: "" };
    holder.date = temp[i][0];
    holder.startTime = temp[i][1];
    holder.endTime = temp[i][2];
    returnList.push(holder);
  }
  return returnList;
}

//VALIDATION SCHEMA FOR INLINE FORM VALIDATION
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Please indicate the volunteer job title"),
  purpose: Yup.string().required(
    "Please indicate the purpose of the volunteer job"
  ),
  beneficiaries: Yup.array("Please select at least one beneficiary")
    .of(Yup.string())
    .required("Please select at least one beneficiary"),
  skills: Yup.array("Please select at least one skill")
    .of(Yup.string())
    .required("Please select at least one skill"),
  platform: Yup.string().required(
    "Please indicate if the volunteer platform is physical or virtual"
  ),
  multiLocation: Yup.bool(),
  location: Yup.string().when(["platform", "multiLocation"], {
    is: (platform, multiLocation) =>
      platform === "Physical" && multiLocation !== true,
    then: Yup.string().required(
      "Please indicate the location of the volunteer job"
    ),
  }),
  postalCode: Yup.string().when(["platform", "multiLocation"], {
    is: (platform, multiLocation) =>
      platform === "Physical" && multiLocation !== true,
    then: Yup.string("Please enter a 6 digit number")
      .matches(/^[0-9]+$/, "Please enter a 6 digit number")
      .min(6, "Please enter a 6 digit number")
      .max(6, "Please enter a 6 digit number")
      .required("Please indicate the postal code of the volunteer job"),
  }),
  type: Yup.string().required(
    "Please indicate if the commitment type is long term or ad hoc"
  ),
  flexiDate: Yup.bool(),
  longStartDate: Yup.date().when(["type", "flexiDate"], {
    is: (type, flexiDate) => type === "Long term" && flexiDate !== true,
    then: Yup.date().required(
      "Please indicate the start date of the volunteer job (If the date is flexible, tick 'Start and end dates are flexible'"
    ),
  }),
  longEndDate: Yup.date().when(["type", "flexiDate"], {
    is: (type, flexiDate) => type === "Long term" && flexiDate !== true,
    then: Yup.date().required(
      "Please indicate the end date of the volunteer job (If the date is flexible, tick 'Start and end dates are flexible'"
    ),
  }),
  flexiHours: Yup.bool(),
  longHours: Yup.number("Please enter a number")
    .typeError("Please enter a number")
    .when(["type", "flexiHours"], {
      is: (type, flexiHours) => type === "Long term" && flexiHours !== true,
      then: Yup.number("Please enter a number")
        .typeError("Please enter a number")
        .positive("Please only enter a positive number")
        .required("Please indicate the number of hours to commit"),
    }),
  flexiShifts: Yup.bool(),
  shiftNumber: Yup.number("Please only enter numbers").when(
    ["type", "flexiShifts"],
    {
      is: (type, flexiShifts) => type === "Ad hoc" && !flexiShifts,
      then: Yup.number("Please only enter numbers").required(
        "Please indicate the number of shifts"
      ),
    }
  ),

  shift1Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 1 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift1Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 1 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift1End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 1 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift2Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 2 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift2Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 2 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift2End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 2 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift3Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 3 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift3Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 3 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift3End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 3 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift4Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 4 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift4Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 4 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift4End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 4 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift5Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 5 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift5Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 5 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift5End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 5 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift6Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 6 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift6Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 6 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift6End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 6 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift7Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 7 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift7Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 7 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift7End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 7 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift8Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 8 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift8Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 8 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift8End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 8 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift9Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 9 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift9Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 9 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift9End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 9 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),
  shift10Date: Yup.date().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 10 && !flexiShifts,
    then: Yup.date().required("Please indicate the date of the shift"),
  }),
  shift10Start: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 10 && !flexiShifts,
    then: Yup.string().required("Please indicate the start time of the shift"),
  }),

  shift10End: Yup.string().when(["type", "shiftNumber", "flexiShifts"], {
    is: (type, shiftNumber, flexiShifts) =>
      type === "Ad hoc" && shiftNumber >= 10 && !flexiShifts,
    then: Yup.string().required("Please indicate the end time of the shift"),
  }),

  addInfo: Yup.string(),
  closingDate: Yup.date().when("noClosingDate", {
    is: false,
    then: Yup.date().required(
      "Please indicate the closing date of volunteer applications"
    ),
  }),
  noClosingDate: Yup.bool(),
  pocName: Yup.string().when("retrievePoc", {
    is: false,
    then: Yup.string().required("Please enter the name of contact person"),
  }),
  pocNo: Yup.string().when("retrievePoc", {
    is: false,
    then: Yup.string("Please enter only + symbols, spaces, or numbers")
      .matches(/^[0-9+ ]+$/, "Please enter only + symbols, spaces, or numbers")
      .required("Please enter the mobile number of contact person"),
  }),
  pocEmail: Yup.string().when("retrievePoc", {
    is: false,
    then: Yup.string()
      .email("Please enter a valid email address")
      .required("Please enter the email address of contact person"),
  }),
  retrievePoc: Yup.bool(),
  terms: Yup.bool()
    .required()
    .oneOf(
      [true],
      "Terms and Conditions of Use must be accepted to post a Job"
    ),
});

const fieldDict = {
  title: "Title",
  beneficiaries: "Beneficiaries",
  skills: "Skills",
  purpose: "Purpose",
  platform: "Platform",
  multiLocation: "Multiple locations",
  location: "Location",
  postalCode: "Postal code",
  type: "Commitment type",
  flexiDate: "Flexible dates",
  longStartDate: "Long term start date",
  longEndDate: "Long term end date",
  flexiHours: "Flexible hours",
  longHours: "Long term hours",
  flexiShifts: "Flexible shifts",
  shiftNumber: "Number of shifts",
  shift1Date: "Shift 1 date",
  shift1Start: "Shift 1 start time",
  shift1End: "Shift 1 end time",
  shift2Date: "Shift 2 date",
  shift2Start: "Shift 2 start time",
  shift2End: "Shift 2 end time",
  shift3Date: "Shift 3 date",
  shift3Start: "Shift 3 start time",
  shift3End: "Shift 3 end time",
  shift4Date: "Shift 4 date",
  shift4Start: "Shift 4 start time",
  shift4End: "Shift 4 end time",
  shift5Date: "Shift 5 date",
  shift5Start: "Shift 5 start time",
  shift5End: "Shift 5 end time",
  shift6Date: "Shift 6 date",
  shift6Start: "Shift 6 start time",
  shift6End: "Shift 6 end time",
  shift7Date: "Shift 7 date",
  shift7Start: "Shift 7 start time",
  shift7End: "Shift 7 end time",
  shift8Date: "Shift 8 date",
  shift8Start: "Shift 8 start time",
  shift8End: "Shift 8 end time",
  shift9Date: "Shift 9 date",
  shift9Start: "Shift 9 start time",
  shift9End: "Shift 9 end time",
  shift10Date: "Shift 10 date",
  shift10Start: "Shift 10 start time",
  shift10End: "Shift 10 end time",
  addInfo: "Additional information",
  closingDate: "Applications closing date",
  noClosingDate: "No closing date",
  pocName: "Contact person name",
  pocNo: "Contact person number",
  pocEmail: "Contact person email",
  retrievePoc: "Retrieve contact person from profile",
  terms: "Terms and conditions",
};
