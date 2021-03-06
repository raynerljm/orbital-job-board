//IMPORTS
//React Hooks
import { useState } from "react";
//Boostrap
import { Card, Button, Col, Row } from "react-bootstrap";
import {
  HourglassSplit,
  XCircleFill,
  CheckCircleFill,
} from "react-bootstrap-icons";
//CSS Modules
import styles from "./ApplicantsModalCard.module.css";

import { useNotif } from "../../../contexts/NotifContext";
import { useOrg } from "../../../contexts/OrgContext";
import { useEmail } from "../../../contexts/EmailContext";

//Unique ID
var uniqid = require("uniqid");

const ApplicantsModalCard = ({
  id,
  stuID,
  jobID,
  status,
  stuAddInfo,
  dateApplied,
  name,
  email,
  contactNo,
  course,
  yearOfStudy,
  title,
  changed,
  setChanged,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const { acceptRejectApplication } = useOrg();
  const { sendNotif } = useNotif();
  const { sendEmail } = useEmail();

  //FUNCTIONS
  //Accept or reject an applicant
  const handleAcceptReject = async (choice) => {
    setSubmitted(true);
    try {
      await acceptRejectApplication(id, choice);
      setChanged(!changed);
      //SEND UPDATE EMAILS
      const text = `Hello ${name}! There has been an update to your volunteer application. Please click on the link below and log in to view the updates to your application! volunteer-ccsgp-vercel.app`;
      const html = `Hello ${name}!<br>There has been an update to your volunteer application. <br>Please click on the link below and log in to view the updates to your application! <a href="volunteer-ccsgp-vercel.app">volunteer-ccsgp-vercel.app</a>`;
      const msg = {
        msg: {
          to: email,
          from: "volunteerccsgp@gmail.com",
          subject: `[Volunteer CCSGP] Change in status of your job application for ${title}`,
          text: text,
          html: html,
        },
      };
      await sendEmail(msg);

      //SEND NEW NOTIFS
      const newNotif = {
        newNotif: {
          id: uniqid(),
          receiverID: stuID,
          header: "Change in status of job application",
          message: `Your application for a job (${title}) has been ${choice}.`,
          dateTime: new Date().toUTCString(),
          dismissed: false,
        },
      };

      await sendNotif(newNotif);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitted(false);
    }
  };

  return (
    <Card>
      <div className={styles.cardContainer}>
        <Row>
          <Col lg={9}>
            <div className={styles.topRowContainer}>
              <h5>{name}</h5>
              <div
                className={
                  status === "Pending" ? styles.pending : styles.displayNone
                }
              >
                <HourglassSplit />
                Pending
              </div>
              <div
                className={
                  status === "Rejected" ? styles.rejected : styles.displayNone
                }
              >
                <XCircleFill />
                Rejected
              </div>
              <div
                className={
                  status === "Accepted" ? styles.accepted : styles.displayNone
                }
              >
                <CheckCircleFill />
                Accepted
              </div>
            </div>
            <h6>Submitted on {dateApplied}</h6>
            <h6>Course of study: {course}</h6>
            <h6>Year of study: {yearOfStudy}</h6>
            <h6>Mobile number: {contactNo}</h6>
            <h6>Email address: {email}</h6>
            <h6>
              Additional information:
              <br />
              {stuAddInfo}
            </h6>
          </Col>
          <Col lg={3}>
            <div className={styles.buttonContainer}>
              <div className={styles.buttonWrapper}>
                <div
                  className={
                    status === "Pending" ? styles.display : styles.displayNone
                  }
                >
                  <Button
                    variant="danger"
                    onClick={(event) => handleAcceptReject(event.target.value)}
                    value="Rejected"
                    disabled={submitted}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="success"
                    onClick={(event) => handleAcceptReject(event.target.value)}
                    value="Accepted"
                    className={styles.acceptButton}
                    disabled={submitted}
                  >
                    Accept
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Card>
  );
};

export default ApplicantsModalCard;
