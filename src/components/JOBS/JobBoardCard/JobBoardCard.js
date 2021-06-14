import { Row, Col, Card } from "react-bootstrap";
// import { useState } from "react";
// import JobBoardModal from "../JobBoardModal";
import {
  PeopleFill,
  PuzzleFill,
  GeoAltFill,
  GeoFill,
  ClockFill,
  CalendarWeekFill,
  ArrowRight,
} from "react-bootstrap-icons";
// import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./JobBoardCard.module.css";

const JobBoardCard = ({
  id,
  orgType,
  orgName,
  orgUen,
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
}) => {
  //!!!using api to find long lang of postal code (maybe can shift this to postajob so long lang attached to job)

  // const [coord, setCoord] = useState([]);

  // useEffect(() => {
  //   requestCoord();
  // }, [postalCode]);

  // async function requestCoord() {
  //   const res = await fetch(`https://geocode.xyz/${postalCode}?json=1`);
  //   const json = await res.json();
  //   setCoord([json.latt, json.longt]); //doesn't work because they have a limit on requests
  //   console.log(`${location}: ${coord}`);
  // }

  //!!!using browser capability to get long lang of user
  //!!! use openrouteservice to get the MATRIX distance using long lang of both user and location
  return (
    <div className={styles.cardContainer}>
      <Card>
        <Row>
          <Col lg={3}>
            {/* Image */}
            <div className={styles.imageContainer}>
              <Card.Img
                className={styles.image}
                src={imageUrl}
                alt="organization image"
              />
            </div>
          </Col>
          <Col lg={7}>
            <div className={styles.centreColumnWrapper}>
              {/* Title and Organization */}
              <div className={styles.titleWrapper}>
                <div>
                  <h4 className={styles.titleContainer}>{title}</h4>
                </div>
                <div>
                  <h6 className={styles.orgContainer}>by {orgName}</h6>
                </div>
              </div>
              {/* Beneficiaries */}
              <div className={styles.infoWrapper}>
                <PeopleFill />
                {beneficiaries.map((beneficiary, index) => {
                  if (index + 1 !== beneficiaries.length) {
                    return (
                      <div
                        key={index}
                        className={styles.infoContainer}
                      >{`${beneficiary},`}</div>
                    );
                  } else {
                    return (
                      <div className={styles.infoContainer}>{beneficiary}</div>
                    );
                  }
                })}
              </div>
              {/* Skills */}
              <div className={styles.infoWrapper}>
                <PuzzleFill />
                {skills.map((skill, index) => {
                  if (index + 1 !== skills.length) {
                    return (
                      <div
                        key={index}
                        className={styles.infoContainer}
                      >{`${skill},`}</div>
                    );
                  } else {
                    return <div className={styles.infoContainer}>{skill}</div>;
                  }
                })}
              </div>
              {/* Location */}
              <div className={styles.higherInfoWrapper}>
                <div className={styles.infoWrapper}>
                  <GeoAltFill />
                  <div className={styles.infoContainer}>
                    {platform === "Virtual"
                      ? "Virtual"
                      : multiLocation === true
                      ? "Multiple locations"
                      : location}
                  </div>
                </div>
                <div className={styles.infoWrapper}>
                  <div
                    className={
                      platform === "Virtual" || multiLocation === true
                        ? styles.distanceContainerNone
                        : styles.distanceContainer
                    }
                  >
                    <GeoFill />
                    <div
                      className={styles.infoContainer}
                    >{`<calculate distance from ${postalCode}>`}</div>
                  </div>
                </div>
              </div>
              {/* Long term or Ad hoc*/}
              <div className={styles.infoWrapper}>
                <ClockFill />
                <div className={styles.infoContainer}>{type}</div>
              </div>
              {/* Dates*/}
              <div className={styles.higherInfoWrapper}>
                <div className={styles.infoWrapper}>
                  <CalendarWeekFill />
                  <div className={styles.infoContainer}>
                    {type === "Long term"
                      ? !flexiDate
                        ? `${longStartDate.toDateString()} - ${longEndDate.toDateString()}`
                        : "Flexible dates"
                      : `${adShift[0].date.toDateString()} ${tConvert(
                          adShift[0].startTime
                        )} - ${tConvert(adShift[0].endTime)}`}
                  </div>
                </div>
                {/* Rendering other shifts */}
                <div className={styles.extraShiftWrapper}>
                  <div
                    className={
                      type === "Ad hoc"
                        ? adShift !== null
                          ? adShift.length > 1
                            ? styles.extraShiftContainer
                            : styles.extraShiftContainerNone
                          : styles.extraShiftContainerNone
                        : styles.extraShiftContainerNone
                    }
                  >
                    {/* Rendering number of other shifts and (s) */}
                    {`+${
                      type === "Ad hoc"
                        ? adShift !== null
                          ? adShift.length > 1
                            ? adShift.length - 1
                            : ""
                          : ""
                        : ""
                    } other shift${
                      type === "Ad hoc"
                        ? adShift !== null
                          ? adShift.length > 2
                            ? "s"
                            : ""
                          : ""
                        : ""
                    }`}
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={2}>
            {/* Learn More Button */}
            <div className={styles.buttonWrapper}>
              <Link to={`/jobs/${id}`} target="blank">
                <div className={styles.button} variant="primary">
                  <h6 className={styles.buttonText}>Learn more</h6>
                  <ArrowRight className={styles.buttonArrow} />
                </div>
              </Link>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default JobBoardCard;

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

// function distance(lat1, lon1, lat2, lon2) {
//   var p = 0.017453292519943295; // Math.PI / 180
//   var c = Math.cos;
//   var a =
//     0.5 -
//     c((lat2 - lat1) * p) / 2 +
//     (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;

//   return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
// }
