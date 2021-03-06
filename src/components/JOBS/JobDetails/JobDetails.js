//IMPORTS
//React Hooks
import { useEffect, useState } from "react";
//Bootstrap
import { Row, Col, Alert } from "react-bootstrap";
//Components
import {
  JobDetailsApplyModal,
  ApplyButton,
  DisabledButton,
} from "../JobDetailsApplyModal/JobDetailsApplyModal";
import {
  JobDetailsAdminRejModal,
  AdminOpenRejModalButton,
  JobDetailsAdminAppModal,
  AdminOpenAppModalButton,
  JobDetailsAdminTDModal,
  AdminOpenTDModalButton,
} from "../JobDetailsAdminModal/JobDetailsAdminModal";
import { Loading, Empty } from "../../EmptyStates/EmptyStates";
//Contexts
import { useAuth } from "../../../contexts/AuthContext";
import { useJob } from "../../../contexts/JobContext";
import { useStu } from "../../../contexts/StuContext";
//React Router
import { Link, useHistory } from "react-router-dom";
//Images
import noImage from "../../../assets/emptyStates/noImage.png";
//CSS Modules
import styles from "./JobDetails.module.css";
//Unique ID Generator
var uniqid = require("uniqid");

const JobDetails = ({ id }) => {
  //USESTATES
  //Determining the show state of the modals
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showAdminRejModal, setShowAdminRejModal] = useState(false);
  const [showAdminAppModal, setShowAdminAppModal] = useState(false);
  const [showAdminTDModal, setShowAdminTDModal] = useState(false);
  //The jobs, orgs and applications retireved
  const [job, setJob] = useState();
  const [org, setOrg] = useState();
  const [myApp, setMyApp] = useState();
  //If org is still loading
  const [orgLoading, setOrgLoading] = useState(true);
  //Default Image Source
  const [imageSrc, setImageSrc] = useState("");
  //Chat button
  const [loadingChatButton, setLoadingChatButton] = useState(true);
  const [buttonMakesNewChat, setButtonMakesNewChat] = useState(false);
  //Retrieving lat and lng from browser
  const [myLng, setMyLng] = useState();
  const [myLat, setMyLat] = useState();

  //CUSTOM HOOKS
  const history = useHistory();
  const { currentUser, userType, userVerified } = useAuth();
  const { getJobDetails, getOrgPublic } = useJob();
  const { getAppForJob, postChat, checkExists } = useStu();

  async function getPageData() {
    const job = await getJobDetails(id);
    setJob(job);
    if (currentUser) {
      const app = await getAppForJob(id, currentUser.email);
      setMyApp(app);
    }
    const org = await getOrgPublic(job.orgID);
    setOrg(org);
    setImageSrc(job.imageUrl);
    setOrgLoading(false);
    if (job.platform === "Physical" && !job.multiLocation) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setMyLng(position.coords.longitude);
          setMyLat(position.coords.latitude);
        });
      } else {
        setMyLng(false);
        setMyLat(false);
      }
    }
  }
  //Retrieving organization data
  useEffect(() => {
    getPageData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showApplyModal]);

  //FUNCTION TO CREATE NEW CHAT
  async function handleChatNow(event) {
    try {
      setLoadingChatButton(true);
      const body = {
        id: uniqid(),
        alt: "avatar",
        stuID: currentUser.email,
        orgID: job.orgID,
      };
      await postChat(body);
    } catch (err) {
      console.log(err);
    }
  }

  //FUNCTION TO CHECK IF CHAT ALREADY EXISTS
  const checkIfExists = async () => {
    const alreadyExists = await checkExists(currentUser.email, job.orgID);
    if (!alreadyExists) {
      setButtonMakesNewChat(true);
    }
    setLoadingChatButton(false);
  };

  //CHAT NOW BUTTON COMPONENT
  const ChatNowButton = () => {
    checkIfExists();

    if (loadingChatButton) {
      return <div className={styles.button}>Loading...</div>;
    } else if (currentUser && userType === "student" && userVerified) {
      if (buttonMakesNewChat) {
        return (
          <div
            className={styles.button}
            onClick={async (event) => {
              await handleChatNow(event);
              history.push("/chat-student");
            }}
          >
            Chat now
          </div>
        );
      } else {
        return (
          <div
            className={styles.button}
            onClick={() => history.push("/chat-student")}
          >
            Go to existing chat
          </div>
        );
      }
    } else {
      return (
        <div className={styles.disabledButton}>Please verify your email</div>
      );
    }
  };

  //LOADING
  if (orgLoading) {
    return <Loading>Loading job details...</Loading>;
  }

  //DESTRUCTURING JOB AND RETRIEVING ORG DETAILS
  const {
    orgID,
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
    flexiShifts,
    adShift,
    addInfo,
    imageUrl,
    closingDate,
    noClosingDate,
    pocName,
    pocNo,
    pocEmail,
    datePosted,
    removalReason,
    removalPerson,
    removalDate,
    applicants,
    lat,
    lng,
  } = job;
  const orgType = org.type;
  const orgName = org.name;
  const orgUen = org.uen;

  //CREATING DISPLAYSTATES

  // SIGNED OUT
  //0: Show: Apply button

  // STUDENTS
  //16: Haven't apply; Show: Apply button, Chat now button
  //1: Applied & Job Approved; Show: Disabled Apply button, Chat now button
  //11: Applied & Accepted & Job Taken down; Show: Disabled apply button, Alert that job is taken down, Chat now button
  //12: Applied & Accepted & Job Completed; Show: Disabled apply button, Alert that job is completed
  //17: Applied & Accepted & Job Pending; Show: Disabled apply button, Alert that job is pending, Chat now button

  // ORGANIZATIONS
  //2: Not their job & Job Approved; Show: No button;
  //3: Their job & Job Pending; Show: Alert that job is still pending, Edit job button
  //4: Their job & Job Approved; Show: Alert that job is visible, Edit job button
  //5: Their job & Job Rejected; Show: Alert that job is rejected with removal reason, Edit job button
  //10: Their job & Job Completed; Show: Alert that job is completed
  //14: Their job & Job TakenDown; Show:  Alert that job is taken down with removal reason, Edit job button

  // ADMINS
  //6: Job Pending; Show: Reject button and  Approve button
  //7: Job Approved; Show: Alert that the job is approved + Takedown button
  //8: Job Rejected; Show: Alert that the job is rejected with removal reason
  //13: Job Completed; Show: Alert that the job is completed
  //15: Job TakenDown; Show: Alert that job is taken down with removal reason

  // NOT AVAILABLE
  //9: Everything else will display an unavailable state

  var displayState;
  //SIGNED OUT
  if (currentUser === null) {
    if (status === "Approved") {
      displayState = 0;
    } else {
      displayState = 9;
    }
  }
  //STUDENTS
  else if (currentUser !== null && userType === "student") {
    if (status === "Approved") {
      if (applicants === null || !applicants.includes(currentUser.email)) {
        displayState = 16;
      } else if (
        applicants !== null &&
        applicants.includes(currentUser.email)
      ) {
        displayState = 1;
      }
    } else if (status === "TakenDown") {
      if (myApp && myApp.status === "Accepted") {
        displayState = 11;
      } else {
        displayState = 9;
      }
    } else if (status === "Completed") {
      if (myApp && myApp.status === "Accepted") {
        displayState = 12;
      } else {
        displayState = 9;
      }
    } else if (status === "Pending") {
      if (myApp && myApp.status === "Accepted") {
        displayState = 17;
      } else {
        displayState = 9;
      }
    } else {
      displayState = 9;
    }
  }
  //ORGANIZATIONS
  else if (currentUser !== null && userType === "organization") {
    if (orgID !== currentUser.email) {
      if (status === "Approved") {
        displayState = 2;
      } else {
        displayState = 9;
      }
    } else if (orgID === currentUser.email) {
      if (status === "Pending") {
        displayState = 3;
      } else if (status === "Approved") {
        displayState = 4;
      } else if (status === "Rejected") {
        displayState = 5;
      } else if (status === "Completed") {
        displayState = 10;
      } else if (status === "TakenDown") {
        displayState = 14;
      }
    } else {
      displayState = 9;
    }
  }
  //ADMINS
  else if (currentUser !== null && userType === "admin") {
    if (status === "Pending") {
      displayState = 6;
    } else if (status === "Approved") {
      displayState = 7;
    } else if (status === "Rejected") {
      displayState = 8;
    } else if (status === "Completed") {
      displayState = 13;
    } else if (status === "TakenDown") {
      displayState = 15;
    } else {
      displayState = 9;
    }
  } else {
    displayState = 9;
  }

  //Unavailable state
  if (displayState === 9) {
    return (
      <Empty
        title={"This job is not available for viewing"}
        actions={[
          {
            tip: "If you are an NUS student, click here to",
            button: "View jobs",
            link: "/jobs",
          },
        ]}
      />
    );
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {displayState === 3 ? (
            <Alert variant="warning">
              Your job is still pending approval and is not publicly visible
            </Alert>
          ) : displayState === 4 ? (
            <Alert variant="success">
              Your job has been approved and is publicly visible
            </Alert>
          ) : displayState === 5 ? (
            <Alert variant="danger">
              Your job has been rejected and is not publicly visible
              <hr />
              Reason for rejection: {removalReason}
              <br />
              Rejected by: {removalPerson}
              <br />
              Rejected on: {new Date(removalDate).toDateString()}
            </Alert>
          ) : displayState === 7 ? (
            <Alert variant="success">
              This job has been approved and is publicly visible
            </Alert>
          ) : displayState === 8 ? (
            <Alert variant="danger">
              This job has been rejected and is not publicly visible
              <hr />
              Reason for rejection: {removalReason}
              <br />
              Rejected by: {removalPerson}
              <br />
              Rejected on: {new Date(removalDate).toDateString()}
            </Alert>
          ) : displayState === 10 ? (
            <Alert variant="primary">
              This job has been completed and is not publicly visible
            </Alert>
          ) : displayState === 11 ? (
            <Alert variant="danger">
              This job has been taken down and is not publicly visible. Please
              contact the organization if you have further queries.
            </Alert>
          ) : displayState === 12 ? (
            <Alert variant="primary">
              This job has been completed and is not publicly visible
            </Alert>
          ) : displayState === 13 ? (
            <Alert variant="primary">
              This job has been completed and is not publicly visible
            </Alert>
          ) : displayState === 14 ? (
            <Alert variant="danger">
              Your job has been taken down and is not publicly visible.
              <hr />
              Reason for takedown: {removalReason}
              <br />
              Taken down by: {removalPerson}
              <br />
              Taken down on: {new Date(removalDate).toDateString()}
            </Alert>
          ) : displayState === 15 ? (
            <Alert variant="danger">
              This job has been taken down and is not publicly visible.
              <hr />
              Reason for takedown: {removalReason}
              <br />
              Taken down by: {removalPerson}
              <br />
              Taken down on: {new Date(removalDate).toDateString()}
            </Alert>
          ) : displayState === 17 ? (
            <Alert variant="warning">
              This job has been edited by the organization and requires
              re-approval and is hence not publicly visible. Please contact the
              organization if you have further queries.
            </Alert>
          ) : null}
          <Row>
            <Col md={2}>
              <div className={styles.imageCol}>
                <img
                  className={styles.image}
                  src={imageSrc}
                  onError={() => setImageSrc(noImage)}
                  alt="volunteer"
                />
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.detailCol}>
                <div className={styles.detailContainer}>
                  <h3>{title}</h3>
                  <hr className={styles.divider} />
                  {datePosted && (
                    <h7>
                      {`Posted on: ${new Date(datePosted).toDateString()}`}
                      <br />
                    </h7>
                  )}

                  <h7>
                    {noClosingDate
                      ? "No closing date for applications"
                      : `Applications close on: ${new Date(
                          closingDate
                        ).toDateString()}`}
                  </h7>
                  <hr />
                  <h5 className={styles.sectionHeader}>About</h5>
                  <div className={styles.lineWrapper}>
                    <h7 className={styles.aboutHeader}>
                      Beneficiaries:
                      <br />{" "}
                    </h7>
                    {beneficiaries.map((beneficiary, index) => {
                      if (index + 1 !== beneficiaries.length) {
                        return <h7 key={index}>{`${beneficiary}, `}</h7>;
                      } else {
                        return <h7 key={index}>{beneficiary}</h7>;
                      }
                    })}
                  </div>
                  <div className={styles.lineWrapper}>
                    <h7 className={styles.aboutHeader}>
                      Skills:
                      <br />{" "}
                    </h7>
                    {skills.map((skill, index) => {
                      if (index + 1 !== skills.length) {
                        return <h7 key={index}>{`${skill}, `}</h7>;
                      } else {
                        return <h7 key={index}>{skill}</h7>;
                      }
                    })}
                  </div>
                  <h7 className={styles.aboutHeader}>
                    Purpose:
                    <br />{" "}
                  </h7>
                  <h7>{purpose}</h7>
                </div>
                <div className={styles.detailContainer}>
                  <h5 className={styles.sectionHeader}>Location</h5>
                  <div className={styles.lineWrapper}>
                    <h7 className={styles.aboutHeader}>
                      Platform:
                      <br />{" "}
                    </h7>
                    <h7>
                      {platform}
                      <br />
                    </h7>
                  </div>
                  <div
                    className={
                      platform === "Physical"
                        ? styles.display
                        : styles.displayNone
                    }
                  >
                    <div className={styles.lineWrapper}>
                      <h7 className={styles.aboutHeader}>
                        Location:
                        <br />
                      </h7>
                      <h7>
                        {platform !== "Physical" || multiLocation === true
                          ? "Multiple locations"
                          : location}
                      </h7>
                    </div>
                    <div
                      className={
                        multiLocation === true
                          ? styles.displayNone
                          : styles.display
                      }
                    >
                      <div className={styles.lineWrapper}>
                        <h7 className={styles.aboutHeader}>
                          Postal code:
                          <br />
                        </h7>
                        <h7>{`S(${postalCode}) `}</h7>
                        <h7>
                          {platform === "Physical" &&
                            !multiLocation &&
                            myLat &&
                            myLng &&
                            `${distance(myLat, myLng, lat, lng).toFixed(
                              2
                            )}km away`}
                          <br />
                        </h7>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.detailContainer}>
                  <h5 className={styles.sectionHeader}>Commitment period</h5>
                  <div className={styles.lineWrapper}>
                    <h7 className={styles.aboutHeader}>
                      Commitment type:
                      <br />
                    </h7>
                    <h7>
                      {type}
                      <br />
                    </h7>
                  </div>
                  <div
                    className={
                      type === "Long term" ? styles.display : styles.displayNone
                    }
                  >
                    <div className={styles.lineWrapper}>
                      <h7 className={styles.aboutHeader}>
                        Dates:
                        <br />
                      </h7>
                      <h7>
                        {type === "Long term"
                          ? !flexiDate
                            ? `${new Date(
                                longStartDate
                              ).toDateString()} - ${new Date(
                                longEndDate
                              ).toDateString()}`
                            : "Flexible start and end date"
                          : ""}
                        <br />
                      </h7>
                    </div>
                    <div className={styles.lineWrapper}>
                      <h7 className={styles.aboutHeader}>
                        Required hours:
                        <br />
                      </h7>
                      <h7>
                        {flexiHours === false
                          ? longHours
                          : "Flexible required hours"}
                        <br />
                      </h7>
                    </div>
                  </div>
                  <div
                    className={
                      type === "Ad hoc" ? styles.display : styles.displayNone
                    }
                  >
                    <div className={styles.shiftWrapper}>
                      <h7 className={styles.aboutHeader}>
                        Shifts:
                        <br />
                      </h7>
                      <span>
                        {type === "Ad hoc" ? (
                          !flexiShifts ? (
                            adShift && adShift.length > 0 ? (
                              <>
                                <ol>
                                  {adShift.map((shift, index) => {
                                    return (
                                      <li key={index}>
                                        <h7>
                                          {`${new Date(
                                            shift.date
                                          ).toDateString()} ${tConvert(
                                            shift.startTime
                                          )} - ${tConvert(shift.endTime)}`}
                                        </h7>
                                      </li>
                                    );
                                  })}
                                </ol>
                              </>
                            ) : (
                              <span>No shifts indicated</span>
                            )
                          ) : (
                            <span>Flexible shifts</span>
                          )
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h5 className={styles.sectionHeader}>
                    Additional information
                  </h5>
                  <h7>{addInfo}</h7>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className={styles.orgCol}>
                <div className={styles.orgContainer}>
                  <h5>by {orgName}</h5>
                  <hr className={styles.divider} />
                  <h7>
                    {orgType}
                    <br />
                  </h7>
                  {(displayState === 6 ||
                    displayState === 7 ||
                    displayState === 8) &&
                    orgType === "Non-NUS Organization" && (
                      <h7 className="text-muted">
                        UEN: {orgUen}
                        <br />
                      </h7>
                    )}
                  <h7>
                    <a href={`mailto:${orgID}`}>{orgID}</a>
                  </h7>
                </div>
                <div className={styles.orgContainer}>
                  <h5>Contact us</h5>
                  <hr className={styles.divider} />
                  <h7>
                    {pocName}
                    <br />
                  </h7>
                  <h7>
                    {pocNo}
                    <br />
                  </h7>
                  <h7>
                    <a href={`mailto:${pocEmail}`}>{pocEmail}</a>
                  </h7>
                </div>
                {(displayState === 16 ||
                  displayState === 1 ||
                  displayState === 11 ||
                  displayState === 17) && (
                  <div className={styles.buttonRow}>
                    <ChatNowButton />
                  </div>
                )}
                {(displayState === 3 ||
                  displayState === 4 ||
                  displayState === 5 ||
                  displayState === 14) && (
                  <div className={styles.buttonRow}>
                    <Link
                      to={`/your-jobs/edit/${id}`}
                      className={styles.button}
                    >
                      Edit job
                    </Link>
                  </div>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col md={2} />
            <Col md={6}>
              <div className={styles.buttonRow}>
                {displayState === 0 || displayState === 16 ? (
                  <ApplyButton handleClick={() => setShowApplyModal(true)} />
                ) : displayState === 1 ||
                  displayState === 11 ||
                  displayState === 12 ||
                  displayState === 17 ? (
                  <DisabledButton />
                ) : displayState === 6 ? (
                  <>
                    <AdminOpenRejModalButton
                      handleClick={() => setShowAdminRejModal(true)}
                    />
                    <AdminOpenAppModalButton
                      handleClick={() => setShowAdminAppModal(true)}
                    />
                  </>
                ) : displayState === 7 ? (
                  <AdminOpenTDModalButton
                    handleClick={() => setShowAdminTDModal(true)}
                  />
                ) : null}
              </div>
            </Col>
            <Col md={4} />
          </Row>
        </div>
      </div>
      {displayState === 0 || displayState === 16 ? (
        <JobDetailsApplyModal
          show={showApplyModal}
          onHide={() => setShowApplyModal(false)}
          id={id}
          orgType={orgType}
          orgName={orgName}
          orgEmail={orgID}
          status={status}
          title={title}
          beneficiaries={beneficiaries}
          skills={skills}
          purpose={purpose}
          platform={platform}
          multiLocation={multiLocation}
          location={location}
          postalCode={postalCode}
          type={type}
          flexiDate={flexiDate}
          longStartDate={longStartDate}
          longEndDate={longEndDate}
          flexiHours={flexiHours}
          longHours={longHours}
          adShift={adShift}
          addInfo={addInfo}
          imageUrl={imageUrl}
          pocName={pocName}
          pocNo={pocNo}
          pocEmail={pocEmail}
          applicants={applicants}
        />
      ) : displayState === 6 ? (
        <>
          <JobDetailsAdminRejModal
            show={showAdminRejModal}
            onHide={() => setShowAdminRejModal(false)}
            id={id}
            orgType={orgType}
            orgName={orgName}
            orgEmail={orgID}
            status={status}
            title={title}
            beneficiaries={beneficiaries}
            skills={skills}
            purpose={purpose}
            platform={platform}
            multiLocation={multiLocation}
            location={location}
            postalCode={postalCode}
            type={type}
            flexiDate={flexiDate}
            longStartDate={longStartDate}
            longEndDate={longEndDate}
            flexiHours={flexiHours}
            longHours={longHours}
            adShift={adShift}
            addInfo={addInfo}
            imageUrl={imageUrl}
            pocName={pocName}
            pocNo={pocNo}
            pocEmail={pocEmail}
            applicants={applicants}
          />
          <JobDetailsAdminAppModal
            show={showAdminAppModal}
            onHide={() => setShowAdminAppModal(false)}
            id={id}
            orgType={orgType}
            orgName={orgName}
            orgEmail={orgID}
            status={status}
            title={title}
            beneficiaries={beneficiaries}
            skills={skills}
            purpose={purpose}
            platform={platform}
            multiLocation={multiLocation}
            location={location}
            postalCode={postalCode}
            type={type}
            flexiDate={flexiDate}
            longStartDate={longStartDate}
            longEndDate={longEndDate}
            flexiHours={flexiHours}
            longHours={longHours}
            adShift={adShift}
            addInfo={addInfo}
            imageUrl={imageUrl}
            pocName={pocName}
            pocNo={pocNo}
            pocEmail={pocEmail}
            applicants={applicants}
          />
        </>
      ) : displayState === 7 ? (
        <JobDetailsAdminTDModal
          show={showAdminTDModal}
          onHide={() => setShowAdminTDModal(false)}
          id={id}
          orgType={orgType}
          orgName={orgName}
          orgEmail={orgID}
          status={status}
          title={title}
          beneficiaries={beneficiaries}
          skills={skills}
          purpose={purpose}
          platform={platform}
          multiLocation={multiLocation}
          location={location}
          postalCode={postalCode}
          type={type}
          flexiDate={flexiDate}
          longStartDate={longStartDate}
          longEndDate={longEndDate}
          flexiHours={flexiHours}
          longHours={longHours}
          adShift={adShift}
          addInfo={addInfo}
          imageUrl={imageUrl}
          pocName={pocName}
          pocNo={pocNo}
          pocEmail={pocEmail}
          applicants={applicants}
        />
      ) : null}
    </>
  );
};

export default JobDetails;

//FUNCTION TO CONVERT TIME FORMAT
function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ];

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1); // Remove full string match value
    time[5] = +time[0] < 12 ? "AM" : "PM"; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(""); // return adjusted time or original string
}

//FUNCTION TO CALCULATE DISTANCE BETWEEN TWO PLACES WITH LAT LNG
function distance(lat1, lon1, lat2, lon2) {
  var p = 0.017453292519943295; // Math.PI / 180
  var c = Math.cos;
  var a =
    0.5 -
    c((lat2 - lat1) * p) / 2 +
    (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

  return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}
